// api endpoints
import axios from 'axios'
import { API_ENDPOINT } from 'src/configs/api'

// axios
import instanceAxios from 'src/helpers/axios'

// types
import {
  TParamsAddReview,
  TParamsDeleteMultipleReview,
  TParamsGetReviews,
  TParamsUpdateReview
} from 'src/types/reviews'

export const addReview = async (data: TParamsAddReview) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const getDetailsReview = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${id}`)

    return res.data
  } catch (err) {
    return err
  }
}

export const updateMyReview = async (data: TParamsUpdateReview) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/me/${id}`, rests)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteMyReview = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/me/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteReview = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteMultipleReview = async (data: TParamsDeleteMultipleReview) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/delete-many`, { data })

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

export const getAllReviews = async (data: { params: TParamsGetReviews }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const updateReview = async (data: TParamsUpdateReview) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_ORDER.REVIEW.INDEX}/${id}`, rests)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}
