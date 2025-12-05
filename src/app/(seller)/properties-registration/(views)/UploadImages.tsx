// 'use client'

// import { useEffect, useRef, useState, useCallback } from 'react'
// import { Upload, Trash2, GripVertical, CheckCircle, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
// import Button from '@/components/ui/CustomComponent/Button/Button'
// import toast from 'react-hot-toast'
// import { onAddPropertyImages, getPropertyImages, updatePropertyImage, deletePropertyImage } from '../(action)/properties_registration_action'

// interface UpdateAdImagePayload {
//   id: string
//   url: string
//   filename: string
//   title?: string
//   description?: string
//   is_primary: boolean
//   sort_order: number
//   created_at: string
//   updated_at: string
//   file_size?: number
//   mime_type?: string
//   thumbnail_url?: string
//   key?: string
//   width?: number | null
//   height?: number | null
//   alt_text?: string | null
// }

// interface Step5UploadImagesProps {
//   propertyId: string
//   onUploaded?: () => void
//   mode?: 'create' | 'edit'
// }

// type UploadItem = {
//   file: File
//   preview: string
//   title: string
//   description: string
//   id: string // Add id to the UploadItem type
// }

// export default function Step5UploadImages({ propertyId, onUploaded, mode = 'create' }: Step5UploadImagesProps) {
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const [items, setItems] = useState<UploadItem[]>([])
//   const [existingImages, setExistingImages] = useState<UpdateAdImagePayload[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [primaryIndex, setPrimaryIndex] = useState<number | null>(null)
//   const [isDraggingOverArea, setIsDraggingOverArea] = useState(false)
//   const [isUploading, setIsUploading] = useState(false)
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const sliderRef = useRef<HTMLDivElement>(null)

//   // Auto-scroll to current slide
//   useEffect(() => {
//     if (sliderRef.current && existingImages.length > 0) {
//       const container = sliderRef.current
//       const slide = container.children[currentSlide] as HTMLElement
//       if (slide) {
//         container.scrollTo({
//           left: slide.offsetLeft - 16, // 16px for padding
//           behavior: 'smooth',
//         })
//       }
//     }
//   }, [currentSlide, existingImages.length])

//   const nextSlide = useCallback(() => {
//     setCurrentSlide(prev => (prev === existingImages.length - 1 ? 0 : prev + 1))
//   }, [existingImages.length])

//   const prevSlide = useCallback(() => {
//     setCurrentSlide(prev => (prev === 0 ? existingImages.length - 1 : prev - 1))
//   }, [existingImages.length])

//   // Track initial mount to prevent duplicate API calls
//   const isInitialMount = useRef(true)

//   // Fetch existing images when component mounts or adId changes
//   const fetchImages = useCallback(async () => {
//     if (!propertyId) return
//     try {
//       setIsLoading(true)
//       const response = await getPropertyImages(propertyId)
//       if (response.data) {
//         const images = Array.isArray(response.data) ? response.data : []
//         setExistingImages(images)

//         // Set primary index if any image is marked as primary
//         const primaryIdx = images.findIndex((img: UpdateAdImagePayload) => img.is_primary)
//         if (primaryIdx !== -1) {
//           setPrimaryIndex(primaryIdx)
//           // Update current slide to show the primary image
//           setCurrentSlide(primaryIdx)
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching ad images:', error)
//       toast.error('Failed to load existing images')
//     } finally {
//       setIsLoading(false)
//     }
//   }, [propertyId]) // Removed currentSlide from dependencies

//   // Handle initial fetch
//   useEffect(() => {
//     const controller = new AbortController()

//     if (isInitialMount.current) {
//       isInitialMount.current = false
//       fetchImages()
//     }

//     return () => {
//       controller.abort()
//     }
//   }, [fetchImages])

//   useEffect(() => {
//     return () => items.forEach(releasePreview)
//   }, [items])

//   const handleFilesAdded = (incoming: File[]) => {
//     const valid = incoming.filter(f => f.type.startsWith('image/'))
//     if (!valid.length) {
//       toast.error('Please select image files')
//       return
//     }
//     const next = valid.map(createItem)
//     setItems(prev => {
//       const combined = [...prev, ...next]
//       if (primaryIndex === null && combined.length) setPrimaryIndex(0)
//       return combined
//     })
//   }

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (!files?.length) return
//     handleFilesAdded(Array.from(files))
//     e.target.value = ''
//   }

//   const handleRemove = (index: number) => {
//     setItems(prev => {
//       const next = prev.filter((_, i) => i !== index)
//       setPrimaryIndex(p => {
//         if (p == null) return p
//         if (p === index) return next.length ? 0 : null
//         if (p > index) return p - 1
//         return p
//       })
//       return next
//     })
//   }

//   const handleReorder = (fromIndex: number, toIndex: number) => {
//     setItems(prev => {
//       const newItems = [...prev]
//       const [movedItem] = newItems.splice(fromIndex, 1)
//       newItems.splice(toIndex, 0, movedItem)
//       return newItems
//     })
//     setPrimaryIndex(p => {
//       if (p == null) return p
//       if (p === fromIndex) return toIndex
//       if (p > fromIndex && p <= toIndex) return p - 1
//       if (p < fromIndex && p >= toIndex) return p + 1
//       return p
//     })
//   }

//   const fileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onload = () => resolve(reader.result as string)
//       reader.onerror = error => reject(error)
//     })
//   }

//   const uploadAll = async () => {
//     if (!propertyId) {
//       toast.error('Property not ready yet')
//       return
//     }
//     if (items.length === 0) return
//     setIsUploading(true)

//     try {
//       // Create a single FormData object for all files
//       const formData = new FormData()
//       const totalFiles = items.length

//       // Add all files and their metadata to FormData
//       items.forEach((item, index) => {
//         formData.append('files', item.file)
//         formData.append('title', item.title || toTitle(item.file)) // Changed from 'titles' to 'title'
//         formData.append('description', item.description || '') // Changed from 'descriptions' to 'description'
//         formData.append('is_primary', String((primaryIndex ?? 0) === index))
//         formData.append('sort_order', String(index + 1)) // Changed from 'sort_orders' to 'sort_order'
//       })

//       // Add total count
//       formData.append('total', totalFiles.toString())

//       let res

//       if (mode === 'edit') {
//         // In edit mode, we need to handle each file individually
//         // since the API expects a single file per request
//         for (let i = 0; i < items.length; i++) {
//           const item = items[i]
//           const fileFormData = new FormData()
//           fileFormData.append('files', item.file)
//           fileFormData.append('title', item.title || toTitle(item.file)) // Changed from 'titles' to 'title'
//           fileFormData.append('description', item.description || '') // Changed from 'descriptions' to 'description'
//           fileFormData.append('is_primary', String((primaryIndex ?? 0) === i))
//           fileFormData.append('sort_order', String(i + 1)) // Changed from 'sort_orders' to 'sort_order'

//           res = await onAddPropertyImages(null, {
//             propertyId,
//             formData: fileFormData,
//             current: i,
//             total: items.length,
//           })

//           if (res?.error) {
//             throw new Error(res.message || `Failed to upload image ${i + 1}`)
//           }
//         }
//       } else {
//         // In create mode, upload all files at once
//         res = await onAddPropertyImages(null, {
//           propertyId,
//           formData,
//           current: 0,
//           total: totalFiles,
//         })

//         if (res?.error) {
//           throw new Error(res.message || 'Failed to upload images')
//         }
//       }

//       // Clear the selected files
//       setItems([])

//       // Refresh the images list
//       await fetchImages()

//       // Notify parent component
//       onUploaded?.()

//       toast.success(`Successfully uploaded ${totalFiles} ${totalFiles === 1 ? 'image' : 'images'}`)
//     } catch (e) {
//       console.error('Upload error:', e)
//       toast.error(e instanceof Error ? e.message : 'Error while uploading images')
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   // Function to create a preview URL for uploaded files
//   const createItem = (file: File): UploadItem => {
//     const preview = URL.createObjectURL(file)
//     return {
//       file,
//       preview,
//       title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
//       description: '', // Initialize with empty description
//       id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a temporary ID
//     }
//   }

//   // Function to release object URLs to prevent memory leaks
//   const releasePreview = (item: UploadItem) => {
//     URL.revokeObjectURL(item.preview)
//   }

//   // Function to convert file name to title
//   const toTitle = (file: File) => {
//     return file.name
//       .replace(/\.[^/.]+$/, '') // Remove file extension
//       .replace(/[-_]/g, ' ') // Replace underscores and hyphens with spaces
//       .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
//   }

//   // Track drag index for reordering
//   let dragIndex: number | null = null

//   // Function to update image title
//   const handleUpdateTitle = async (imageId: string, newTitle: string) => {
//     try {
//       const image = existingImages.find(img => img.id === imageId)
//       if (!image) return false

//       // First update the title in the local state
//       setExistingImages(prev => prev.map(img => (img.id === imageId ? { ...img, title: newTitle } : img)))

//       // Then make the API call
//       const response = await updatePropertyImage(propertyId, imageId, {
//         is_primary: image.is_primary,
//         sort_order: image.sort_order,
//       })

//       // If the API call fails, revert the local state
//       if (response.error) {
//         setExistingImages(prev => prev.map(img => (img.id === imageId ? { ...img, title: image.title } : img)))
//         throw new Error(response.message || 'Failed to update image title')
//       }

//       if (response.error) {
//         throw new Error(response.message || 'Failed to update image title')
//       }

//       // Update local state
//       setExistingImages(prev => prev.map(img => (img.id === imageId ? { ...img, title: newTitle } : img)))

//       return true
//     } catch (error) {
//       console.error('Error updating image title:', error)
//       toast.error('Failed to update image title')
//       return false
//     }
//   }

//   // Function to update image description
//   const handleUpdateDescription = async (imageId: string, newDescription: string) => {
//     try {
//       const image = existingImages.find(img => img.id === imageId)
//       if (!image) return false

//       // First update the description in the local state
//       setExistingImages(prev => prev.map(img => (img.id === imageId ? { ...img, description: newDescription } : img)))

//       // Then make the API call
//       const response = await updatePropertyImage(propertyId, imageId, {
//         is_primary: image.is_primary,
//         sort_order: image.sort_order,
//       })

//       // If the API call fails, revert the local state
//       if (response.error) {
//         setExistingImages(prev => prev.map(img => (img.id === imageId ? { ...img, description: image.description || '' } : img)))
//         throw new Error(response.message || 'Failed to update image description')
//       }

//       if (response.error) {
//         throw new Error(response.message || 'Failed to update image description')
//       }

//       // Update local state
//       setExistingImages(prev => prev.map(img => (img.id === imageId ? { ...img, description: newDescription } : img)))

//       return true
//     } catch (error) {
//       console.error('Error updating image description:', error)
//       toast.error('Failed to update image description')
//       return false
//     }
//   }

//   // Function to handle setting an image as primary
//   const handleSetPrimary = async (imageId: string) => {
//     try {
//       // Update the primary image via API
//       const response = await updatePropertyImage(propertyId, imageId, { is_primary: true })

//       if (response.error) {
//         throw new Error(response.message || 'Failed to update primary image')
//       }

//       // Update local state
//       const updatedImages = existingImages.map(img => ({
//         ...img,
//         is_primary: img.id === imageId,
//       }))
//       setExistingImages(updatedImages)

//       // Find the index of the new primary image
//       const primaryIdx = updatedImages.findIndex(img => img.is_primary)
//       setPrimaryIndex(primaryIdx)

//       toast.success('Primary image updated')
//     } catch (error) {
//       console.error('Error setting primary image:', error)
//       toast.error('Failed to update primary image')
//     }
//   }

//   // Function to handle image deletion
//   const handleDeleteImage = async (imageId: string) => {
//     if (!window.confirm('Are you sure you want to delete this image?')) return

//     try {
//       // Call the API to delete the image
//       const response = await deletePropertyImage(propertyId, imageId)

//       if (response.error) {
//         throw new Error(response.message || 'Failed to delete image')
//       }

//       // Update local state
//       setExistingImages(prev => prev.filter(img => img.id !== imageId))

//       // If the deleted image was the primary, update the primary index
//       const deletedImage = existingImages.find(img => img.id === imageId)
//       if (deletedImage?.is_primary && existingImages.length > 1) {
//         // Set the first image as primary if the deleted one was primary
//         const newPrimaryImage = existingImages.find(img => img.id !== imageId)
//         if (newPrimaryImage) {
//           await updatePropertyImage(propertyId, newPrimaryImage.id, { is_primary: true })
//         }
//       }

//       // Refresh the images to ensure consistency
//       await fetchImages()

//       toast.success('Image deleted successfully')
//     } catch (error) {
//       console.error('Error deleting image:', error)
//       toast.error('Failed to delete image')
//     }
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white">
//       <div className="space-y-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Ad Images</h2>
//           <p className="mt-1 text-sm text-gray-500">Manage your ad images. The primary image will be used as the main display image.</p>
//         </div>

//         {/* Existing Images Slider */}
//         {isLoading ? (
//           <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//           </div>
//         ) : existingImages.length > 0 ? (
//           <div className="relative">
//             <div
//               ref={sliderRef}
//               className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
//               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//               {existingImages.length > 0 && (
//                 <button
//                   onClick={prevSlide}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100"
//                   aria-label="Previous image"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//               )}
//               {existingImages.map((image, index) => (
//                 <div
//                   key={image.id}
//                   className={`flex-shrink-0 w-64 snap-center ${
//                     index === currentSlide ? 'opacity-100' : 'opacity-90 hover:opacity-100'
//                   } transition-opacity`}
//                   onClick={() => setCurrentSlide(index)}
//                 >
//                   <div
//                     className={`relative group rounded-lg overflow-hidden border ${
//                       image.is_primary ? 'ring-2 ring-blue-500' : 'border-gray-200'
//                     } h-full`}
//                   >
//                     <div className="aspect-w-16 aspect-h-9 bg-gray-100">
//                       <img src={image.url} alt={image.title || `Ad Image ${index + 1}`} className="w-full h-48 object-cover" />
//                     </div>
//                     <div className="p-3">
//                       <h4 className="text-sm font-medium text-gray-900 truncate">{image.filename || 'Untitled'}</h4>
//                       <p className="text-xs text-gray-500 mt-1">{image.file_size ? `${(image.file_size / 1024).toFixed(1)} KB` : ''}</p>
//                     </div>
//                     <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       {!image.is_primary && (
//                         <button
//                           onClick={e => {
//                             e.stopPropagation()
//                             handleSetPrimary(image.id)
//                           }}
//                           className="p-1.5 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50"
//                           title="Set as primary"
//                         >
//                           <CheckCircle className="w-4 h-4" />
//                         </button>
//                       )}
//                       <button
//                         onClick={e => {
//                           e.stopPropagation()
//                           handleDeleteImage(image.id)
//                         }}
//                         className="p-1.5 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50"
//                         title="Delete image"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                     {image.is_primary && <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">Primary</div>}
//                   </div>
//                 </div>
//               ))}
//               {existingImages.length > 0 && (
//                 <button
//                   onClick={nextSlide}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-100"
//                   aria-label="Next image"
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               )}
//             </div>

//             {/* Dots indicator */}
//             {existingImages.length > 1 && (
//               <div className="flex justify-center space-x-2 mt-4">
//                 {existingImages.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentSlide(index)}
//                     className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-blue-500 w-4' : 'bg-gray-300'}`}
//                     aria-label={`Go to slide ${index + 1}`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
//             <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
//             <p className="mt-1 text-sm text-gray-500">Upload some images to get started.</p>
//           </div>
//         )}

//         {/* Upload Section */}
//         <div className="mt-8">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Images</h3>
//           <div
//             className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
//               isDraggingOverArea ? 'border-[#2a1407] bg-[#FEF2F2]' : 'border-gray-300 hover:border-[#2a1407] hover:bg-[#FEF2F2]'
//             }`}
//             onDragOver={e => {
//               e.preventDefault()
//               e.stopPropagation()
//             }}
//             onDragEnter={e => {
//               e.preventDefault()
//               e.stopPropagation()
//               setIsDraggingOverArea(true)
//             }}
//             onDragLeave={e => {
//               e.preventDefault()
//               e.stopPropagation()
//               setIsDraggingOverArea(false)
//             }}
//             onDrop={e => {
//               e.preventDefault()
//               e.stopPropagation()
//               setIsDraggingOverArea(false)
//               if (e.dataTransfer?.files?.length) handleFilesAdded(Array.from(e.dataTransfer.files))
//             }}
//             onClick={() => fileInputRef.current?.click()}
//           >
//             <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png" onChange={handleFileInput} className="hidden" />
//             <div className="mx-auto w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mb-3">
//               <Upload size={28} className="text-[#2a1407]" />
//             </div>
//             <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
//             <p className="text-gray-500 text-sm mt-1">JPG or PNG files (max 5MB)</p>
//           </div>
//         </div>

//         {items.length > 0 && (
//           <div className="border rounded-lg p-4 space-y-4 mt-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-medium">Selected Files</h2>
//               <div className="flex items-center space-x-4">
//                 <p className="text-sm text-gray-500">
//                   {items.length} {items.length === 1 ? 'file' : 'files'} selected
//                 </p>
//                 <button type="button" onClick={() => setItems([])} className="text-sm text-red-600 hover:text-red-800">
//                   Clear All
//                 </button>
//               </div>
//             </div>
//             <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
//               {items.map((item, index) => {
//                 const isPrimary = primaryIndex === index
//                 const size = `${(item.file.size / 1024).toFixed(1)} KB`
//                 return (
//                   <div
//                     key={item.preview}
//                     className={`flex items-center justify-between p-3 border rounded-lg transition-colors duration-150 ${
//                       isPrimary ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
//                     }`}
//                     draggable
//                     onDragStart={() => (dragIndex = index)}
//                     onDragOver={e => {
//                       e.preventDefault()
//                       if (dragIndex === null || dragIndex === index) return
//                       handleReorder(dragIndex, index)
//                       dragIndex = index
//                     }}
//                     onDragEnd={() => (dragIndex = null)}
//                   >
//                     <div className="flex items-center space-x-3 flex-1 min-w-0">
//                       <GripVertical className="text-gray-400 cursor-move flex-shrink-0" size={20} />

//                       {/* Image Thumbnail */}
//                       <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100">
//                         <img
//                           src={item.preview}
//                           alt={item.title || 'Preview'}
//                           className="w-full h-full object-cover"
//                           onLoad={() => URL.revokeObjectURL(item.preview)}
//                         />
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-center space-x-2">
//                           <input
//                             type="text"
//                             value={item.title}
//                             onChange={e => {
//                               const newTitle = e.target.value
//                               setItems(prev => prev.map((it, i) => (i === index ? { ...it, title: newTitle } : it)))
//                             }}
//                             onBlur={async () => {
//                               if (item.title.trim()) {
//                                 await handleUpdateTitle(item.id, item.title)
//                               }
//                             }}
//                             onKeyDown={async e => {
//                               if (e.key === 'Enter') {
//                                 e.preventDefault()
//                                 if (item.title.trim()) {
//                                   await handleUpdateTitle(item.id, item.title)
//                                   ;(e.target as HTMLInputElement).blur()
//                                 }
//                               }
//                             }}
//                             className="text-sm font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full bg-transparent"
//                             placeholder="Enter a title..."
//                           />
//                         </div>
//                         <input
//                           type="text"
//                           value={item.description}
//                           onChange={e => {
//                             const newDescription = e.target.value
//                             setItems(prev => prev.map((it, i) => (i === index ? { ...it, description: newDescription } : it)))
//                           }}
//                           onBlur={async () => {
//                             // Save description if needed
//                             await handleUpdateDescription(item.id, item.description)
//                           }}
//                           onKeyDown={async e => {
//                             if (e.key === 'Enter') {
//                               e.preventDefault()
//                               await handleUpdateDescription(item.id, item.description)
//                               ;(e.target as HTMLInputElement).blur()
//                             }
//                           }}
//                           className="text-xs text-gray-600 border-b border-transparent focus:border-gray-300 focus:outline-none w-full bg-transparent mt-1"
//                           placeholder="Add a description..."
//                         />
//                         <p className="text-xs text-gray-400 mt-1 truncate">
//                           {item.title || item.file.name} • {size}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-3 ml-4">
//                       {isPrimary ? (
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           Primary
//                         </span>
//                       ) : (
//                         <button
//                           type="button"
//                           onClick={() => setPrimaryIndex(index)}
//                           className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
//                         >
//                           Set as Primary
//                         </button>
//                       )}
//                       <button
//                         type="button"
//                         onClick={() => handleRemove(index)}
//                         className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
//                         title="Remove image"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 )
//               })}

//               <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100 mt-4">
//                 <Button
//                   type="button"
//                   variant="primary"
//                   onClick={uploadAll}
//                   disabled={isUploading || items.length === 0}
//                   className={`px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600  rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
//                     isUploading || items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   {isUploading ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Uploading...
//                     </span>
//                   ) : (
//                     `Upload ${items.length} ${items.length === 1 ? 'Image' : 'Images'}`
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
