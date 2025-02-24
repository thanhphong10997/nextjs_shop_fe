// api endpoints
import axios from 'axios'
import { API_ENDPOINT } from 'src/configs/api'

// axios
import instanceAxios from 'src/helpers/axios'

// types
import {
  TParamGetRelatedProduct,
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

export const getAllProductsPublic = async (data: { params: TParamsGetProducts }) => {
  try {
    const res = await axios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/public`, data)

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

    // If API did not return the data, we need to return the data by ourselves based on the status
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

export const getDetailsProductPublic = async (id: string) => {
  try {
    const res = await axios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/public/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const getDetailsProductPublicBySlug = async (slug: string, isViewed?: boolean) => {
  try {
    const data = { params: { isPublic: true, isViewed } }
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/public/slug/${slug}`, data)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const getListRelatedProductBySlug = async (data: { params: TParamGetRelatedProduct }) => {
  try {
    const res = await axios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/related`, data)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const likeProduct = async (data: { productId: string }) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/like`, data)

    if (res?.data?.status === 'Success') {
      return {
        data: { _id: 1 }
      }
    }

    return {
      data: null
    }
  } catch (err: any) {
    return err?.response?.data
  }
}

export const unLikeProduct = async (data: { productId: string }) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/unlike`, data)

    if (res?.data?.status === 'Success') {
      return {
        data: { _id: 1 }
      }
    }

    return {
      data: null
    }
  } catch (err: any) {
    return err?.response?.data
  }
}

export const getAllProductsLiked = async (data: { params: TParamsGetProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/liked/me`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const getAllProductsViewed = async (data: { params: TParamsGetProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.PRODUCT.INDEX}/viewed/me`, data)

    return res.data
  } catch (err) {
    return err
  }
}
