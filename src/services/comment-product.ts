// api endpoints
import { API_ENDPOINT } from 'src/configs/api'

// axios
import instanceAxios from 'src/helpers/axios'

// types
import {
  TParamsAddComment,
  TParamsDeleteMultipleComment,
  TParamsGetComments,
  TParamsReplyComment,
  TParamsUpdateComment
} from 'src/types/comment'

export const addComment = async (data: TParamsAddComment) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const replyComment = async (data: TParamsReplyComment) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}/reply`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const getDetailsComment = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}/${id}`)

    return res.data
  } catch (err) {
    return err
  }
}

export const updateMyComment = async (data: TParamsUpdateComment) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}/me/${id}`, rests)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteMyComment = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}/me/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteComment = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteMultipleComment = async (data: TParamsDeleteMultipleComment) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}/delete-many`, { data })

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

export const getAllComments = async (data: { params: TParamsGetComments }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const getAllPublicComments = async (data: { params: TParamsGetComments }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}/public`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const updateComment = async (data: TParamsUpdateComment) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.MANAGE_PRODUCT.COMMENT.INDEX}/${id}`, rests)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}
