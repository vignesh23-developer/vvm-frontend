'use client'

import React, { useState, useRef, useEffect, useTransition } from 'react'
import { Upload, Trash2, CheckCircle, Image as ImageIcon, Film, Star, Link as LinkIcon, AlertCircle, Info, Play, X, FileVideo, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { onAddPropertyMedia } from '../(action)/properties_registration_action'
import { ResponseDTO } from '@/components/dto/response_dto'

interface Step5UploadImagesProps {
  propertyId: string
  onUploaded: () => void
  onUploadingChange: (isUploading: boolean) => void
  mode: 'create' | 'edit'
}

type MediaItem = {
  id: string
  file?: File
  url?: string
  title: string
  type: 'IMAGE' | 'VIDEO'
  isPrimary: boolean
  preview: string
}

export default function Step5UploadImages({ propertyId, onUploaded, onUploadingChange, mode }: Step5UploadImagesProps) {
  const [activeTab, setActiveTab] = useState<'media' | 'youtube'>('media')
  const [items, setItems] = useState<MediaItem[]>([])
  const [ispending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // YouTube Link State
  const [videoLink, setVideoLink] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null)

  // Drag and drop refs
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  // Report uploading state to parent
  useEffect(() => {
    onUploadingChange(ispending)
  }, [ispending, onUploadingChange])

  // Cleanup previews
  useEffect(() => {
    return () => {
      items.forEach(item => {
        if (item.preview && item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview)
        }
      })
    }
  }, [])

  // ----------------------------------------------------------------------
  // MEDIA LOGIC (Images & Videos)
  // ----------------------------------------------------------------------

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files))
    }
    e.target.value = '' // reset input
  }

  const processFiles = (files: File[]) => {
    const newImages = files.filter(f => f.type.startsWith('image/'))
    const newVideos = files.filter(f => f.type.startsWith('video/'))

    const currentImages = items.filter(i => i.type === 'IMAGE' && i.file) // Local images
    const currentVideos = items.filter(i => i.type === 'VIDEO' && i.file) // Local videos

    // Limits
    // Limits
    const MAX_TOTAL_MEDIA = 5
    const MAX_VIDEOS = 1
    const MAX_VIDEO_SIZE_MB = 15 // Reasonable limit for video uploads

    const totalMediaCount = currentImages.length + currentVideos.length

    // Check if we already reached limit
    if (totalMediaCount >= MAX_TOTAL_MEDIA) {
      toast.error(`You have reached the limit of ${MAX_TOTAL_MEDIA} media items.`)
      return
    }

    // Check Video Limits
    if (newVideos.length > 0) {
      if (currentVideos.length >= MAX_VIDEOS) {
        toast.error('You can only upload 1 video file.')
      } else if (totalMediaCount >= MAX_TOTAL_MEDIA) {
        toast.error(`Maximum ${MAX_TOTAL_MEDIA} items allowed. Remove an image to add a video.`)
      } else {
        const video = newVideos[0] // Take only the first video if multiple selected
        if (video.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(`Video must be less than ${MAX_VIDEO_SIZE_MB}MB.`)
        } else {
          setItems(prev => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              file: video,
              title: video.name.split('.')[0],
              type: 'VIDEO',
              isPrimary: false,
              preview: URL.createObjectURL(video)
            }
          ])
          toast.success('Video added')
        }
      }
    }

    // Check Image Limits
    // Recalculate usage in case a video was just added (though setItems is async, we use local check)
    // Actually, setItems is async, so we should be careful. 
    // Ideally we process one batch. For simplicity, if video was added, we subtract 1 more slot.
    // However, usually users drag either images OR videos. If mixed, we need to be careful.

    // Let's simplified assumption: if newVideos.length > 0 was successfully processed we reduce slots?
    // React state updates don't reflect immediately. 
    // But currentImages and currentVideos are based on 'items' state which hasn't changed yet.
    // So if we are processing both, we must account for what we just decided to add.

    let effectiveTotal = totalMediaCount + (newVideos.length > 0 && currentVideos.length === 0 && newVideos[0].size <= MAX_VIDEO_SIZE_MB * 1024 * 1024 ? 1 : 0)

    if (newImages.length > 0) {
      if (effectiveTotal >= MAX_TOTAL_MEDIA) {
        if (newVideos.length > 0) {
          // We added a video, but no space for images
          toast('Video added, but max limit reached for images.', { icon: '⚠️' })
        } else {
          toast.error(`You can only upload up to ${MAX_TOTAL_MEDIA} items.`)
        }
        return
      }

      const remainingSlots = MAX_TOTAL_MEDIA - effectiveTotal
      const imagesToAdd = newImages.slice(0, remainingSlots)

      if (newImages.length > remainingSlots) {
        toast('Only ' + remainingSlots + ' images were added (limit 5).', { icon: '⚠️' })
      }

      const newMediaItems: MediaItem[] = imagesToAdd.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        title: file.name.split('.')[0],
        type: 'IMAGE',
        isPrimary: items.length === 0 && currentImages.length === 0 && !items.some(i => i.isPrimary),
        preview: URL.createObjectURL(file)
      }))

      setItems(prev => {
        const hasPrimary = prev.some(i => i.isPrimary)
        if (!hasPrimary && newMediaItems.length > 0) {
          newMediaItems[0].isPrimary = true
        }
        return [...prev, ...newMediaItems]
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // ----------------------------------------------------------------------
  // REORDER LOGIC
  // ----------------------------------------------------------------------

  const handleDragStart = (e: React.DragEvent, position: number) => {
    dragItem.current = position
    // e.dataTransfer.effectAllowed = 'move' // Optional: visual cue
  }

  const handleDragEnter = (e: React.DragEvent, position: number) => {
    e.preventDefault()
    dragOverItem.current = position

    // Auto-sort if different
    if (dragItem.current !== null && dragItem.current !== dragOverItem.current) {
      handleSort()
    }
  }

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return

    // Clone items
    const _items = [...items]

    // Isolate the ones we are reordering (local files). 
    // Since we are reordering the WHOLE list based on the visual index...
    // But wait, the visual list filters only local files. 
    // If 'items' contains youtube links mixed in, using visual index to splice 'items' directly might be wrong.
    // However, the current code pushes youtube links to the end usually?
    // Let's assume we dealing with the 'localMediaItems' subset for reordering indices.

    // We need to reorder the ACTUAL 'items' array. 
    // Strategy: Get the list of local files from 'items'. Reorder that list. 
    // Then reconstruct 'items' by keeping non-local files in their relative places or just appending them?
    // The safest is to map the visual indices back to the real indices.

    // Construction of displayed list:
    const localMediaItems = items.filter(i => i.file)  // This matches the unified render loop we will use

    if (dragItem.current >= localMediaItems.length || dragOverItem.current >= localMediaItems.length) return;

    // We are swapping index 'dragItem.current' and 'dragOverItem.current' WITHIN 'localMediaItems'.

    const draggedItemContent = localMediaItems[dragItem.current]
    // Remove from old position in strictly local list
    const newLocalList = [...localMediaItems]
    newLocalList.splice(dragItem.current, 1)
    newLocalList.splice(dragOverItem.current, 0, draggedItemContent)


    const youtubeItemsOnly = items.filter(i => !i.file)

    setItems([...newLocalList, ...youtubeItemsOnly])

    // Update ref to follow the item
    dragItem.current = dragOverItem.current
  }

  const handleDragEnd = () => {
    dragItem.current = null
    dragOverItem.current = null
  }

  const handleTitleChange = (id: string, newTitle: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, title: newTitle } : item
    ))
  }

  // ----------------------------------------------------------------------
  // YOUTUBE LOGIC
  // ----------------------------------------------------------------------

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleAddYoutube = () => {
    if (!videoLink) return

    // Limit Check: Only 1 YouTube link allowed
    const currentYoutube = items.filter(i => i.type === 'VIDEO' && i.url)
    if (currentYoutube.length >= 1) {
      toast.error('You can only add 1 YouTube video link.')
      return
    }

    const videoId = extractYoutubeId(videoLink)
    if (!videoId) {
      toast.error('Invalid YouTube URL. Please use a valid link.')
      return
    }

    const newItem: MediaItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: videoLink,
      title: videoTitle || 'YouTube Video',
      type: 'VIDEO',
      isPrimary: false,
      preview: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }

    setItems(prev => [...prev, newItem])
    setVideoLink('')
    setVideoTitle('')
    toast.success('YouTube video added')
  }

  // ----------------------------------------------------------------------
  // COMMON ACTIONS
  // ----------------------------------------------------------------------

  const handleRemove = (id: string) => {
    setItems(prev => {
      const remaining = prev.filter(i => i.id !== id)
      // If we removed the primary, assign new primary to the first item (if exists)
      const wasPrimary = prev.find(i => i.id === id)?.isPrimary
      if (wasPrimary && remaining.length > 0) {
        remaining[0].isPrimary = true
      }
      return remaining
    })
  }

  const handleSetPrimary = (id: string) => {
    setItems(prev => prev.map(item => ({
      ...item,
      isPrimary: item.id === id
    })))
  }

  const handleUploadAll = () => {
    if (items.length === 0) {
      toast.error('Please add at least one media item.')
      return
    }

    startTransition(async () => {
      try {
        if (!propertyId) {
          throw new Error('Property ID is missing. Please save basic details first.')
        }

        // Dummy prevState to satisfy TS if strict
        const dummyState: ResponseDTO = { success: false, error: false, message: '', data: null, status: '' }

        // 1. Upload Local Files (Images & Videos)
        const fileItems = items.filter(i => i.file)
        if (fileItems.length > 0) {
          const formData = new FormData()
          // Append files
          fileItems.forEach((item) => {
            if (item.file) formData.append('files', item.file)
          })

          // Append metadata
          fileItems.forEach((item, index) => {
            formData.append('media_type', item.type)
            formData.append('title', item.title)
            formData.append('is_primary', String(item.isPrimary))
            formData.append('media_category', 'General')
            formData.append('sort_order', String(index))
          })

          let res
          try {
            res = await onAddPropertyMedia(dummyState, {
              id: propertyId,
              payload: formData as any,
              uploadType: 'chooseFromDevice'
            })
          } catch (e: any) {
            console.error("Upload error:", e);
            throw new Error(e.message || "Server Communication Error")
          }

          if (res && res.error) {
            throw new Error(res.message || 'Failed to upload files')
          } else if (res === undefined) {
            // In case void is returned but no error thrown
            console.warn("API returned undefined, assuming success or handled error")
          }
        }

        // 2. Upload Links (YouTube)
        const linkItems = items.filter(i => i.url)
        if (linkItems.length > 0) {
          const payload = linkItems.map((item, index) => ({
            media_type: 'VIDEO',
            url: item.url,
            title: item.title,
            is_primary: item.isPrimary,
            sort_order: index + 1
          }))

          const res = await onAddPropertyMedia(dummyState, {
            id: propertyId,
            payload: payload,
            uploadType: 'addViaLink'
          })

          if (res?.error) throw new Error(res?.message || 'Failed to upload video link')
        }

        toast.success('Media uploaded successfully!')
        onUploaded()

      } catch (err: any) {
        console.error(err)
        toast.error(err.message || 'Failed to upload media')
      }
    })
  }

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------


  const imageItems = items.filter(i => i.type === 'IMAGE' && i.file)
  const localVideoItems = items.filter(i => i.type === 'VIDEO' && i.file)
  const youtubeItems = items.filter(i => i.type === 'VIDEO' && i.url)

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 min-h-[500px]">

      {/* Introduction */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-gray-900">Property Media</h2>
        <p className="text-gray-500 mt-2 text-sm flex items-center gap-2">
          <Info size={16} /> Showcase your property with high-quality images and video.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-xl w-fit mb-8">
        <button
          onClick={() => setActiveTab('media')}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'media'
            ? 'bg-white text-[#2a1407] shadow-sm ring-1 ring-black/5'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
        >
          <ImageIcon size={18} />
          Upload Media
          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-600 border border-gray-200">
            {imageItems.length + localVideoItems.length}/5
          </span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'youtube'
            ? 'bg-white text-[#2a1407] shadow-sm ring-1 ring-black/5'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
        >
          <LinkIcon size={18} />
          YouTube Link
          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-600 border border-gray-200">
            {youtubeItems.length}/1
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">

        {/* MEDIA TAB (Images + Local Video) */}
        {activeTab === 'media' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Dropzone */}
            {(imageItems.length + localVideoItems.length < 5) ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-[#2a1407]/5 hover:border-[#2a1407]/30 transition-all cursor-pointer p-12 flex flex-col items-center justify-center text-center"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, video/mp4, video/quicktime"
                  onChange={handleFileSelect}
                />
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="bg-[#2a1407]/10 p-3 rounded-xl">
                    <Upload className="text-[#2a1407]" size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2a1407] transition-colors">Click or Drag media here</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                  Upload up to 5 items total (max 1 Video).<br />
                  <span className="text-xs opacity-75">Images max 3MB, Video max 15MB.</span>
                </p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 text-sm">Media Limit Reached</h4>
                  <p className="text-sm text-amber-800 mt-0.5">
                    You have uploaded the maximum number of items (5 Total). Please remove some to add new ones.
                  </p>
                </div>
              </div>
            )}


            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {/* Unified Render Loop for Local Media (Allow mixing images and videos) */}
              {items.filter(i => i.file).map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()} // Allow drop
                  className={`relative group rounded-2xl overflow-hidden shadow-sm bg-white transition-all duration-300 h-full
                    ${item.isPrimary
                      ? 'ring-2 ring-[#2a1407] ring-offset-2 z-10'
                      : 'border border-gray-200 hover:border-gray-300'
                    } cursor-move flex flex-col`}
                >
                  <div className="w-full bg-gray-100 relative h-48 shrink-0">
                    {item.type === 'IMAGE' ? (
                      <img src={item.preview} alt={item.title} className="w-full h-full object-contain bg-gray-50 pointer-events-none select-none" />
                    ) : (
                      <video src={item.preview} className="w-full h-full object-contain bg-black pointer-events-none select-none" />
                    )}

                    {/* Drag Handle Icon */}
                    <div className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-grab active:cursor-grabbing backdrop-blur-sm">
                      <GripVertical size={18} />
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 z-10">

                      {/* Play Button for Video */}
                      {item.type === 'VIDEO' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewVideoUrl(item.preview)
                          }}
                          className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all transform hover:scale-110 mb-2"
                        >
                          <Play size={32} fill="currentColor" />
                        </button>
                      )}

                      {!item.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(item.id)}
                          className="bg-white text-[#2a1407] px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 w-full transform hover:scale-105 transition-all shadow-lg"
                        >
                          Set Main
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="bg-red-500/90 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Primary Badge */}
                    {item.isPrimary && (
                      <div className="absolute top-3 left-3 bg-[#2a1407] text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5 tracking-wider border border-white/20 z-20">
                        <Star size={10} fill="currentColor" />
                        Main
                      </div>
                    )}

                    {/* Video Info Badge */}
                    {item.type === 'VIDEO' && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 z-10">
                        <Film size={10} />
                      </div>
                    )}
                  </div>

                  {/* Footer Info & Description */}
                  <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]" title={item.file?.name}>
                        {item.file?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium flex items-center gap-1">
                        {item.type === 'IMAGE' ? <ImageIcon size={12} /> : <Film size={12} />}
                        {(item.file?.size ? (item.file.size / 1024 / 1024).toFixed(1) : 0) + ' MB'}
                      </p>
                    </div>

                    <input
                      type="text"
                      value={item.title === item.file?.name.split('.')[0] ? '' : item.title}
                      onChange={(e) => handleTitleChange(item.id, e.target.value)}
                      placeholder="Add a description..."
                      className="w-full text-xs font-medium text-gray-700 border-b border-gray-200 py-1.5 focus:border-[#2a1407] focus:ring-0 outline-none transition-all placeholder:text-gray-400 bg-transparent mt-auto"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YOUTUBE TAB */}
        {activeTab === 'youtube' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Limit Warning/Info */}
            {youtubeItems.length >= 1 ? (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-800">
                <Info size={20} />
                <span className="text-sm font-medium">You have reached the YouTube video limit (1 max). Remove the current video to add a different one.</span>
              </div>
            ) : (
              /* Add Video Form */
              <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300">
                <div className="max-w-xl mx-auto space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 text-[#2a1407]">
                      <LinkIcon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Add YouTube Link</h3>
                    <p className="text-sm text-gray-500">Paste a YouTube link to showcase your property.</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://youtu.be/..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2a1407] focus:border-transparent outline-none transition-all shadow-sm"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                    />
                    <button
                      onClick={handleAddYoutube}
                      className="bg-[#2a1407] text-white px-6 rounded-xl font-bold hover:bg-[#3d1e0b] transition-colors shadow-lg shadow-[#2a1407]/20"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Video List */}
            {youtubeItems.length > 0 && (
              <div className="flex justify-center">
                {youtubeItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-100 w-full max-w-2xl transform transition-all hover:scale-[1.01]"
                  >
                    <div className="aspect-video bg-black relative">
                      <img src={item.preview} alt={item.title} className="w-full h-full object-cover opacity-90" />

                      {/* Play Icon - Opens Modal */}
                      <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => {
                        const videoId = extractYoutubeId(item.url || '')
                        if (videoId) setPreviewVideoUrl(videoId)
                      }}>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2a1407]/90 transition-all duration-300 shadow-2xl border border-white/30">
                          <Play className="text-white fill-white ml-1" size={24} />
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full backdrop-blur-md">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemove(item.id)
                          }}
                          className="text-white p-2 hover:text-red-400 transition-colors"
                          title="Remove Video"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 truncate">{item.title}</h3>
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <LinkIcon size={14} />
                            <span className="truncate max-w-xs">{item.url}</span>
                          </div>
                        </div>
                        <div className=" hidden sm:flex items-center gap-2 text-xs font-semibold text-[#2a1407] bg-[#2a1407]/5 px-3 py-1 rounded-full border border-[#2a1407]/10">
                          <Film size={14} /> Video Preview
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Action Bar */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
        <Button
          type="button"
          onClick={handleUploadAll}
          disabled={ispending || items.length === 0}
          className="bg-[#2a1407] hover:bg-[#3d1e0b] text-white px-8 py-3.5 rounded-xl text-md font-bold shadow-xl shadow-[#2a1407]/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {ispending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <>Save & Continue <CheckCircle size={20} /></>
          )}
        </Button>
      </div>

      {/* Video Modal */}
      {
        previewVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 text-white rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="aspect-video w-full">
                {previewVideoUrl.startsWith('blob:') ? (
                  <video
                    src={previewVideoUrl}
                    className="w-full h-full"
                    controls
                    autoPlay
                  />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${previewVideoUrl}?autoplay=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        )
      }

    </div >
  )
}
