/**
 * Dispatches a browser event so non-React code (e.g. axios interceptors) can open the global login modal.
 * {@link LoginModalProvider} subscribes to this event.
 */
export const OPEN_LOGIN_MODAL_EVENT = 'vvm:open-login-modal'

export type OpenLoginModalEventDetail = {
  next?: string
}

export function requestOpenLoginModal(next?: string) {
  if (typeof window === 'undefined') return
  const normalized =
    next && next.trim().startsWith('/') ? next.trim() : undefined
  window.dispatchEvent(
    new CustomEvent(OPEN_LOGIN_MODAL_EVENT, {
      detail: { next: normalized } satisfies OpenLoginModalEventDetail,
    }),
  )
}
