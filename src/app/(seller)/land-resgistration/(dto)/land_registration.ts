// types/property-listing.ts

export interface FeatureOptionGroup {
  feature_category_id: string;
  feature_group_id: string;
  option_ids: string[];
}

export class LandRegistrationDTO {
  title: string;
  description: string;
  property_category_id: string;
  price: number;
  price_unit: string;
  listing_type: string;
  status: string;
  door_number: string;
  street_name: string;
  address_line: string;
  city: string;
  district: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  agent_id: string;
  is_published: boolean;
  features: FeatureOptionGroup[];

  constructor(init: {
    title: string;
    description: string;
    property_category_id: string;
    price: number;
    price_unit: string;
    listing_type: string;
    status: string;
    door_number: string;
    street_name: string;
    address_line: string;
    city: string;
    district: string;
    state: string;
    postal_code: string;
    country: string;
    latitude: number;
    longitude: number;
    agent_id: string;
    is_published: boolean;
    features: FeatureOptionGroup[];
  }) {
    this.title                = init.title;
    this.description          = init.description;
    this.property_category_id = init.property_category_id;
    this.price                = init.price;
    this.price_unit           = init.price_unit;
    this.listing_type         = init.listing_type;
    this.status               = init.status;
    this.door_number          = init.door_number;
    this.street_name          = init.street_name;
    this.address_line         = init.address_line;
    this.city                 = init.city;
    this.district             = init.district;
    this.state                = init.state;
    this.postal_code          = init.postal_code;
    this.country              = init.country;
    this.latitude             = init.latitude;
    this.longitude            = init.longitude;
    this.agent_id             = init.agent_id;
    this.is_published         = init.is_published;
    this.features             = init.features;
  }
}
