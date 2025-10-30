interface Stat {
  value: string
  label: string
}

interface Property {
  id: number
  title: string
  price: string
  location: string
  image: string
}

interface EnquiryFormValues {
  name: string
  email: string
  phone: string
  message: string
}

export type { Stat, Property, EnquiryFormValues }