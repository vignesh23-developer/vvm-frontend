// ✅ Define type
export interface FeatureOption {
  id: number
  name: string
  value: string
  icon?: string
  sortOrder: number
  isActive: boolean
  featureCategoryId: string
  createdAt: string
  updatedAt: string
}

export interface FeatureCategory {
  id: number
  code: string
  name: string
  description?: string
  featureGroupId: string
  featureGroupName?: string
  featureGroupSortOrder?: string
  inputType:
    | 'single_select'
    | 'multi_select'
    | 'text'
    | 'numeric'
    | 'boolean'
    | 'units'
    | string
  isFilterable: boolean
  isMandatory: boolean
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  options?: FeatureOption[]
}

export interface FeatureGroup {
  id: string
  name: string
}

export type FeatureInputType =
  | 'single_select'
  | 'multi_select'
  | 'text'
  | 'numeric'
  | 'boolean'
  | 'units'
  | ''

export interface FeatureOptionFormValue {
  id?: number
  name?: string
  value?: string
  icon?: string
  sortOrder?: number
  isActive?: boolean
}

export interface FeatureCategoryFormValues {
  id?: number
  code?: string
  name?: string
  description?: string
  featureGroupId?: string
  inputType?: FeatureInputType
  isFilterable?: boolean
  isMandatory?: boolean
  sortOrder?: number
  options?: FeatureOptionFormValue[]
}

export interface FeatureCategoryFormProps {
  initialValues: FeatureCategory
  onSubmit: (values: FeatureCategory) => Promise<void>
  submitLabel?: string
  isEdit?: boolean
}
