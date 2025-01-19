export type TParamsGetProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateProduct = {
  name: string
  image: string
  type: string
  location: string
  discount: number
  price: number
  description: string
  slug: string
  countInStock: number
  discountEndDate: Date | null
  discountStartDate: Date | null
  status: number
}

export type TParamsEditProduct = {
  id: string
  name: string
  image: string
  type: string
  location: string
  discount: number
  price: number
  description: string
  slug: string
  countInStock: number
  discountEndDate: Date | null
  discountStartDate: Date | null
  status: number
}

export type TParamsDeleteProduct = {
  id: string
}

export type TParamsDeleteMultipleProduct = {
  productIds: string[]
}

export type TProduct = {
  _id: string
  averageRating: number
  countInStock: number
  totalReview: number
  createdAt: Date | null
  image: string
  sold: number
  price: number
  discount: number
  location: {
    name: string
    _id: string
  }
  name: string
  slug: string
  totalLike: number
  discountEndDate: Date | null
  discountStartDate: Date | null
}

export type TParamGetRelatedProduct = {
  limit?: number
  page?: number
  search?: string
  order?: string
  slug: string
}
