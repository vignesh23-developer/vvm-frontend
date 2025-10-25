'use client'

import {Formik, Form, FieldArray} from 'formik'
import {Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import * as Yup from 'yup'
import useSWR from 'swr'
import FormikTextField from '@/components/ui/Formik/FormikTextField/FormikTextField'
import FormikCheckboxField from '@/components/ui/Formik/FormikCheckboxField/FormikCheckboxField'
import FormikSelectField from '@/components/ui/Formik/FormikSelectField/FormikSelectField'
import {getMethod} from '@/services/service'
import {appEnpoints} from '@/services/endpoints'
import FormikIconPickerField from "@/components/ui/Formik/FormikIconPickerField/FormikIconPickerField";

/* ================================
   ✅ Interfaces
================================== */
export interface FeatureOption {
    id?: number
    name: string
    value: string
    icon: string
    sortOrder: number
    isActive: boolean
    featureCategoryId?: string
}

export interface FeatureCategory {
    id?: number
    code: string
    name: string
    description?: string
    featureGroupId?: string
    inputType: 'single_select' | 'multi_select' | 'text' | 'number' | string
    isFilterable: boolean
    isMandatory: boolean
    sortOrder: number
    options: FeatureOption[]
}

export interface FeatureGroup {
    id: string
    name: string
}

const validationSchema = Yup.object({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
    inputType: Yup.string().required('Input type is required'),
    // options: Yup.array()
    //   .of(
    //     Yup.object({
    //       name: Yup.string().required('Option name is required'),
    //       value: Yup.string().required('Option value is required'),
    //       sortOrder: Yup.number().required('Sort order is required'),
    //       isActive: Yup.boolean(),
    //     }),
    //   )
    //   .min(1, 'At least one option is required'),
})

/* ================================
   ✅ Form Props
================================== */
export interface FeatureCategoryFormProps {
    initialValues: FeatureCategory
    onSubmit: (values: FeatureCategory) => Promise<void>
    submitLabel?: string
    isEdit?: boolean
}

/* ================================
   ✅ Component
================================== */
export default function FeatureCategoryForm({
                                                initialValues,
                                                onSubmit,
                                                submitLabel,
                                                isEdit = false,
                                            }: FeatureCategoryFormProps) {
    const router = useRouter()

    // Fetcher using our generic API helper
    const fetcher = async (url: string): Promise<FeatureGroup[]> => {
        try {
            const response = await getMethod<FeatureGroup[]>(url)
            console.log('Fetched feature group ResponseDTO:', response)

            if (response.error) {
                console.error(
                    'API error while fetching feature groups:',
                    response.message,
                )
                return []
            }

            // Safe extraction of data
            if (Array.isArray(response.data)) {
                return response.data
            }

            console.warn('Unexpected data format:', response.data)
            return []
        } catch (error) {
            console.error('Failed to fetch feature groups:', error)
            return []
        }
    }

    // ✅ Fetch Feature Groups
    const {
        data: featureGroups,
        error: groupError,
        isLoading,
    } = useSWR<FeatureGroup[]>(
        `${appEnpoints.getAllFeatureGroups}?activeOnly=true`,
        fetcher,
    )

    const featureGroupOptions =
        featureGroups?.map(group => ({
            value: group.id,
            label: group.name,
        })) || []

    const inputTypeOptions = [
        {value: 'single_select', label: 'Single Select'},
        {value: 'multi_select', label: 'Multi Select'},
        {value: 'text', label: 'Text'},
        {value: 'number', label: 'Number'},
    ]

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={onSubmit}
        >
            {({values, isSubmitting}) => (
                <Form className="space-y-6">
                    {/* --- Basic Info --- */}
                    {!isEdit && (
                        <FormikTextField
                            label="Code *"
                            name="code"
                            placeholder="e.g. BHK, CONFIG, TYPE"
                            className="w-full border-0 bg-gray-100 rounded-md px-4 py-3"
                        />
                    )}

                    <FormikTextField
                        label="Feature Category Name *"
                        name="name"
                        placeholder="Enter feature category name"
                        className="w-full border-0 bg-gray-100 rounded-md px-4 py-3"
                    />
                    {!isEdit && (
                        <>
                            <FormikTextField
                                label="Description"
                                name="description"
                                as="textarea"
                                placeholder="Enter description"
                                className="w-full border-0 bg-gray-100 rounded-md px-4 py-3 h-36"
                            />

                            {/* ✅ Feature Group Select */}
                            <FormikSelectField
                                label="Feature Group"
                                name="featureGroupId"
                                options={featureGroupOptions}
                                placeholder={
                                    isLoading
                                        ? 'Loading...'
                                        : groupError
                                            ? 'Failed to load groups'
                                            : 'Select a feature group'
                                }
                            />
                        </>
                    )}
                    {/* Input Type */}
                    <FormikSelectField
                        label="Input Type"
                        name="inputType"
                        options={inputTypeOptions}
                        placeholder="Select input type"
                    />

                    {!isEdit && (
                        <>
                            <FormikTextField
                                label="Sort Order"
                                name="sortOrder"
                                type="number"
                                placeholder="Enter sort order"
                                className="w-full border-0 bg-gray-100 rounded-md px-4 py-3"
                            />

                            <FormikCheckboxField label="Filterable" name="isFilterable"/>
                            <FormikCheckboxField label="Mandatory" name="isMandatory"/>
                        </>
                    )}

                    {/* --- Dynamic Options Section --- */}
                    {(values.inputType === 'single_select' ||
                        values.inputType === 'multi_select') && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                Feature Options
                            </h3>

                            <FieldArray name="options">
                                {({push, remove}) => (
                                    <div className="space-y-4">
                                        {values.options.map((option, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-5 gap-3 border p-4 rounded-lg bg-gray-50"
                                            >
                                                <FormikTextField
                                                    label="Name"
                                                    name={`options[${index}].name`}
                                                    placeholder="Option Name"
                                                />

                                                <FormikIconPickerField
                                                    label="Icon"
                                                    name={`options[${index}].icon`}
                                                />

                                                <FormikTextField
                                                    label="Sort Order"
                                                    name={`options[${index}].sortOrder`}
                                                    type="number"
                                                />

                                                <FormikCheckboxField
                                                    label="Active"
                                                    name={`options[${index}].isActive`}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-red-500 text-sm mt-6 hover:cursor-pointer flex items-center justify-center"
                                                    title="remove"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                push({
                                                    name: '',
                                                    value: '',
                                                    sortOrder: values.options.length + 1,
                                                    isActive: true,
                                                })
                                            }
                                            className="mt-3 px-3 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300 cursor-pointer transition"
                                        >
                                            + Add Option
                                        </button>
                                    </div>
                                )}
                            </FieldArray>
                        </div>
                    )}

                    {/* --- Action Buttons --- */}
                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 rounded-md text-white font-medium transition ${
                                isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black hover:bg-gray-800 cursor-pointer'
                            }`}
                        >
                            {isSubmitting
                                ? isEdit
                                    ? 'Updating...'
                                    : 'Creating...'
                                : submitLabel ||
                                (isEdit
                                    ? 'Update Feature Category'
                                    : 'Create Feature Category')}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
