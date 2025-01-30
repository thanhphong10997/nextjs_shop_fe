export type TParamsGetOrderProducts = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TItemOrderProduct = {
  name: string
  amount: number
  image: string
  price: number
  discount: number
  product: string
  slug: string
}

export type TParamsCreateOrderProduct = {
  orderItems: TItemOrderProduct[]
  address?: string
  city: string
  phone: string
  fullName: string
  paymentMethod: string
  deliveryMethod: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  user: string
}

export type TItemOrderProductMe = {
  _id: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    phone: string
  }
  orderItems: TItemOrderProduct[]
  paymentMethod: {
    _id: string
    name: string
    type: string
  }
  deliveryMethod: {
    _id: string
    name: string
    price: number
  }
  totalPrice: number
  user: {
    _id: string
    firstName: string
    lastName: string
    middleName: string
  }
  isPaid: number
  isDelivered: number
  status: number
}
