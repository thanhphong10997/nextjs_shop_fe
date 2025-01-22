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
