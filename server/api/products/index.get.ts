import type { Facet, Product, ProductListResponse } from '~~/types/types'

const SORTS = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'] as const
const list = (v: unknown) => (typeof v === 'string' && v ? v.split(',').filter(Boolean) : [])
const num = (v: unknown) => (v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Number(v))

export default defineEventHandler(async (event): Promise<ProductListResponse> => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q.trim().toLowerCase() : ''
  const gender = typeof query.gender === 'string' ? query.gender : ''
  const categories = list(query.category)
  const sizes = list(query.size)
  const availability = typeof query.availability === 'string' ? query.availability : ''
  const minPrice = num(query.minPrice)
  const maxPrice = num(query.maxPrice)
  const minRating = num(query.rating)
  const onlyNew = query.new === 'true'
  const onlySale = query.sale === 'true'
  const exclude = num(query.exclude)
  const sort = SORTS.includes(query.sort as never) ? (query.sort as (typeof SORTS)[number]) : 'featured'
  const limit = Math.min(Math.max(num(query.limit) ?? 12, 1), 60)
  const page = Math.max(num(query.page) ?? 1, 1)

  const catalog = await getCatalog()

  // Search + gender scope define the facet base; the sidebar filters narrow from there
  const base = catalog.filter((p) => {
    if (gender && p.gender !== gender && !(gender !== 'unisex' && p.gender === 'unisex')) return false
    if (exclude !== null && p.id === exclude) return false
    if (!q) return true
    return [p.title, p.brand, p.categoryLabel, p.category, ...p.tags].some((s) => s.toLowerCase().includes(q))
  })

  const matches = (p: Product) =>
    (!categories.length || categories.includes(p.category)) &&
    (!sizes.length || p.sizes.some((s) => s.available && sizes.includes(s.label))) &&
    (availability !== 'in' || p.inStock) &&
    (availability !== 'out' || !p.inStock) &&
    (minPrice === null || p.price >= minPrice) &&
    (maxPrice === null || p.price <= maxPrice) &&
    (minRating === null || p.rating >= minRating) &&
    (!onlyNew || p.isNew) &&
    (!onlySale || p.compareAtPrice !== null)

  const filtered = base.filter(matches)

  const sorted = [...filtered]
  switch (sort) {
    case 'newest': sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id); break
    case 'price-asc': sorted.sort((a, b) => a.price - b.price); break
    case 'price-desc': sorted.sort((a, b) => b.price - a.price); break
    case 'rating': sorted.sort((a, b) => b.rating - a.rating); break
    // "featured" interleaves categories so the first page isn't all one product type
    default: sorted.sort((a, b) => (a.id % 5) - (b.id % 5) || a.id - b.id)
  }

  const count = (values: string[], labels: Record<string, string> = {}): Facet[] => {
    const map = new Map<string, number>()
    values.forEach((v) => map.set(v, (map.get(v) ?? 0) + 1))
    return [...map].map(([value, c]) => ({ value, label: labels[value] ?? value, count: c }))
  }

  const prices = base.map((p) => p.price)
  const pages = Math.max(Math.ceil(sorted.length / limit), 1)

  return {
    products: sorted.slice((page - 1) * limit, page * limit).map(toSummary),
    total: sorted.length,
    page,
    pages,
    facets: {
      categories: count(
        base.map((p) => p.category),
        Object.fromEntries(Object.entries(CATEGORY_META).map(([k, m]) => [k, m.label])),
      ).sort((a, b) => a.label.localeCompare(b.label)),
      sizes: count(base.flatMap((p) => p.sizes.filter((s) => s.available).map((s) => s.label)))
        .sort((a, b) => SIZE_ORDER.indexOf(a.value) - SIZE_ORDER.indexOf(b.value)),
      availability: {
        inStock: base.filter((p) => p.inStock).length,
        outOfStock: base.filter((p) => !p.inStock).length,
      },
      price: {
        min: prices.length ? Math.floor(Math.min(...prices)) : 0,
        max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
      },
    },
  }
})
