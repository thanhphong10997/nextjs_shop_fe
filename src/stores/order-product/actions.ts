import { createAsyncThunk } from '@reduxjs/toolkit'

// services
import { cancelOrderProductOfMe, createOrderProduct, getAllOrderProductsByMe } from 'src/services/order-product'

// types
import { TParamsCreateOrderProduct, TParamsGetOrderProducts } from 'src/types/order-product'

export const serviceName = 'order-product'

export const createOrderProductAsync = createAsyncThunk(
  `${serviceName}/create`,
  async (data: TParamsCreateOrderProduct) => {
    const response = await createOrderProduct(data)

    return response
  }
)

export const getAllOrderProductsByMeAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetOrderProducts }) => {
    const response = await getAllOrderProductsByMe(data)

    return response
  }
)

export const cancelOrderProductOfMeAsync = createAsyncThunk(`${serviceName}/cancel-order-of-me`, async (id: string) => {
  const response = await cancelOrderProductOfMe(id)

  return response
})
