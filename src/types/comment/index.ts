export type TParamsAddComment = {
  product: string
  user: string
  content: string
}

export type TParamsUpdateComment = {
  id: string
  content: string
}

export type TParamsDeleteMultipleComment = {
  commentIds: string[]
}

export type TParamsGetComments = {
  limit?: number
  page?: number
  search?: string
  order?: string
  isPublic?: boolean
}

export type TParamsCommentItem = {
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
  updatedAt: Date
}
