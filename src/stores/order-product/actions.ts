import { createAsyncThunk } from '@reduxjs/toolkit'

// services
import {
  cancelOrderProductOfMe,
  createOrderProduct,
  deleteOrderProduct,
  getAllOrderProducts,
  getAllOrderProductsByMe,
  updateOrderProduct,
  updateOrderProductStatus
} from 'src/services/order-product'

// types
import {
  TParamsCreateOrderProduct,
  TParamsEditOrderProduct,
  TParamsGetOrderProducts,
  TParamsUpdateOrderStatus
} from 'src/types/order-product'

export const serviceName = 'order-product'

// order-products by me
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

// order-products

export const getAllOrderProductsAsync = createAsyncThunk(
  `${serviceName}/get-all-order-product`,
  async (data: { params: TParamsGetOrderProducts }) => {
    const response = await getAllOrderProducts(data)

    return response
  }
)

export const updateOrderProductAsync = createAsyncThunk(
  `${serviceName}/update-order-product`,
  async (data: TParamsEditOrderProduct) => {
    const response = await updateOrderProduct(data)

    return response
  }
)

export const deleteOrderProductAsync = createAsyncThunk(`${serviceName}/delete-order-product`, async (id: string) => {
  const response = await deleteOrderProduct(id)

  return response
})

export const updateOrderProductStatusAsync = createAsyncThunk(
  `${serviceName}/update-order-product-status`,
  async (data: TParamsUpdateOrderStatus) => {
    const response = await updateOrderProductStatus(data)

    return response
  }
)
