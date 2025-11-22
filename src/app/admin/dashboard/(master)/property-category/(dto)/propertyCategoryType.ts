export interface PropertyCategory {
  id: number
  name: string
  icon: string
  description?: string
  isActive?: boolean
  sortOrder?: number
}

export interface PropertyCategoryFormValues {
  name: string
  icon: string
  description: string
  sortOrder?: number
  isActive?: boolean
}

export interface PropertyCategoryFormProps {
  initialValues: PropertyCategoryFormValues
  /** Submit handler */
  onSubmit: (values: PropertyCategoryFormValues) => Promise<void>

  /** Optional — Change button label dynamically */
  submitLabel?: string

  /** Optional — Change button state for add/edit */
  isEdit?: boolean
}
