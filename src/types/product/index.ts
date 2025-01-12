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
