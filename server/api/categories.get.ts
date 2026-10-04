import type { CategoryGroup, Gender } from '~~/types/types'

const GROUPS: { gender: Gender; label: string }[] = [
  { gender: 'men', label: 'Men' },
  { gender: 'women', label: 'Women' },
  { gender: 'unisex', label: 'Unisex' },
]

export default defineEventHandler(async (): Promise<CategoryGroup[]> => {
  const catalog = await getCatalog()

  return GROUPS.map(({ gender, label }) => ({
    gender,
    label,
    categories: Object.entries(CATEGORY_META)
      .filter(([, meta]) => meta.gender === gender)
      .map(([slug, meta]) => {
        const items = catalog.filter((p) => p.category === slug)
        return { slug, label: meta.label, count: items.length, image: items[0]?.thumbnail ?? '' }
      })
      .filter((c) => c.count > 0),
  }))
})
