/** True when the property category is a Layout development type (not Plot). */
export function isLayoutCategory(categoryName?: string | null): boolean {
  if (!categoryName) return false
  const normalized = categoryName.toLowerCase().trim()
  // Exact / word match for "layout" only — Plot uses standard price/size fields
  return normalized === 'layout' || normalized.includes('layout')
}

export function findCategoryName(
  categories: Array<{ id: string; name: string }> | undefined,
  categoryId?: string | null,
): string | undefined {
  if (!categories?.length || !categoryId) return undefined
  return categories.find(c => c.id === categoryId)?.name
}
