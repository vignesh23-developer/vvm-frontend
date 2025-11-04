'use client'

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'
import { FormikProps, ErrorMessage } from 'formik'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { LocalPropertyPhotoPayloadItem, PropertyCreationFormValues } from '../page'
import { Upload, Trash2, GripVertical, CheckCircle, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'

interface Step5PhotosContactProps {
  formik: FormikProps<PropertyCreationFormValues>
  uploadPending: boolean
}

type UploadItem = {
  file: File
  preview: string
  title: string
}

export default function Step5PhotosContact({ formik, uploadPending }: Step5PhotosContactProps) {
  const { values, setFieldValue, submitForm, isSubmitting, errors, touched, setFieldTouched } = formik
  const isUploading = isSubmitting || uploadPending

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragIndexRef = useRef<number | null>(null)
  const itemsRef = useRef<UploadItem[]>([])

  const [items, setItems] = useState<UploadItem[]>([])
  const [primaryIndex, setPrimaryIndex] = useState<number | null>(null)
  const [isDraggingOverArea, setIsDraggingOverArea] = useState(false)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    return () => {
      itemsRef.current.forEach(releasePreview)
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) return
    const persisted = values.localpropertyPhoto?.files?.filter((file): file is File => file instanceof File) ?? []
    if (!persisted.length) return

    setItems(persisted.map(createItem))
    setPrimaryIndex(0)
  }, [items.length, values.localpropertyPhoto?.files])

  useEffect(() => {
    if (!items.length) {
      setFieldValue('localpropertyPhoto.files', [], false)
      setFieldValue('localpropertyPhoto.payload', [], false)
      setFieldValue('localpropertyPhoto.media_type', '', false)
      setFieldValue('localpropertyPhoto.media_category', '', false)
      setFieldValue('localpropertyPhoto.title', '', false)
      setFieldValue('localpropertyPhoto.is_primary', false, false)
      setPrimaryIndex(null)
      return
    }

    const filesOnly = items.map(item => item.file)
    const primaryItem = primaryIndex !== null && items[primaryIndex] ? items[primaryIndex] : items[0]
    const firstFile = items[0].file
    const mediaType = firstFile.type.startsWith('image/') ? 'IMAGE' : 'VIDEO'
    const payload = buildPayload(items, primaryIndex)

    if (!values.uploadType || values.uploadType === 'addViaLink') {
      setFieldValue('uploadType', 'chooseFromDevice', false)
    }

    setFieldValue('localpropertyPhoto.files', filesOnly, false)
    setFieldValue('localpropertyPhoto.payload', payload, false)
    setFieldValue('localpropertyPhoto.media_type', mediaType, false)
    setFieldValue('localpropertyPhoto.media_category', firstFile.type, false)
    setFieldValue('localpropertyPhoto.title', primaryItem?.title ?? '', false)
    setFieldValue('localpropertyPhoto.is_primary', Boolean(primaryItem), false)

    if (primaryIndex === null) {
      setPrimaryIndex(0)
    }
  }, [items, primaryIndex, setFieldValue, values.uploadType])

  const updateItems = (updater: (previous: UploadItem[]) => UploadItem[]) => {
    setItems(prev => {
      const next = updater(prev)
      const removed = prev.filter(old => !next.some(current => current.preview === old.preview))
      removed.forEach(releasePreview)
      return next
    })
  }

  const handleFilesAdded = (incoming: File[]) => {
    const valid = incoming.filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))

    if (!valid.length) {
      toast.error('Please select image or video files.')
      return
    }

    const nextItems = valid.map(createItem)

    updateItems(prev => {
      const combined = [...prev, ...nextItems]
      if (primaryIndex === null && combined.length) {
        setPrimaryIndex(0)
      }
      return combined
    })
  }

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const filesList = event.target.files
    if (!filesList?.length) return
    handleFilesAdded(Array.from(filesList))
    event.target.value = ''
  }

  const handleAreaDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDraggingOverArea(true)
  }

  const handleAreaDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleAreaDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.currentTarget === event.target) {
      setIsDraggingOverArea(false)
    }
  }

  const handleAreaDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDraggingOverArea(false)

    if (event.dataTransfer?.files?.length) {
      handleFilesAdded(Array.from(event.dataTransfer.files))
    }
  }

  const handleRemove = (index: number) => {
    updateItems(prev => {
      const next = prev.filter((_, i) => i !== index)
      setPrimaryIndex(current => {
        if (current === null) return next.length ? 0 : null
        if (current === index) return next.length ? 0 : null
        if (current > index) return current - 1
        return current
      })
      return next
    })
  }

  const handleReorder = (from: number, to: number) => {
    if (from === to) return

    updateItems(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      if (moved) {
        next.splice(to, 0, moved)
      }
      return next
    })

    setPrimaryIndex(current => {
      if (current === null) return current
      if (current === from) return to
      if (current > from && current <= to) return current - 1
      if (current < from && current >= to) return current + 1
      return current
    })
  }

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index
  }

  const handleItemDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault()
    const from = dragIndexRef.current
    if (from === null || from === index) return
    handleReorder(from, index)
    dragIndexRef.current = index
  }

  const handleDragEnd = () => {
    dragIndexRef.current = null
  }

  const handleTitleChange = (index: number, value: string) => {
    updateItems(prev => prev.map((item, idx) => (idx === index ? { ...item, title: value } : item)))
  }

  const handleSetPrimary = (index: number) => {
    setPrimaryIndex(index)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Property Media</h1>
      <div className="space-y-4">
        {/* Upload type selector */}
        <div>
          <label htmlFor="uploadType" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Type
          </label>
          <select
            id="uploadType"
            value={values.uploadType}
            onChange={e => setFieldValue('uploadType', e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <option disabled value="">
              Select an upload type
            </option>
            <option value="chooseFromDevice">Choose from Device</option>
            {/* <option value="addViaLink">Add via Link</option> */}
          </select>
        </div>

        {/* Conditional link input */}
        {values.uploadType === 'addViaLink' && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Add Property Photos / Video Link</h2>

            <div className="border-2 border-dashed rounded-lg p-8 transition-all duration-200 border-gray-300 bg-gray-50">
              <div className="mb-3.5 flex justify-between">
                {/* Top-level error for array (e.g., min length) */}
                {touched.propertyPhoto && typeof errors.propertyPhoto === 'string' && (
                  <p className="text-red-600 text-xs mt-1">{errors.propertyPhoto}</p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const current = values.propertyPhoto || []
                    setFieldValue('propertyPhoto', [...current, { media_type: '', url: '', title: '' }])
                  }}
                  className="flex flex-col justify-center"
                >
                  <div className="p-2 w-fit bg-red-600 rounded-md flex items-center justify-center text-white">
                    <span>Add custom feature</span>
                    <Plus size={16} />
                  </div>
                </button>
              </div>

              {/* Map over array items */}
              {values.propertyPhoto &&
                values.propertyPhoto.length > 0 &&
                values.propertyPhoto.map((val, idx) => (
                  <div key={idx} className="mb-6 border p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="block text-lg mb-3.5">Fields {idx + 1}</label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (values.propertyPhoto || []).filter((_, i) => i !== idx)
                          setFieldValue('propertyPhoto', updated)
                        }}
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* Media Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3.5">
                      <div>
                        <label className="block text-sm font-medium">
                          Select Media Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name={`propertyPhoto.${idx}.media_type`}
                          value={val.media_type}
                          onChange={e => setFieldValue(`propertyPhoto.${idx}.media_type`, e.target.value)}
                          onBlur={() => setFieldTouched(`propertyPhoto.${idx}.media_type`, true)}
                          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="">Select Type</option>
                          <option value="VIDEO">Video</option>
                          <option value="IMAGE">Image</option>
                        </select>
                        {touched.propertyPhoto && (
                          <ErrorMessage name={`propertyPhoto.${idx}.media_type`} component="p" className="text-red-600 text-xs mt-1" />
                        )}
                      </div>

                      {val?.media_type === 'IMAGE' && (
                        <div className="flex-col justify-center h-full space-y-2.5 mt-5">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name={`propertyPhoto.${idx}.is_primary`}
                              checked={val.is_primary ?? false}
                              onBlur={() => setFieldTouched(`propertyPhoto.${idx}.is_primary`, true)}
                              onChange={() => setFieldValue(`propertyPhoto.${idx}.is_primary`, !val.is_primary)}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="text-gray-800">Is Primary</span>
                          </label>
                          <ErrorMessage name={`propertyPhoto.${idx}.is_primary`} component="p" className="text-red-600 text-xs mt-1" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="mb-3.5">
                      <FormikTextField isrequired type="text" placeholder="Enter Title" label="Title" name={`propertyPhoto.${idx}.title`} />
                    </div>

                    {/* URL */}
                    <div className="mb-3.5">
                      <FormikTextField
                        isrequired
                        type="text"
                        placeholder="e.g., https://youtube.com/watch"
                        label="URL"
                        name={`propertyPhoto.${idx}.url`}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {values.uploadType === 'chooseFromDevice' && (
          <div
            className="max-w-4xl mx-auto p-6 bg-white"
            onDragEnter={handleAreaDragEnter}
            onDragOver={handleAreaDragOver}
            onDragLeave={handleAreaDragLeave}
            onDrop={handleAreaDrop}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload size={40} className="text-gray-400" />
              <span className="text-gray-700 font-medium">Upload Images / Videos</span>
              <span className="text-gray-500 text-sm">JPG, PNG or video files</span>
              <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png,video/*" onChange={handleFileInput} className="hidden" />
            </button>

            {isDraggingOverArea && (
              <div className="mt-6 p-6 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg text-blue-500 text-center">
                Drop files here to upload
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-6 border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Selected Files</h2>
                  <p className="text-sm text-gray-500">
                    {items.length} {items.length === 1 ? 'file' : 'files'}
                  </p>
                </div>

                {items.map((item, index) => {
                  const isPrimary = primaryIndex === index
                  const kind = item.file.type.startsWith('image/') ? 'Image' : 'Video'
                  const size = `${(item.file.size / 1024).toFixed(1)} KB`

                  return (
                    <div
                      key={item.preview}
                      className={`flex items-center p-3 border rounded-lg transition ${
                        isPrimary ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={event => handleItemDragOver(event, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <GripVertical className="mr-3 text-gray-400 cursor-move flex-shrink-0" size={20} />

                      <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.preview} alt={item.title || item.file.name} className="w-full h-full object-cover" />
                        {isPrimary && <CheckCircle className="absolute -top-1 -right-1 text-blue-500 bg-white rounded-full" size={16} />}
                      </div>

                      <div className="ml-3 flex-1">
                        <input
                          type="text"
                          value={item.title}
                          onChange={event => handleTitleChange(index, event.target.value)}
                          className="text-sm font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                          placeholder="Title"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {kind} • {size}
                        </p>

                        {isPrimary ? (
                          <p className="text-xs text-blue-600 mt-1">Primary</p>
                        ) : (
                          <button type="button" onClick={() => handleSetPrimary(index)} className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                            Set as Primary
                          </button>
                        )}
                      </div>

                      <button type="button" onClick={() => handleRemove(index)} className="ml-2 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                })}

                <Button
                  type="button"
                  onClick={() => submitForm()}
                  disabled={isUploading || items.length === 0}
                  className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
                    isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7B1E1E] hover:bg-[#641717]'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading {items.length} {items.length === 1 ? 'file' : 'files'}...
                    </>
                  ) : (
                    <>
                      <Upload size={18} /> Upload {items.length} {items.length === 1 ? 'File' : 'Files'}
                    </>
                  )}
                </Button>
              </div>
            )}

            {items.length === 0 && (
              <p className="mt-6 text-sm text-gray-500 text-center">
                No files selected yet. Use the button above or drag and drop files into this area.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function toTitle(file: File) {
  const { name } = file
  const segments = name.split('.')
  if (segments.length <= 1) return name
  segments.pop()
  const candidate = segments.join('.')
  return candidate || name
}

function createItem(file: File): UploadItem {
  return {
    file,
    preview: URL.createObjectURL(file),
    title: toTitle(file),
  }
}

function buildPayload(items: UploadItem[], primaryIndex: number | null): Array<LocalPropertyPhotoPayloadItem> {
  const resolvedPrimary = primaryIndex ?? 0
  return items.map((item, index) => ({
    // metadata only; File objects are kept in localpropertyPhoto.files
    is_primary: resolvedPrimary === index,
    title: item.title || toTitle(item.file),
    media_type: item.file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
    media_category: item.file.type,
    sort_order: index + 1,
  }))
}

function releasePreview(item: UploadItem) {
  if (item.preview.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(item.preview)
    } catch {
      // ignore preview cleanup errors
    }
  }
}
