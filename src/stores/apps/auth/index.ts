// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { ChangePasswordMeAsync, registerAuthAsync, updateAuthMeAsync } from './actions'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

const initialState = {
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
  messageChangePasswordMe: ''
}

export const authSlice = createSlice({
  name: 'auth',
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

    // Auth Me
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
    })
    builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = false
      state.messageUpdateMe = ''
      state.typeError = ''
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
