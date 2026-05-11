// types/property-listing.ts

import { property } from 'zod'

export interface FeatureOptionGroup {
  feature_category_id: string | undefined
  feature_group_id: string | undefined
  option_ids: string[]
}

export class FetaureOptions {
  id: string
  name: string
  value: string
  icon: any
  sort_order: number
  is_active: boolean

  constructor(data: Partial<FetaureOptions>) {
    this.id = data?.id ?? ''
    this.name = data?.name ?? ''
    this.value = data?.value ?? ''
    this.sort_order = data?.sort_order ?? 0
    this.is_active = data?.is_active ?? false
  }
}

// DTO for feature mapping
export class FeatureMappingDTO {
  feature_category_id?: string
  feature_category_name: string
  feature_category_code: string
  description: string
  input_type: string
  feature_group_id: string | null
  feature_group_name: string
  feature_group_sort_order: number
  is_mandatory: boolean
  is_filterable: boolean
  sort_order: number
  is_active: boolean
  options?: Array<FetaureOptions>
  display_value?: string | number | boolean

  constructor(data: Partial<FeatureMappingDTO>) {
    this.feature_category_id = data.feature_category_id ?? ''
    this.feature_category_name = data.feature_category_name ?? ''
    this.feature_category_code = data.feature_category_code ?? ''
    this.description = data.description ?? ''
    this.input_type = data.input_type ?? ''
    this.feature_group_id = data.feature_group_id ?? ''
    this.feature_group_name = data.feature_group_name ?? ''
    this.feature_group_sort_order = data.feature_group_sort_order ?? 0
    this.is_mandatory = data.is_mandatory ?? false
    this.is_filterable = data.is_filterable ?? false
    this.sort_order = data.sort_order ?? 0
    this.is_active = data.is_active ?? false
    this.options = data.options ?? []
    this.display_value = data.display_value ?? ''
  }
}

// export class FeaturePayloadDTO {
//   feature_category_id: string
//   feature_group_id: string | null
//   option_ids: Array<String>
//   value_text?: string
//   value_number?: number
//   value_boolean?: boolean
//   is_mandator: boolean

//   constructor(data: Partial<FeaturePayloadDTO>) {
//     this.feature_category_id = data.feature_category_id ?? ''
//     this.feature_group_id = data.feature_group_id ?? ''
//     this.option_ids = data.option_ids ?? []
//     this.value_text = data.value_text ?? ''
//     this.value_number = data.value_number ?? 0
//     this.value_boolean = data.value_boolean ?? false
//     this.is_mandator = data.is_mandator ?? false
//   }
// }

// DTO for getAllPropertyCategoryFeatureMapping
export class GetAllPropertyCategoryFeatureMappingDTO {
  property_category_id: string
  property_category_name: string
  mappings: FeatureMappingDTO[]

  constructor(data: any) {
    this.property_category_id = data.property_category_id
    this.property_category_name = data.property_category_name
    this.mappings = data.mappings.map((mapping: any) => new FeatureMappingDTO(mapping))
  }
}

export class LandRegistrationDTO {
  title: string
  description: string
  property_category_id: string
  price: number
  price_unit: string
  listing_type: string
  status: string
  door_number: string
  street_name: string
  address_line: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: number
  longitude: number
  agent_id: string
  is_published: boolean
  features: FeatureOptionGroup[]

  constructor(init: {
    title: string
    description: string
    property_category_id: string
    price: number
    price_unit: string
    listing_type: string
    status: string
    door_number: string
    street_name: string
    address_line: string
    city: string
    district: string
    state: string
    postal_code: string
    country: string
    latitude: number
    longitude: number
    agent_id: string
    is_published: boolean
    features: FeatureOptionGroup[]
  }) {
    this.title = init.title
    this.description = init.description
    this.property_category_id = init.property_category_id
    this.price = init.price
    this.price_unit = init.price_unit
    this.listing_type = init.listing_type
    this.status = init.status
    this.door_number = init.door_number
    this.street_name = init.street_name
    this.address_line = init.address_line
    this.city = init.city
    this.district = init.district
    this.state = init.state
    this.postal_code = init.postal_code
    this.country = init.country
    this.latitude = init.latitude
    this.longitude = init.longitude
    this.agent_id = init.agent_id
    this.is_published = init.is_published
    this.features = init.features
  }
}
// export class LandRegistrationPayloadDTO {
//   title: string
//   description: string
//   property_category_id: string
//   price: number
//   price_unit: string
//   listing_type: string
//   status: string
//   door_number: string
//   street_name: string
//   address_line: string
//   city: string
//   district: string
//   state: string
//   postal_code: string
//   country: string
//   latitude: number
//   longitude: number
//   agent_id: string
//   is_published: boolean
//   features: FeaturePayloadDTO[]

//   constructor(init: Partial<LandRegistrationPayloadDTO>) {
//     this.title = init.title ?? ''
//     this.description = init.description ?? ''
//     this.property_category_id = init.property_category_id ?? ''
//     this.price = init.price ?? 0
//     this.price_unit = init.price_unit ?? ''
//     this.listing_type = init.listing_type ?? ''
//     this.status = init.status ?? ''
//     this.door_number = init.door_number ?? ''
//     this.street_name = init.street_name ?? ''
//     this.address_line = init.address_line ?? ''
//     this.city = init.city ?? ''
//     this.district = init.district ?? ''
//     this.state = init.state ?? ''
//     this.postal_code = init.postal_code ?? ''
//     this.country = init.country ?? ''
//     this.latitude = init.latitude ?? 0
//     this.longitude = init.longitude ?? 0
//     this.agent_id = init.agent_id ?? ''
//     this.is_published = init.is_published ?? false
//     this.features = init.features ?? []
//   }
// }

export class FeaturePayloadDTO {
  feature_category_id: string
  feature_group_id: string | null
  option_ids: string[]
  value_text?: string
  value_number?: number | string
  value_boolean?: string
  is_mandator: boolean

  constructor(data: Partial<FeaturePayloadDTO>) {
    this.feature_category_id = data.feature_category_id ?? ''
    this.feature_group_id = data.feature_group_id ?? null
    this.option_ids = data.option_ids ?? []
    this.value_text = data.value_text
    this.value_number = data.value_number
    this.value_boolean = data.value_boolean
    this.is_mandator = data.is_mandator ?? false
  }

  toObject(): Record<string, unknown> {
    return {
      feature_category_id: this.feature_category_id,
      feature_group_id: this.feature_group_id,
      option_ids: this.option_ids,
      value_text: this.value_text,
      value_number: this.value_number,
      value_boolean: this.value_boolean,
    }
  }

  serialize(): string {
    return JSON.stringify(this.toObject())
  }
}

export class LandRegistrationPayloadDTO {
  contact_name: string
  contact_phone: string
  contact_email: string
  title: string
  description: string
  property_category_id: string
  price: number
  property_size: number | string
  property_size_unit: string
  listing_type: string
  status: string
  project_status?: string
  layout_price_min?: number | string
  layout_price_max?: number | string
  layout_area_min_sqft?: number | string
  layout_area_max_sqft?: number | string
  plot_total_count?: number | string
  plot_sold_count?: number | string
  plot_booked_count?: number | string
  plot_available_count?: number | string
  layout_total_sqft?: number | string
  door_number: string
  street_name: string
  address_line: string
  city: string
  district: string
  state: string
  postal_code: string
  country: string
  latitude: number
  longitude: number
  agent_id: string
  is_published: boolean
  features: FeaturePayloadDTO[]

  constructor(init: Partial<LandRegistrationPayloadDTO>) {
    this.contact_name = init.contact_name ?? ''
    this.contact_phone = init.contact_phone ?? ''
    this.contact_email = init.contact_email ?? ''
    this.title = init.title ?? ''
    this.description = init.description ?? ''
    this.property_category_id = init.property_category_id ?? ''
    this.price = init.price ?? 0
    this.property_size = init.property_size ?? 0
    this.property_size_unit = init.property_size_unit ?? ''
    this.listing_type = init.listing_type ?? ''
    this.status = init.status ?? ''
    this.project_status = init.project_status
    this.layout_price_min = init.layout_price_min
    this.layout_price_max = init.layout_price_max
    this.layout_area_min_sqft = init.layout_area_min_sqft
    this.layout_area_max_sqft = init.layout_area_max_sqft
    this.plot_total_count = init.plot_total_count
    this.plot_sold_count = init.plot_sold_count
    this.plot_booked_count = init.plot_booked_count
    this.plot_available_count = init.plot_available_count
    this.layout_total_sqft = init.layout_total_sqft
    this.door_number = init.door_number ?? ''
    this.street_name = init.street_name ?? ''
    this.address_line = init.address_line ?? ''
    this.city = init.city ?? ''
    this.district = init.district ?? ''
    this.state = init.state ?? ''
    this.postal_code = init.postal_code ?? ''
    this.country = init.country ?? ''
    this.latitude = init.latitude ?? 0
    this.longitude = init.longitude ?? 0
    this.agent_id = init.agent_id ?? ''
    this.is_published = init.is_published ?? false
    this.features = init.features ?? []
  }

  toObject(): Record<string, any> {
    return {
      contact_name: this.contact_name,
      contact_phone: this.contact_phone,
      contact_email: this.contact_email,
      title: this.title,
      description: this.description,
      property_category_id: this.property_category_id,
      price: this.price,
      property_size: this.property_size,
      property_size_unit: this.property_size_unit,
      listing_type: this.listing_type.toUpperCase(),
      status: 'AVAILABLE',
      project_status: this.project_status,
      layout_price_min: this.layout_price_min === '' ? undefined : this.layout_price_min,
      layout_price_max: this.layout_price_max === '' ? undefined : this.layout_price_max,
      layout_area_min_sqft: this.layout_area_min_sqft === '' ? undefined : this.layout_area_min_sqft,
      layout_area_max_sqft: this.layout_area_max_sqft === '' ? undefined : this.layout_area_max_sqft,
      plot_total_count: this.plot_total_count === '' ? undefined : this.plot_total_count,
      plot_sold_count: this.plot_sold_count === '' ? undefined : this.plot_sold_count,
      plot_booked_count: this.plot_booked_count === '' ? undefined : this.plot_booked_count,
      plot_available_count: this.plot_available_count === '' ? undefined : this.plot_available_count,
      layout_total_sqft: this.layout_total_sqft === '' ? undefined : this.layout_total_sqft,
      door_number: this.door_number,
      street_name: this.street_name,
      address_line: this.address_line,
      city: this.city,
      district: this.district,
      state: this.state,
      postal_code: this.postal_code,
      country: this.country,
      latitude: this.latitude,
      longitude: this.longitude,
      agent_id: this.agent_id,
      is_published: this.is_published,
      features: this.features.map(f => f.toObject()),
    }
  }

  serialize(): string {
    return JSON.stringify(this.toObject())
  }
}

export class AddPropertyMediaViaLink {
  media_type: 'VIDEO' | 'IMAGE'
  url: string
  title: string
  is_primary: boolean

  constructor(init: Partial<AddPropertyMediaViaLink>) {
    this.title = init?.title ?? ''
    this.media_type = init?.media_type ?? 'VIDEO'
    this.url = init?.url ?? ''
    this.is_primary = init?.is_primary ?? false
  }
}

export interface PropertyCategory {
  id: string
  name: string
  icon: string
  description: string
  parent_id: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}
