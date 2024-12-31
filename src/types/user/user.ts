export type TParamsGetUsers = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateUser = {
  firstName?: string
  middleName?: string
  lastName?: string
  email: string
  password: string
  role: string
  phoneNumber: string
  address?: string
  status?: number
  city?: string
  avatar?: string
}

export type TParamsEditUser = {
  id: string
  firstName?: string
  middleName?: string
  lastName?: string
  email: string
  password?: string
  role: string
  phoneNumber: string
  address?: string
  status?: number
  city?: string
  avatar?: string
}

export type TParamsDeleteUser = {
  name: string
  id: string
}

export type TParamsDeleteMultipleUser = {
  userIds: string[]
}
