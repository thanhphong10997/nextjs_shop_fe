// api endpoints
import { API_ENDPOINT } from 'src/configs/api'

// axios
import instanceAxios from 'src/helpers/axios'

// types
import {
  TParamsCreateProduct,
  TParamsDeleteMultipleProduct,
  TParamsEditProduct,
  TParamsGetProducts
} from 'src/types/product'

export const getAllProducts = async (data: { params: TParamsGetProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const createProduct = async (data: TParamsCreateProduct) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}`, data)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const updateProduct = async (data: TParamsEditProduct) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/${id}`, rests)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteProduct = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteMultipleProduct = async (data: TParamsDeleteMultipleProduct) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/delete-many`, { data })
    if (res?.data?.status === 'Success') {
      return {
        data: []
      }
    }

    return {
      data: null
    }
  } catch (err: any) {
    return err?.response?.data
  }
}

export const getDetailsProduct = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}
