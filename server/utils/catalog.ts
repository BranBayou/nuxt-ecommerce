import type { Gender, Product, ProductSize, ProductSummary, SizeType } from '~~/types/types'

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

// The whole fashion catalog is ~50 products, so it is fetched once and filtered in memory.
export const getCatalog = defineCachedFunction(
  async (): Promise<Product[]> => {
    const { dummyjsonBase } = useRuntimeConfig()
    const lists = await Promise.all(
      Object.keys(CATEGORY_META).map((category) =>
        $fetch<{ products: RawProduct[] }>(`${dummyjsonBase}/products/category/${category}`, {
          query: { limit: 0 },
          retry: 2,
        }),
      ),
    )
    return lists.flatMap((l) => l.products).map(toProduct)
  },
  { name: 'catalog', getKey: () => 'v1', maxAge: 60 * 60, swr: true },
)

export async function findProduct(id: number) {
  const catalog = await getCatalog()
  return catalog.find((p) => p.id === id) ?? null
}
