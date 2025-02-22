import { createAsyncThunk } from '@reduxjs/toolkit'

// services

import {
  deleteNotification,
  getAllNotifications,
  markReadAllNotification,
  markReadNotification
} from 'src/services/notification'

// types
import { TParamsGetNotifications } from 'src/types/notification'

export const serviceName = 'notification'

export const getAllNotificationsAsync = createAsyncThunk(
  `${serviceName}/get-all`,
  async (data: { params: TParamsGetNotifications }) => {
    const response = await getAllNotifications(data)

    return response
  }
)

export const deleteNotificationAsync = createAsyncThunk(`${serviceName}/delete`, async (id: string) => {
  const response = await deleteNotification(id)

  return response
})

export const markReadNotificationAsync = createAsyncThunk(`${serviceName}/read`, async (id: string) => {
  const response = await markReadNotification(id)

  return response
})

export const markReadAllNotificationAsync = createAsyncThunk(`${serviceName}/read-all`, async () => {
  const response = await markReadAllNotification()

  if (response.status === 'Success') {
    return {
      ...response,
      data: [1]
    }
  }

  return response
})
