// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** actions
import {
  createUserAsync,
  deleteMultipleUserAsync,
  deleteUserAsync,
  getAllUsersAsync,
  serviceName,
  updateUserAsync
} from './actions'
import { deleteMultipleUser } from 'src/services/user'

const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: '',
  users: {
    data: [],
    total: 0
  }
}

export const userSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.messageErrorCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messageErrorDelete = ''
    }
  },
  extraReducers: builder => {
    // Get all users
    builder.addCase(getAllUsersAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllUsersAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.users.data = action?.payload?.data?.users || []
      state.users.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllUsersAsync.rejected, (state, action) => {
      state.isLoading = false
      state.users.data = []
      state.users.total = 0
    })

    // Create User
    builder.addCase(createUserAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(createUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action?.payload?.data?._id
      state.isErrorCreateEdit = !action?.payload?.data?._id
      state.messageErrorCreateEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // **  Because we catch the error from the axios in services folder so the error can't go the rejected status  ** //
    // builder.addCase(createRoleAsync.rejected, (state, action: any) => {
    //   state.isLoading = false
    //   state.isSuccessCreateEdit = false
    //   state.isErrorCreateEdit = true
    //   state.messageErrorCreateEdit = action.payload?.data?.message
    //   state.typeError = action.payload?.data?.typeError
    // })

    // Update User
    builder.addCase(updateUserAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action?.payload?.data?._id
      state.isErrorCreateEdit = !action?.payload?.data?._id
      state.messageErrorCreateEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete User
    builder.addCase(deleteUserAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageErrorDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete Multiple User
    builder.addCase(deleteMultipleUserAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMultipleUserAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action?.payload?.data
      state.isErrorMultipleDelete = !action?.payload?.data
      state.messageErrorMultipleDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default userSlice.reducer
export const { resetInitialState } = userSlice.actions
