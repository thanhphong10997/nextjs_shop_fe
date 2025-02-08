// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import {
  ChangePasswordMeAsync,
  registerAuthAsync,
  registerAuthGoogleAsync,
  serviceName,
  updateAuthMeAsync
} from './actions'

// Type
import { UserDataType } from 'src/contexts/types'

type TInitialState = {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  message: string
  typeError: string
  isSuccessUpdateMe: boolean
  isErrorUpdateMe: boolean
  messageUpdateMe: string
  isSuccessChangePasswordMe: boolean
  isErrorChangePasswordMe: boolean
  messageChangePasswordMe: string
  userData: UserDataType | null
}

const initialState: TInitialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessUpdateMe: false,
  isErrorUpdateMe: true,
  messageUpdateMe: '',
  isSuccessChangePasswordMe: false,
  isErrorChangePasswordMe: true,
  messageChangePasswordMe: '',
  userData: null
}

export const authSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = true
      state.messageUpdateMe = ''
      state.isSuccessChangePasswordMe = false
      state.isErrorChangePasswordMe = true
      state.messageChangePasswordMe = ''
    }
  },
  extraReducers: builder => {
    // Auth Register
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action?.payload?.data?.email
      state.isError = !action?.payload?.data?.email
      state.message = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
    builder.addCase(registerAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
    })

    // Auth Google Register
    builder.addCase(registerAuthGoogleAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(registerAuthGoogleAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action?.payload?.data?.email
      state.isError = !action?.payload?.data?.email
      state.message = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
    builder.addCase(registerAuthGoogleAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
    })

    // update auth Me
    builder.addCase(updateAuthMeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessUpdateMe = !!action?.payload?.data?.email
      state.isErrorUpdateMe = !action?.payload?.data?.email
      state.messageUpdateMe = action?.payload?.message
      state.typeError = action?.payload?.typeError
      state.userData = action?.payload?.data
    })
    builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = false
      state.messageUpdateMe = ''
      state.typeError = ''
      state.userData = null
    })

    // change password me
    builder.addCase(ChangePasswordMeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(ChangePasswordMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessChangePasswordMe = !!action?.payload?.data
      state.isErrorChangePasswordMe = !action?.payload?.data
      state.messageChangePasswordMe = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
    builder.addCase(ChangePasswordMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessChangePasswordMe = false
      state.isErrorChangePasswordMe = false
      state.messageChangePasswordMe = ''
      state.typeError = ''
    })
  }
})

export default authSlice.reducer
export const { resetInitialState } = authSlice.actions
