export interface ExplorePropertyDto {
  district: string | null
  count: number
  minAmount: number
  maxAmount: number
  noOfAgents: number
  propertyCategories: Array<string>
}
