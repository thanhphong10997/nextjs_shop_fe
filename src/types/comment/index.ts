export type TParamsAddComment = {
  product: string
  user: string
  content: string
}

export type TParamsReplyComment = {
  product: string
  user: string
  content: string
  parent: string
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
  productId?: string
  isPublic?: boolean
}

export type TParamsCommentItem = {
  _id: string
  user: {
    id: string
    firstName: string
    middleName: string
    lastName: string
    avatar: string
  }
  product: {
    id: string
    name: string
  }
  parent?: string
  content: string
  createdAt: Date
}

export interface TCommentItemProduct extends TParamsCommentItem {
  replies?: TParamsCommentItem[]
}
