import { onGetCookies } from '@/utils/cookies/cookiesHelper'

export interface SSEMessage {
  id?: string
  event?: string
  data: any
}

export type SSEEventType = 'notification' | 'connected' | 'heartbeat' | 'error'

export interface SSESubscriber {
  id: string
  callback: (message: SSEMessage) => void
  eventType?: SSEEventType
}

/**
 * SSE Service for real-time notification streaming
 * Handles Server-Sent Events connection and message distribution
 * Uses fetch API with ReadableStream to support Authorization headers
 */
export class SSEService {
  private abortController: AbortController | null = null
  private subscribers: Map<string, SSESubscriber> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private reconnectTimer: NodeJS.Timeout | null = null
  private isConnecting = false
  private isConnected = false
  private baseUrl: string
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  }

  /**
   * Connect to SSE endpoint using fetch API with ReadableStream
   * @param token - Authentication token (required)
   */
  async connect(token?: string): Promise<boolean> {
    if (this.isConnecting || this.isConnected) {
      return true
    }

    // Token is required
    if (!token) {
      console.error('SSE: No auth token provided')
      return false
    }

    try {
      this.isConnecting = true
      const url = `${this.baseUrl}/notifications/sse/stream`

      // Create abort controller for cleanup
      this.abortController = new AbortController()

      // Fetch with SSE headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
          Cache: 'no-cache',
        },
        signal: this.abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`SSE connection failed: ${response.statusText}`)
      }

      if (!response.body) {
        throw new Error('SSE response body is null')
      }

      this.isConnecting = false
      this.isConnected = true
      this.reconnectAttempts = 0
      this.clearReconnectTimer()

      console.log('SSE: Connection opened')

      // Notify connected
      this.notifySubscribers('connected', {
        event: 'connected',
        data: { timestamp: new Date().toISOString() },
      })

      // Read the stream
      this.reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await this.reader.read()

          if (done) {
            console.log('SSE: Stream ended')
            break
          }

          // Decode chunk and add to buffer
          buffer += decoder.decode(value, { stream: true })

          // Process complete SSE messages
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer

          let currentEvent: SSEMessage = { data: {} }
          let currentEventType = 'message'

          for (const line of lines) {
            if (line.trim() === '') {
              // Empty line indicates end of message
              if (currentEvent.data && Object.keys(currentEvent.data).length > 0) {
                try {
                  const parsedData = JSON.parse(currentEvent.data as any)
                  this.notifySubscribers(currentEventType as SSEEventType, {
                    id: currentEvent.id,
                    event: currentEventType,
                    data: parsedData,
                  })
                } catch (err) {
                  // If not JSON, use as string
                  this.notifySubscribers(currentEventType as SSEEventType, {
                    id: currentEvent.id,
                    event: currentEventType,
                    data: currentEvent.data,
                  })
                }
              }
              currentEvent = { data: {} }
              currentEventType = 'message'
            } else if (line.startsWith('event:')) {
              currentEventType = line.substring(6).trim()
            } else if (line.startsWith('id:')) {
              currentEvent.id = line.substring(3).trim()
            } else if (line.startsWith('data:')) {
              const data = line.substring(5).trim()
              currentEvent.data = data
            } else if (line.startsWith('retry:')) {
              // Ignore retry for now
            }
          }
        }
      } catch (readError: any) {
        // Handle read errors (including AbortError)
        if (readError.name === 'AbortError') {
          console.log('SSE: Stream aborted (disconnect requested)')
          // Don't reconnect if aborted
          this.isConnected = false
          this.reader = null
          return false
        }
        throw readError // Re-throw other errors
      }

      // Stream ended normally, handle reconnection
      this.isConnected = false
      this.reader = null
      this.handleReconnect()
      return true
    } catch (error: any) {
      console.error('SSE: Connection error', error)
      this.isConnecting = false
      this.isConnected = false
      this.reader = null

      if (error.name !== 'AbortError') {
        this.handleReconnect()
      }

      return false
    }
  }

  /**
   * Disconnect from SSE endpoint
   */
  disconnect(): void {
    this.clearReconnectTimer()

    // Abort fetch request
    if (this.abortController) {
      try {
        // Only abort if not already aborted
        if (this.abortController.signal && !this.abortController.signal.aborted) {
          this.abortController.abort()
        }
      } catch (error) {
        // Ignore abort errors (AbortError is expected)
      }
      this.abortController = null
    }

    // Cancel reader
    if (this.reader) {
      this.reader.cancel().catch(() => {
        // Ignore cancel errors
      })
      this.reader = null
    }

    this.isConnecting = false
    this.isConnected = false
    this.reconnectAttempts = 0
    console.log('SSE: Disconnected')
  }

  /**
   * Subscribe to SSE events
   * @param callback - Function to call when event is received
   * @param eventType - Optional event type filter
   * @param token - Authentication token (required for auto-connect)
   * @returns Subscription ID for unsubscribing
   */
  subscribe(
    callback: (message: SSEMessage) => void,
    eventType?: SSEEventType,
    token?: string,
  ): string {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.subscribers.set(id, { id, callback, eventType })

    // Auto-connect if not connected and token is provided
    if (!this.getConnectionStatus() && !this.isConnecting && token) {
      this.connect(token)
    }

    return id
  }

  /**
   * Unsubscribe from SSE events
   * @param subscriptionId - Subscription ID returned from subscribe()
   */
  unsubscribe(subscriptionId: string): void {
    this.subscribers.delete(subscriptionId)

    // Disconnect if no subscribers
    if (this.subscribers.size === 0) {
      this.disconnect()
    }
  }

  /**
   * Check if currently connected
   */
  getConnectionStatus(): boolean {
    return this.isConnected
  }

  /**
   * Notify all subscribers of an event
   */
  private notifySubscribers(eventType: SSEEventType, message: SSEMessage): void {
    this.subscribers.forEach((subscriber) => {
      if (!subscriber.eventType || subscriber.eventType === eventType) {
        try {
          subscriber.callback(message)
        } catch (error) {
          console.error('SSE: Error in subscriber callback', error)
        }
      }
    })
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('SSE: Max reconnection attempts reached')
      this.notifySubscribers('error', {
        event: 'error',
        data: { message: 'Max reconnection attempts reached' },
      })
      return
    }

    this.clearReconnectTimer()

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    console.log(
      `SSE: Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    )

    // Note: Reconnection will need token, but we'll get it from cookies
    // This is a fallback - ideally reconnection should be handled by re-subscribing
    this.reconnectTimer = setTimeout(async () => {
      const tokenResult = await onGetCookies('authToken')
      if (!tokenResult.isError && tokenResult.cookies) {
        this.connect(tokenResult.cookies as string)
      }
    }, delay)
  }

  /**
   * Clear reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}

// Singleton instance
let sseServiceInstance: SSEService | null = null

/**
 * Get SSE service singleton instance
 */
export function getSSEService(): SSEService {
  if (!sseServiceInstance) {
    sseServiceInstance = new SSEService()
  }
  return sseServiceInstance
}

