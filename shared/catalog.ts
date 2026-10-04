// Catalog logic shared by the Nitro API and the static (GitHub Pages) backend
import type {
  CategoryGroup, Facet, Gender, Product, ProductDetailResponse, ProductListResponse, ProductSize, ProductSummary, SizeType,
} from '../types/types'
import { fail } from './validate'

interface RawProduct {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku: string
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  returnPolicy: string
  reviews: { rating: number; comment: string; date: string; reviewerName: string }[]
  images: string[]
  thumbnail: string
}

// The DummyJSON categories that make sense for a fashion store
export const CATEGORY_META: Record<string, { label: string; gender: Gender; sizeType: SizeType }> = {
  'mens-shirts': { label: 'Shirts', gender: 'men', sizeType: 'apparel' },
  'tops': { label: 'Tops', gender: 'women', sizeType: 'apparel' },
  'womens-dresses': { label: 'Dresses', gender: 'women', sizeType: 'apparel' },
  'mens-shoes': { label: "Men's Shoes", gender: 'men', sizeType: 'shoes' },
  'womens-shoes': { label: "Women's Shoes", gender: 'women', sizeType: 'shoes' },
  'womens-bags': { label: 'Bags', gender: 'women', sizeType: 'one' },
  'sunglasses': { label: 'Sunglasses', gender: 'unisex', sizeType: 'one' },
  'mens-watches': { label: "Men's Watches", gender: 'men', sizeType: 'one' },
  'womens-watches': { label: "Women's Watches", gender: 'women', sizeType: 'one' },
  'womens-jewellery': { label: 'Jewellery', gender: 'women', sizeType: 'one' },
}

export const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2X', '39', '40', '41', '42', '43', '44', '45', 'One Size']

const SIZE_SETS: Record<SizeType, string[]> = {
  apparel: ['XS', 'S', 'M', 'L', 'XL', '2X'],
  shoes: ['39', '40', '41', '42', '43', '44', '45'],
  one: ['One Size'],
}

const round2 = (n: number) => Math.round(n * 100) / 100

// DummyJSON has no size data, so derive a stable per-product size run.
// Some sizes sell out, the same way every time for a given product.
function sizesFor(id: number, type: SizeType, stock: number): ProductSize[] {
  return SIZE_SETS[type].map((label, i) => ({
    label,
    available: stock > 0 && (type === 'one' || (id * 7 + i * 3) % 5 !== 0),
  }))
}

function toProduct(raw: RawProduct): Product {
  const meta = CATEGORY_META[raw.category]!
  const discounted = raw.discountPercentage >= 12
  return {
    id: raw.id,
    title: raw.title,
    brand: raw.brand ?? 'Nuxtwear',
    category: raw.category,
    categoryLabel: meta.label,
    gender: meta.gender,
    price: round2(raw.price),
    compareAtPrice: discounted ? round2(raw.price / (1 - raw.discountPercentage / 100)) : null,
    rating: round2(raw.rating),
    stock: raw.stock,
    inStock: raw.stock > 0 && raw.availabilityStatus !== 'Out of Stock',
    isNew: raw.id % 3 === 0,
    thumbnail: raw.thumbnail,
    images: raw.images,
    sizes: sizesFor(raw.id, meta.sizeType, raw.stock),
    description: raw.description,
    sku: raw.sku,
    tags: raw.tags,
    warrantyInformation: raw.warrantyInformation,
    shippingInformation: raw.shippingInformation,
    returnPolicy: raw.returnPolicy,
    reviews: raw.reviews.map(({ rating, comment, date, reviewerName }) => ({ rating, comment, date, reviewerName })),
  }
}

export function toSummary(p: Product): ProductSummary {
  const { description, sku, tags, warrantyInformation, shippingInformation, returnPolicy, reviews, ...summary } = p
  return summary
}

// The whole fashion catalog is ~50 products, so it is fetched once and filtered in memory
export async function fetchCatalog(baseUrl: string): Promise<Product[]> {
  const lists = await Promise.all(
    Object.keys(CATEGORY_META).map(async (category) => {
      const res = await fetch(`${baseUrl}/products/category/${category}?limit=0`)
      if (!res.ok) fail(502, 'The product catalog is unavailable right now')
      return (await res.json()) as { products: RawProduct[] }
    }),
  )
  return lists.flatMap((l) => l.products).map(toProduct)
}

const SORTS = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'] as const
const list = (v: unknown) => (typeof v === 'string' && v ? v.split(',').filter(Boolean) : [])
const num = (v: unknown) => (v === undefined || v === null || v === '' || Number.isNaN(Number(v)) ? null : Number(v))

export function listProducts(catalog: Product[], query: Record<string, unknown>): ProductListResponse {
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

  const sorted = base.filter(matches)
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

  return {
    products: sorted.slice((page - 1) * limit, page * limit).map(toSummary),
    total: sorted.length,
    page,
    pages: Math.max(Math.ceil(sorted.length / limit), 1),
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
}

export function productDetail(catalog: Product[], id: number): ProductDetailResponse {
  if (!Number.isInteger(id)) fail(400, 'Invalid product id')
  const product = catalog.find((p) => p.id === id)
  if (!product) fail(404, 'Product not found')

  // Same category first, then the rest of the same gender
  const related = [
    ...catalog.filter((p) => p.id !== id && p.category === product.category),
    ...catalog.filter((p) => p.id !== id && p.category !== product.category && p.gender === product.gender),
  ].slice(0, 8)

  return { product, related: related.map(toSummary) }
}

const GROUPS: { gender: Gender; label: string }[] = [
  { gender: 'men', label: 'Men' },
  { gender: 'women', label: 'Women' },
  { gender: 'unisex', label: 'Unisex' },
]

export function categoryGroups(catalog: Product[]): CategoryGroup[] {
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
}
