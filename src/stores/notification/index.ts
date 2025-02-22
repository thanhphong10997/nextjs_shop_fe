// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  deleteNotificationAsync,
  getAllNotificationsAsync,
  markReadAllNotificationAsync,
  markReadNotificationAsync,
  serviceName
} from './actions'

const initialState = {
  typeError: '',
  isLoading: false,
  isSuccessRead: false,
  isErrorRead: false,
  messageRead: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageDelete: '',
  isSuccessReadAll: false,
  isErrorReadAll: false,
  messageReadAll: '',
  notifications: {
    data: [],
    total: 0,
    totalNew: 0
  }
}

export const notificationSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccessRead = false
      state.isErrorRead = false
      state.messageRead = ''
      state.typeError = ''
      state.isSuccessReadAll = false
      state.isErrorReadAll = false
      state.messageReadAll = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messageDelete = ''
    }
  },
  extraReducers: builder => {
    // Get all notifications
    builder.addCase(getAllNotificationsAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllNotificationsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.notifications.data = action?.payload?.data?.notifications || []
      state.notifications.total = action?.payload?.data?.totalCount
      state.notifications.totalNew = action?.payload?.data?.totalNew
    })
    builder.addCase(getAllNotificationsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.notifications.data = []
      state.notifications.total = 0
      state.notifications.totalNew = 0
    })

    // mark read notifications
    builder.addCase(markReadNotificationAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(markReadNotificationAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessRead = !!action?.payload?.data?._id
      state.isErrorRead = !action?.payload?.data?._id
      state.messageRead = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // mark read all notifications
    builder.addCase(markReadAllNotificationAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(markReadAllNotificationAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessReadAll = !!action?.payload?.data?.length
      state.isErrorReadAll = !action?.payload?.data?.length
      state.messageReadAll = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // delete notifications
    builder.addCase(deleteNotificationAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteNotificationAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default notificationSlice.reducer
export const { resetInitialState } = notificationSlice.actions
