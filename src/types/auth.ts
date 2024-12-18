export type TParamsGetRoles = {
  limit: number
  page: number
  search?: string
  order: string
}

export type TParamsCreateRole = {
  name: string
}

export type TParamsEditRole = {
  name: string
  id: string
}

export type TLoginAuth = {
  email: string
  password: string
}

export type TRegisterAuth = {
  email: string
  password: string
}

export type TChangePassword = {
  currentPassword: string
  newPassword: string
}
