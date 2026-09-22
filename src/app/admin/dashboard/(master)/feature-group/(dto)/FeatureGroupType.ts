export interface FeatureGroup {
  id: number
  name: string
  icon: string
  sortOrder: number
  isActive: boolean
}

export interface FormValues {
  name: string
  icon: string
  sortOrder?: number
  isActive?: boolean
}

export interface FeatureGroupFormProps {
  initialValues: FormValues
  /** Submit handler */
  onSubmit: (values: FormValues) => Promise<void>

  /** Optional — Change button label dynamically */
  submitLabel?: string

  /** Optional — Change button state for add/edit */
  isEdit?: boolean
}

export interface FeatureGroupTableProps {
  page: number
  limit: number
}
