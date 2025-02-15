// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import {
  ChangePasswordMeAsync,
  forgotPasswordAuthAsync,
  registerAuthAsync,
  registerAuthFacebookAsync,
  registerAuthGoogleAsync,
  resetPasswordAuthAsync,
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
  isSuccessForgotPassword: boolean
  isErrorForgotPassword: boolean
  messageForgotPassword: string
  isSuccessResetPassword: boolean
  isErrorResetPassword: boolean
  messageResetPassword: string
  userData: UserDataType | null
}

const initialState: TInitialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  typeError: '',
  isSuccessUpdateMe: true,
  isErrorUpdateMe: false,
  messageUpdateMe: '',
  isSuccessChangePasswordMe: true,
  isErrorChangePasswordMe: false,
  messageChangePasswordMe: '',
  isSuccessForgotPassword: true,
  isErrorForgotPassword: false,
  messageForgotPassword: '',
  isSuccessResetPassword: true,
  isErrorResetPassword: false,
  messageResetPassword: '',
  userData: null
}

export const authSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.typeError = ''
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = true
      state.messageUpdateMe = ''
      state.isSuccessChangePasswordMe = false
      state.isErrorChangePasswordMe = true
      state.messageChangePasswordMe = ''
      state.isSuccessChangePasswordMe = false
      state.isErrorChangePasswordMe = true
      state.messageChangePasswordMe = ''
      state.isSuccessForgotPassword = false
      state.isErrorForgotPassword = true
      state.messageForgotPassword = ''
      state.isSuccessResetPassword = false
      state.isErrorResetPassword = true
      state.messageResetPassword = ''
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

    // Auth Facebook Register
    builder.addCase(registerAuthFacebookAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(registerAuthFacebookAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action?.payload?.data?.email
      state.isError = !action?.payload?.data?.email
      state.message = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
    builder.addCase(registerAuthFacebookAsync.rejected, (state, action) => {
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

    // Forgot password auth
    builder.addCase(forgotPasswordAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(forgotPasswordAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessForgotPassword = !!action?.payload?.data?.email
      state.isErrorForgotPassword = !action?.payload?.data?.email
      state.messageForgotPassword = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
    builder.addCase(forgotPasswordAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessForgotPassword = false
      state.isErrorForgotPassword = true
      state.messageForgotPassword = ''
      state.typeError = ''
    })

    // Reset password auth
    builder.addCase(resetPasswordAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(resetPasswordAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessResetPassword = !!action?.payload?.data?.email
      state.isErrorResetPassword = !action?.payload?.data?.email
      state.messageResetPassword = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
    builder.addCase(resetPasswordAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessResetPassword = false
      state.isErrorResetPassword = true
      state.messageResetPassword = ''
      state.typeError = ''
    })
  }
})

export default authSlice.reducer
export const { resetInitialState } = authSlice.actions
