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
  product: {
    _id: string
    slug: string
    countInStock?: number
  }
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

// export interface TParamsEditOrderProduct extends TParamsCreateOrderProduct {
//   id: string
// }

export type TParamsEditOrderProduct = {
  id: string
  shippingAddress: {
    fullName: string
    phone: string
    city: string
    address: string
  }
  isPaid: boolean
  isDelivered: boolean
}

export type TParamsUpdateOrderStatus = {
  id: string
  isDelivered?: number
  isPaid?: number
  status?: number
}

export type TItemOrderProductMe = {
  _id: string
  shippingAddress: {
    fullName: string
    address: string
    city: {
      _id: string
      name: string
    }
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
  shippingPrice: number
  itemsPrice: number
  user: {
    _id: string
    firstName: string
    lastName: string
    middleName: string
  }
  isPaid: number
  isDelivered: number
  status: number
  deliveryAt: Date
  paidAt: Date
}
