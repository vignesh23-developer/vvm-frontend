// // 'use client'

// // import { ErrorMessage, FormikProps } from 'formik'
// // import Image from 'next/image'
// // import { useState, useRef, DragEvent, ChangeEvent } from 'react'
// // import { PropertyCreationFormValues } from '../page'
// // import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
// // import { Delete, Plus, Trash2 } from 'lucide-react'

// // interface ContactFormData {
// //   contactName: string
// //   phoneNumber: string
// //   whatsappNumber: string
// //   emailAddress: string
// //   boostListing: boolean
// // }

// // interface UploadedFile {
// //   file: File
// //   preview: string
// // }

// // interface Step4PhotosContactProps {
// //   contactData: ContactFormData
// //   setContactData: React.Dispatch<React.SetStateAction<ContactFormData>>
// //   uploadedFiles: UploadedFile[]
// //   setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
// //   formik: FormikProps<PropertyCreationFormValues>
// // }

// // export default function Step4PhotosContact({ contactData, setContactData, uploadedFiles, setUploadedFiles, formik }: Step4PhotosContactProps) {
// //   const { values, errors, touched, handleChange, setFieldValue } = formik
// //   const [isDragging, setIsDragging] = useState(false)
// //   const fileInputRef = useRef<HTMLInputElement>(null)

// //   const [uploadType, setUploadType] = useState<'addViaLink' | 'chooseFromDevice' | 'selectType'>('selectType')

// //   // Handle drag events for file upload
// //   const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault()
// //     e.stopPropagation()
// //     setIsDragging(true)
// //   }

// //   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault()
// //     e.stopPropagation()
// //     setIsDragging(false)
// //   }

// //   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault()
// //     e.stopPropagation()
// //   }

// //   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault()
// //     e.stopPropagation()
// //     setIsDragging(false)

// //     const files = Array.from(e.dataTransfer.files)
// //     processFiles(files)
// //   }

// //   // Process uploaded files
// //   const processFiles = (files: File[]) => {
// //     const validFiles = files.filter(file => file.type === 'image/jpeg' || file.type === 'image/png').slice(0, 10 - uploadedFiles.length)

// //     validFiles.forEach(file => {
// //       const reader = new FileReader()
// //       reader.onload = () => {
// //         setUploadedFiles(prev => [
// //           ...prev,
// //           {
// //             file,
// //             preview: reader.result as string,
// //           },
// //         ])
// //       }
// //       reader.readAsDataURL(file)
// //     })
// //   }

// //   // Handle file selection via button
// //   const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files) {
// //       const files = Array.from(e.target.files)
// //       processFiles(files)
// //     }
// //   }

// //   // Handle form input changes
// //   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
// //     const { name, value, type, checked } = e.target
// //     setContactData(prev => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value,
// //     }))
// //   }

// //   // Remove uploaded file
// //   const removeFile = (index: number) => {
// //     setUploadedFiles(prev => prev.filter((_, i) => i !== index))
// //   }

// //   return (
// //     <div className="max-w-4xl mx-auto p-6 bg-white">
// //       <h1 className="text-2xl font-bold text-gray-900 mb-8">Photos & Contact Information</h1>

// //       {/* Property Photos type Section */}
// //       <div className="mb-8">
// //         <div>
// //           <label className="block text-sm font-medium mb-2.5">
// //             Select Property Upload Type <span className="text-red-500">*</span>
// //           </label>
// //           <select
// //             name="UploadType"
// //             value={uploadType}
// //             onChange={e => {
// //               setUploadType(e?.target?.value as any)
// //             }}
// //             className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //           >
// //             <option value="selectType">Select Type</option>
// //             <option value="chooseFromDevice">Choose from Device</option>
// //             <option value="addViaLink">Add via Link</option>
// //           </select>
// //         </div>
// //       </div>

// //       {/* Property Photos Section */}
// //       {uploadType === 'addViaLink' ? (
// //         <div className="mb-8">
// //           <h2 className="text-lg font-medium text-gray-700 mb-4">Add Property Photos / Video Link</h2>

// //           <div className="border-2 border-dashed rounded-lg p-8  transition-all duration-200 border-gray-300 bg-gray-50">
// //             <div className="mb-3.5 flex justify-between ">
// //               {touched.propertyPhoto && typeof errors.propertyPhoto === 'string' && (
// //                 <p className="text-red-600 text-xs mt-1">{errors.propertyPhoto}</p>
// //               )}

// //               <button
// //                 type="button"
// //                 onClick={() => {
// //                   setFieldValue('propertyPhoto', [
// //                     ...(values?.propertyPhoto || []),
// //                     { media_type: '', url: '', title: '' }, // add an empty object for new media entry
// //                   ])
// //                 }}
// //                 className="flex flex-col justify-center"
// //               >
// //                 <div className=" p-2 w-fit  bg-red-600 rounded-md flex items-center justify-center text-white">
// //                   <span>Add custom feature</span>
// //                   <Plus size={16} />
// //                 </div>
// //               </button>
// //             </div>

// //           </div>
// //         </div>
// //       ) : (
// //         <div className="mb-8">
// //           <h2 className="text-lg font-medium text-gray-700 mb-4">Property Photos (or) Video</h2>

// //           {/* Drag and Drop Upload Area */}
// //           <div
// //             className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
// //               isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
// //             }`}
// //             onDragEnter={handleDragEnter}
// //             onDragLeave={handleDragLeave}
// //             onDragOver={handleDragOver}
// //             onDrop={handleDrop}
// //           >
// //             {/* Upload Icon */}
// //             <div className="mb-4">
// //               <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
// //                 <path
// //                   d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
// //                   strokeWidth={2}
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                 />
// //               </svg>
// //             </div>

// //             <p className="text-gray-600 mb-2">Drag and drop photos here, or click to browse</p>
// //             <p className="text-sm text-gray-500 mb-4">Upload up to 10 photos (JPG, PNG)</p>

// //             <button
// //               type="button"
// //               onClick={() => fileInputRef.current?.click()}
// //               className="bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
// //             >
// //               Choose Photos
// //             </button>

// //             <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png" onChange={handleFileSelect} className="hidden" />
// //           </div>

// //           {/* Preview uploaded files */}
// //           {uploadedFiles.length > 0 && (
// //             <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
// //               {uploadedFiles.map((fileData, index) => (
// //                 <div key={index} className="relative group">
// //                   <Image
// //                     src={fileData.preview}
// //                     alt={`Preview ${index + 1}`}
// //                     width={150}
// //                     height={150}
// //                     className="w-full h-24 object-cover rounded-lg"
// //                   />
// //                   <button
// //                     onClick={() => removeFile(index)}
// //                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
// //                   >
// //                     ×
// //                   </button>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* Contact Information Section */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //         {/* Contact Name */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Contact Name <span className="text-red-500">*</span>
// //           </label>
// //           <input
// //             type="text"
// //             name="contactName"
// //             value={contactData.contactName}
// //             onChange={handleInputChange}
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             required
// //           />
// //         </div>

// //         {/* Phone Number */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">
// //             Phone Number <span className="text-red-500">*</span>
// //           </label>
// //           <input
// //             type="tel"
// //             name="phoneNumber"
// //             value={contactData.phoneNumber}
// //             onChange={handleInputChange}
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             required
// //           />
// //         </div>

// //         {/* WhatsApp Number */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
// //           <input
// //             type="tel"
// //             name="whatsappNumber"
// //             value={contactData.whatsappNumber}
// //             onChange={handleInputChange}
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //           />
// //         </div>

// //         {/* Email Address */}
// //         <div>
// //           <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
// //           <input
// //             type="email"
// //             name="emailAddress"
// //             value={contactData.emailAddress}
// //             onChange={handleInputChange}
// //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //           />
// //         </div>
// //       </div>

// //       {/* Boost Your Listing Section */}
// //       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
// //         <div className="flex items-center">
// //           <div className="text-yellow-500 mr-3">
// //             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
// //               <path
// //                 fillRule="evenodd"
// //                 d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
// //                 clipRule="evenodd"
// //               />
// //             </svg>
// //           </div>
// //           <div>
// //             <h3 className="font-semibold text-gray-900">Boost Your Listing</h3>
// //             <p className="text-sm text-gray-600">Get 3x more visibility with premium placement</p>
// //           </div>
// //         </div>

// //         <label className="relative inline-flex items-center cursor-pointer">
// //           <input type="checkbox" name="boostListing" checked={contactData.boostListing} onChange={handleInputChange} className="sr-only peer" />
// //           <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
// //         </label>
// //       </div>
// //     </div>
// //   )
// // }

// 'use client'

// import { ErrorMessage, FormikProps } from 'formik'
// import Image from 'next/image'
// import { useState, useRef, DragEvent, ChangeEvent } from 'react'
// import { PropertyCreationFormValues } from '../page'
// import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
// import { Delete, Plus, Trash2 } from 'lucide-react'
// import { error } from 'console'
// import toast from 'react-hot-toast'

// interface ContactFormData {
//   contactName: string
//   phoneNumber: string
//   whatsappNumber: string
//   emailAddress: string
//   boostListing: boolean
// }

// interface UploadedFile {
//   file: File
//   preview: string
// }

// interface Step4PhotosContactProps {
//   contactData: ContactFormData
//   setContactData: React.Dispatch<React.SetStateAction<ContactFormData>>
//   uploadedFiles: UploadedFile[]
//   setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
//   formik: FormikProps<PropertyCreationFormValues>
// }

// export default function Step4PhotosContact({ contactData, setContactData, uploadedFiles, setUploadedFiles, formik }: Step4PhotosContactProps) {
//   const { values, errors, touched, handleChange, setFieldValue, setFieldTouched } = formik
//   const [isDragging, setIsDragging] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const [uploadType, setUploadType] = useState<'addViaLink' | 'chooseFromDevice' | 'selectType'>('selectType')

//   // Handle drag events for file upload
//   const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setIsDragging(true)
//   }

//   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setIsDragging(false)
//   }

//   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setIsDragging(false)

//     const files = Array.from(e.dataTransfer.files)
//     processFiles(files)
//   }

//   // Process uploaded files
//   const processFiles = (files: File[]) => {
//     const validFiles = files.filter(file => file.type === 'image/jpeg' || file.type === 'image/png').slice(0, 10 - uploadedFiles.length)

//     validFiles.forEach(file => {
//       const reader = new FileReader()
//       reader.onload = () => {
//         setUploadedFiles(prev => [
//           ...prev,
//           {
//             file,
//             preview: reader.result as string,
//           },
//         ])
//       }
//       reader.readAsDataURL(file)
//     })
//   }

//   // Handle file selection via button
//   const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
//     const mediaType = values?.localpropertyPhoto?.media_type
//     if (!mediaType.includes('IMAGE') || !mediaType.includes('VIDEO') || mediaType.trim() === '') {
//       toast.error('Please select media type')
//       return
//     }
//     if (!e.target.files) {
//       return
//     }
//     const filesArray = Array.from(e.target.files) as File[]

//     if (values.localpropertyPhoto.media_type === 'IMAGE') {
//       const validFiles = filesArray.filter(file => file.type === 'image/jpeg' || file.type === 'image/png')
//       setFieldValue('localpropertyPhoto.files', validFiles)
//     } else {
//       // handle other media types e.g. VIDEO
//       const validFiles = filesArray.filter(file => file.type.startsWith('video/'))
//       setFieldValue('localpropertyPhoto.files', validFiles)
//     }
//   }

//   // Handle form input changes
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target
//     setContactData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }))
//   }

//   // Remove uploaded file
//   const removeFile = (index: number) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index))
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white">
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">Photos & Contact Information</h1>

//       {/* Upload Type selector */}
//       <div className="mb-8">
//         <label className="block text-sm font-medium mb-2.5">
//           Select Property Upload Type <span className="text-red-500">*</span>
//         </label>
//         <select
//           name="uploadType"
//           value={values.uploadType}
//           onChange={e => {
//             // setUploadType(e.target.value as any)
//             setFieldValue('uploadType', e.target.value)
//           }}
//           className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//         >
//           <option value="selectType">Select Type</option>
//           <option value="chooseFromDevice">Choose from Device</option>
//           <option value="addViaLink">Add via Link</option>
//         </select>

//         {touched.uploadType && errors.uploadType && <p className="text-red-600 text-xs mt-1">{errors.uploadType}</p>}
//       </div>

//       {/* “Add via Link” Section */}
//       {values.uploadType === 'addViaLink' ? (
//         <div className="mb-8">
//           <h2 className="text-lg font-medium text-gray-700 mb-4">Add Property Photos / Video Link</h2>

//           <div className="border-2 border-dashed rounded-lg p-8 transition-all duration-200 border-gray-300 bg-gray-50">
//             <div className="mb-3.5 flex justify-between">
//               {/* Top-level error for array (e.g., min length) */}
//               {touched.propertyPhoto && typeof errors.propertyPhoto === 'string' && (
//                 <p className="text-red-600 text-xs mt-1">{errors.propertyPhoto}</p>
//               )}

//               <button
//                 type="button"
//                 onClick={() => {
//                   const current = values.propertyPhoto || []
//                   setFieldValue('propertyPhoto', [...current, { media_type: '', url: '', title: '' }])
//                 }}
//                 className="flex flex-col justify-center"
//               >
//                 <div className="p-2 w-fit bg-red-600 rounded-md flex items-center justify-center text-white">
//                   <span>Add custom feature</span>
//                   <Plus size={16} />
//                 </div>
//               </button>
//             </div>

//             {/* Map over array items */}
//             {values.propertyPhoto &&
//               values.propertyPhoto.length > 0 &&
//               values.propertyPhoto.map((val, idx) => (
//                 <div key={idx} className="mb-6 border p-4 rounded-lg">
//                   <div className="flex items-center justify-between">
//                     <label className="block text-lg mb-3.5">Fields {idx + 1}</label>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const updated = (values.propertyPhoto || []).filter((_, i) => i !== idx)
//                         setFieldValue('propertyPhoto', updated)
//                       }}
//                     >
//                       <Trash2 className="w-4.5 h-4.5" />
//                     </button>
//                   </div>

//                   {/* Media Type */}
//                   <div className="mb-3.5">
//                     <label className="block text-sm font-medium">
//                       Select Media Type <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name={`propertyPhoto.${idx}.media_type`}
//                       value={val.media_type}
//                       onChange={e => {
//                         setFieldValue(`propertyPhoto.${idx}.media_type`, e.target.value)
//                       }}
//                       onBlur={() => {
//                         setFieldTouched(`propertyPhoto.${idx}.media_type`, true)
//                       }}
//                       className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     >
//                       <option value="">Select Type</option>
//                       <option value="VIDEO">Video</option>
//                       <option value="IMAGE">Image</option>
//                     </select>
//                     <ErrorMessage name={`propertyPhoto.${idx}.media_type`} component="p" className="text-red-600 text-xs mt-1" />
//                   </div>

//                   {/* Title */}
//                   <div className="mb-3.5">
//                     <FormikTextField isrequired type="text" placeholder="Enter Title" label="Title" name={`propertyPhoto.${idx}.title`} />
//                   </div>

//                   {/* URL */}
//                   <div className="mb-3.5">
//                     <FormikTextField
//                       isrequired
//                       type="text"
//                       placeholder="e.g., https://youtube.com/watch"
//                       label="URL"
//                       name={`propertyPhoto.${idx}.url`}
//                     />
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       ) : (
//         <></>
//       )}

//       {values.uploadType === 'chooseFromDevice' && (
//         <div className="mb-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="my-3.5">
//               <label className="block text-sm font-medium mb-1">
//                 Select Media Type <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="localpropertyPhoto.media_type"
//                 value={values?.localpropertyPhoto?.media_type}
//                 onChange={e => {
//                   setFieldValue('localpropertyPhoto.media_type', e.target.value)
//                 }}
//                 onBlur={() => {
//                   setFieldTouched('localpropertyPhoto.media_type', true)
//                 }}
//                 className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               >
//                 <option value="">Select Type</option>
//                 <option value="VIDEO">Video</option>
//                 <option value="IMAGE">Image</option>
//               </select>
//               {touched.propertyType && errors.propertyType && <p className="text-red-600 text-xs mt-1">{errors.propertyType}</p>}
//             </div>

//             <label className="flex items-center space-x-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="localpropertyPhoto.is_primary"
//                 checked={values.localpropertyPhoto.is_primary}
//                 onChange={e => {
//                   setFieldValue('localpropertyPhoto.is_primary', e.target.checked)
//                 }}
//                 onBlur={() => {
//                   formik.setFieldTouched('localpropertyPhoto.is_primary', true)
//                 }}
//                 className="sr-only peer"
//               />
//               <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>

//               <span className="text-gray-800">Is Primary</span>
//             </label>
//             <ErrorMessage name="localpropertyPhoto.is_primary" component="p" className="text-red-600 text-xs mt-1" />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <FormikTextField isrequired type="text" placeholder="Enter Title" label="Title" name={`localpropertyPhoto..title`} />
//             <FormikTextField
//               isrequired={false}
//               type="text"
//               placeholder="Enter Media Category"
//               label="Media Category"
//               name={`localpropertyPhoto..media_category`}
//             />
//           </div>

//           <div className="mb-2.5">
//             <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               placeholder="Describe your property in detail..."
//               value={values.description}
//               onChange={handleChange}
//               rows={4}
//               maxLength={500}
//               aria-invalid={!!(errors.description && touched.description)}
//               className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none
//               ${errors.description && touched.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
//             />
//             {touched.description && errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
//             <div className="text-xs text-gray-500 mt-1">{values.description.length}/500 characters</div>
//           </div>

//           <h2 className="text-lg font-medium text-gray-700 mb-4">Property Photos (or) Video</h2>

//           {/* Drag and Drop Upload Area */}
//           <div
//             className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
//               isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
//             }`}
//             onDragEnter={handleDragEnter}
//             onDragLeave={handleDragLeave}
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//           >
//             {/* Upload Icon */}
//             <div className="mb-4">
//               <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//                 <path
//                   d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>

//             <p className="text-gray-600 mb-2">Drag and drop photos here, or click to browse</p>
//             <p className="text-sm text-gray-500 mb-4">Upload up to 10 photos (JPG, PNG)</p>

//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
//             >
//               Choose Photos
//             </button>

//             <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png" onChange={handleFileSelect} className="hidden" />
//           </div>

//           {/* Preview uploaded files */}
//           {values?.localpropertyPhoto?.files?.length > 0 && (
//             <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {values.localpropertyPhoto.files.map((fileData, index) => {
//                 const previewSrc =
//                   typeof fileData === 'string' ? fileData : fileData?.preview || (fileData instanceof File ? URL.createObjectURL(fileData) : null)

//                 return previewSrc ? (
//                   <div key={index} className="relative group">
//                     <Image src={previewSrc} alt={`Preview ${index + 1}`} width={150} height={150} className="w-full h-24 object-cover rounded-lg" />
//                     <button
//                       type="button"
//                       onClick={() => removeFile(index)}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ) : null
//               })}
//             </div>
//           )}

//           {values?.localpropertyPhoto?.files?.length > 0 && (
//             <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {values.localpropertyPhoto.files.map((fileData, index) => {
//                 const previewSrc =
//                   typeof fileData === 'string' ? fileData : fileData?.preview || (fileData instanceof File ? URL.createObjectURL(fileData) : null)

//                 return previewSrc ? (
//                   <div key={index} className="relative group">
//                     <Image src={previewSrc} alt={`Preview ${index + 1}`} width={150} height={150} className="w-full h-24 object-cover rounded-lg" />
//                     <button
//                       type="button"
//                       onClick={() => removeFile(index)}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ) : null
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* The rest of your component (chooseFromDevice section, contact info, etc) stays here */}
//     </div>
//   )
// }

'use client'

import { ErrorMessage, FormikProps } from 'formik'
import Image from 'next/image'
import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { PropertyCreationFormValues } from '../page'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

// 1. Remove old state props. The component only needs Formik.
interface Step4PhotosContactProps {
  formik: FormikProps<PropertyCreationFormValues>
}

export default function Step4PhotosContact({ formik }: Step4PhotosContactProps) {
  const { values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur } = formik
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Drag-and-drop handlers (no changes needed)
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // 2. Connect handleDrop to Formik
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const mediaType = values?.localpropertyPhoto?.media_type
    if (!mediaType || (mediaType !== 'IMAGE' && mediaType !== 'VIDEO')) {
      toast.error('Please select a media type before uploading.')
      return
    }

    const filesArray = Array.from(e.dataTransfer.files)
    processAndSetFiles(filesArray)
  }

  // 3. Connect handleFileSelect to Formik (your logic was good, just standardized)
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const mediaType = values?.localpropertyPhoto?.media_type
    if (!mediaType || (mediaType !== 'IMAGE' && mediaType !== 'VIDEO')) {
      toast.error('Please select a media type before uploading.')
      if (e.target) e.target.value = '' // Clear the input
      return
    }

    if (!e.target.files) return
    const filesArray = Array.from(e.target.files)
    processAndSetFiles(filesArray)
  }

  // 4. Create a single function to process files for both drop and select
  const processAndSetFiles = (files: File[]) => {
    const currentFiles = values.localpropertyPhoto.files || []
    let validFiles: File[] = []

    if (values.localpropertyPhoto.media_type === 'IMAGE') {
      validFiles = files.filter(file => file.type === 'image/jpeg' || file.type === 'image/png')
    } else if (values.localpropertyPhoto.media_type === 'VIDEO') {
      validFiles = files.filter(file => file.type.startsWith('video/'))
    }

    // Combine new valid files with existing ones
    setFieldValue('localpropertyPhoto.files', [...currentFiles, ...validFiles])
  }

  // 5. Connect removeFile to Formik
  const removeFile = (index: number) => {
    const currentFiles = [...values.localpropertyPhoto.files]
    currentFiles.splice(index, 1) // Remove the file at the specified index
    setFieldValue('localpropertyPhoto.files', currentFiles)
  }

  // 6. DELETED handleInputChange (it's obsolete)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Photos & Contact Information</h1>

      {/* Upload Type selector (This part was correct) */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2.5">
          Select Property Upload Type <span className="text-red-500">*</span>
        </label>
        <select
          name="uploadType"
          value={values.uploadType}
          onChange={handleChange} // Use Formik's handleChange
          onBlur={handleBlur} // Use Formik's handleBlur
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Type</option>
          <option value="chooseFromDevice">Choose from Device</option>
          <option value="addViaLink">Add via Link</option>
        </select>
        {/* Use ErrorMessage component for cleaner error display */}
        <ErrorMessage name="uploadType" component="p" className="text-red-600 text-xs mt-1" />
      </div>

      {/* “Add via Link” Section (This part was correct) */}
      {values.uploadType === 'addViaLink' ? (
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
                        onChange={e => {
                          setFieldValue(`propertyPhoto.${idx}.media_type`, e.target.value)
                        }}
                        onBlur={() => {
                          setFieldTouched(`propertyPhoto.${idx}.media_type`, true)
                        }}
                        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">Select Type</option>
                        <option value="VIDEO">Video</option>
                        <option value="IMAGE">Image</option>
                      </select>
                      <ErrorMessage name={`propertyPhoto.${idx}.media_type`} component="p" className="text-red-600 text-xs mt-1" />
                    </div>
                    {val?.media_type === 'IMAGE' && (
                      <div className="flex-col  justify-center h-full space-y-2.5 mt-5">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name={`propertyPhoto.${idx}.is_primary`}
                            checked={val.is_primary ?? false}
                            onBlur={() => {
                              setFieldTouched(`propertyPhoto.${idx}.is_primary`, true)
                            }}
                            onChange={() => {
                              // Manually set the field's value to the opposite of its current value
                              setFieldValue(`propertyPhoto.${idx}.is_primary`, !val.is_primary)
                            }}
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
      ) : (
        <></>
      )}

      {/* “Choose from Device” Section */}
      {values.uploadType === 'chooseFromDevice' && (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="my-3.5">
              <label className="block text-sm font-medium mb-1">
                Select Media Type <span className="text-red-500">*</span>
              </label>
              <select
                name="localpropertyPhoto.media_type" // 7. FIX: Correct name
                value={values.localpropertyPhoto.media_type}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="VIDEO">Video</option>
                <option value="IMAGE">Image</option>
              </select>
              {/* 8. FIX: Correct error message binding */}
              <ErrorMessage name="localpropertyPhoto.media_type" component="p" className="text-red-600 text-xs mt-1" />
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="localpropertyPhoto.is_primary"
                checked={values.localpropertyPhoto.is_primary}
                onChange={handleChange}
                onBlur={handleBlur}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="text-gray-800">Is Primary</span>
            </label>
            <ErrorMessage name="localpropertyPhoto.is_primary" component="p" className="text-red-600 text-xs mt-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 9. FIX: Removed double dot from name */}
            <FormikTextField type="text" placeholder="Enter Title" label="Title" name="localpropertyPhoto.title" />
            <FormikTextField type="number" placeholder="Enter Sort Order" label="Sort Order" name="localpropertyPhoto.sort_order" />
          </div>
          <FormikTextField type="text" placeholder="Enter Media Category" label="Media Category" name="localpropertyPhoto.media_category" />

          <div className="mb-2.5">
            <label htmlFor="localpropertyPhoto.description" className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            {/* 11. FIX: Connect textarea to Formik */}
            <textarea
              id="localpropertyPhoto.description"
              name="localpropertyPhoto.description"
              placeholder="Describe this media..."
              value={values.localpropertyPhoto.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              maxLength={500}
              aria-invalid={!!(errors.localpropertyPhoto?.description && touched.localpropertyPhoto?.description)}
              className={`mt-2 w-full px-4 py-3 border rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-[#7B1E1E] focus:outline-none
               ${errors.localpropertyPhoto?.description && touched.localpropertyPhoto?.description ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
            />
            <ErrorMessage name="localpropertyPhoto.description" component="p" className="text-red-600 text-xs mt-1" />
            <div className="text-xs text-gray-500 mt-1">{values.localpropertyPhoto.description.length}/500 characters</div>
          </div>

          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Upload Files <span className="text-red-500">*</span>
          </h2>

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* ... SVG icon ... */}
            <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">JPG, PNG, or Video files</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#7B1E1E] hover:bg-[#641717] cursor-pointer text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Choose Files
            </button>
            <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png,video/*" onChange={handleFileSelect} className="hidden" />
          </div>
          {/* 12. FIX: Add error message for the files array itself */}
          <ErrorMessage name="localpropertyPhoto.files" component="p" className="text-red-600 text-xs mt-1" />

          {values.localpropertyPhoto?.files?.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {values.localpropertyPhoto.files.map((file, index) => {
                // Create a preview URL for the File object
                const previewSrc = URL.createObjectURL(file)
                return (
                  <div key={index} className="relative group">
                    <Image src={previewSrc} alt={`Preview ${index + 1}`} width={150} height={150} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)} // 14. FIX: Use new removeFile function
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Contact Information Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"> */}
      {/* 15. FIX: Replaced all contact inputs with FormikTextField */}
      {/* <FormikTextField isrequired type="text" placeholder="Enter Contact Name" label="Contact Name" name="contactName" />
        <FormikTextField isrequired type="tel" placeholder="Enter Phone Number" label="Phone Number" name="phoneNumber" />
        <FormikTextField isrequired type="tel" placeholder="Enter WhatsApp Number" label="WhatsApp Number" name="whatsappNumber" />
        <FormikTextField isrequired type="email" placeholder="Enter Email Address" label="Email Address" name="emailAddress" /> */}
      {/* </div> */}

      {/* Boost Your Listing Section */}
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between"> */}
      {/* ... SVG icon ... */}
      {/* <div>
          <h3 className="font-semibold text-gray-900">Boost Your Listing</h3>
          <p className="text-sm text-gray-600">Get 3x more visibility with premium placement</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="boostListing"
            checked={values.boostListing}
            onChange={handleChange}
            onBlur={handleBlur}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label> */}
      {/* </div> */}
    </div>
  )
}
