// api endpoints
import axios from 'axios'
import { API_ENDPOINT } from 'src/configs/api'

// axios
import instanceAxios from 'src/helpers/axios'

// types
import {
  TParamsCreateOrderProduct,
  TParamsEditOrderProduct,
  TParamsGetOrderProducts,
  TParamsUpdateOrderStatus
} from 'src/types/order-product'

export const getAllOrderProductsByMe = async (data: { params: TParamsGetOrderProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const getDetailsOrderProductsByMe = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me/${id}`)

    return res.data
  } catch (err) {
    return err
  }
}

export const createOrderProduct = async (data: TParamsCreateOrderProduct) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`, data)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const cancelOrderProductOfMe = async (id: string) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/me/cancel/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

// admin cms
export const deleteOrderProduct = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const getDetailsOrderProduct = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const getAllOrderProducts = async (data: { params: TParamsGetOrderProducts }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const updateOrderProduct = async (data: TParamsEditOrderProduct) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/${id}`, rests)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const updateOrderProductStatus = async (data: TParamsUpdateOrderStatus) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}/status/${id}`, rests)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}
