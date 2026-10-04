// types/types.ts — shared between the Nuxt app and the Nitro server

export type Gender = 'men' | 'women' | 'unisex'
export type SizeType = 'apparel' | 'shoes' | 'one'

export interface ProductSize {
  label: string
  available: boolean
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
}

export interface ProductSummary {
  id: number
  title: string
  brand: string
  category: string
  categoryLabel: string
  gender: Gender
  price: number
  compareAtPrice: number | null
  rating: number
  stock: number
  inStock: boolean
  isNew: boolean
  thumbnail: string
  images: string[]
  sizes: ProductSize[]
}

export interface Product extends ProductSummary {
  description: string
  sku: string
  tags: string[]
  warrantyInformation: string
  shippingInformation: string
  returnPolicy: string
  reviews: ProductReview[]
}

export interface Facet {
  value: string
  label: string
  count: number
}

export interface ProductListResponse {
  products: ProductSummary[]
  total: number
  page: number
  pages: number
  facets: {
    categories: Facet[]
    sizes: Facet[]
    availability: { inStock: number; outOfStock: number }
    price: { min: number; max: number }
  }
}

export interface ProductDetailResponse {
  product: Product
  related: ProductSummary[]
}

export interface CategoryGroup {
  gender: Gender
  label: string
  categories: { slug: string; label: string; count: number; image: string }[]
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  username?: string
  image?: string
  provider: 'local' | 'dummyjson'
}

export interface CartLine {
  productId: number
  title: string
  thumbnail: string
  categoryLabel: string
  price: number
  size: string
  quantity: number
  stock: number
}

export type ShippingMethod = 'standard' | 'express'
export type PaymentMethod = 'card' | 'cod'

export interface Address {
  firstName: string
  lastName: string
  country: string
  region: string
  address: string
  city: string
  postalCode: string
}

export interface OrderInput {
  items: { productId: number; size: string; quantity: number }[]
  contact: { email: string; phone: string }
  shippingAddress: Address
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
}

export interface OrderLine {
  productId: number
  title: string
  thumbnail: string
  size: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface Order {
  id: string
  userId: string | null
  status: 'confirmed' | 'shipped' | 'delivered'
  createdAt: string
  items: OrderLine[]
  contact: { email: string; phone: string }
  shippingAddress: Address
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
  subtotal: number
  shipping: number
  total: number
}
