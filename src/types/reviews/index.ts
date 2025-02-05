export type TParamsAddReview = {
  product: string
  user: string
  content: string
  star: number
}

export type TParamsUpdateReview = {
  id: string
  content: string
  star: number
}

export type TParamsDeleteMultipleReview = {
  reviewIds: string[]
}

export type TParamsGetReviews = {
  limit?: number
  page?: number
  search?: string
  order?: string
  isPublic?: boolean
}

export type TParamsReviewItem = {
  _id: string
  user: {
    _id: string
    firstName: string
    middleName: string
    lastName: string
    avatar: string
  }
  product: {
    id: string
    name: string
  }
  content: string
  star: number
  updatedAt: Date
}
