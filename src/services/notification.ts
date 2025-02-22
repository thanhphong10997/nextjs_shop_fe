import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

import { TParamsGetNotifications } from 'src/types/notification'

export const getAllNotifications = async (data: { params: TParamsGetNotifications }) => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.NOTIFICATION.INDEX}`, data)

    return res.data
  } catch (err) {
    return err
  }
}

export const markReadNotification = async (id: string) => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.NOTIFICATION.INDEX}/${id}/read`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const markReadAllNotification = async () => {
  try {
    const res = await instanceAxios.post(`${API_ENDPOINT.NOTIFICATION.INDEX}/all/read`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}

export const deleteNotification = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${API_ENDPOINT.NOTIFICATION.INDEX}/${id}`)

    return res.data
  } catch (err: any) {
    return err?.response?.data
  }
}
