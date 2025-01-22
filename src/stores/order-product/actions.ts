import { createAsyncThunk } from '@reduxjs/toolkit'

// services
import { createOrderProduct } from 'src/services/order-product'

// types
import { TParamsCreateOrderProduct } from 'src/types/order-product'

export const serviceName = 'order-product'

export const createOrderProductAsync = createAsyncThunk(
  `${serviceName}/create`,
  async (data: TParamsCreateOrderProduct) => {
    const response = await createOrderProduct(data)

    return response
  }
)
