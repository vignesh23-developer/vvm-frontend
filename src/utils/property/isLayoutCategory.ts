/** True when the property category is a layout/plot development type. */
export function isLayoutCategory(categoryName?: string | null): boolean {
  if (!categoryName) return false
  const normalized = categoryName.toLowerCase().trim()
  return normalized.includes('layout') || normalized.includes('plot')
}

export function findCategoryName(
  categories: Array<{ id: string; name: string }> | undefined,
  categoryId?: string | null,
): string | undefined {
  if (!categories?.length || !categoryId) return undefined
  return categories.find(c => c.id === categoryId)?.name
}
