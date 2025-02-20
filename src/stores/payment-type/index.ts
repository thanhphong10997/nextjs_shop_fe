// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  createPaymentTypeAsync,
  deleteMultiplePaymentTypeAsync,
  deletePaymentTypeAsync,
  getAllPaymentTypesAsync,
  serviceName,
  updatePaymentTypeAsync
} from './actions'

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  typeError: '',
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageMultipleDelete: '',
  paymentTypes: {
    data: [],
    total: 0
  }
}

export const paymentTypeSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.typeError = ''
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = false
      state.messageCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messageDelete = ''
    }
  },
  extraReducers: builder => {
    // Get all payment types
    builder.addCase(getAllPaymentTypesAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllPaymentTypesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.paymentTypes.data = action?.payload?.data?.paymentTypes || []
      state.paymentTypes.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllPaymentTypesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.paymentTypes.data = []
      state.paymentTypes.total = 0
    })

    // Create payment type
    builder.addCase(createPaymentTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(createPaymentTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action?.payload?.data?._id
      state.isErrorCreateEdit = !action?.payload?.data?._id
      state.messageCreateEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // **  Because we catch the error from the axios in services folder so the error can't go the rejected status  ** //
    // builder.addCase(createRoleAsync.rejected, (state, action: any) => {
    //   state.isLoading = false
    //   state.isSuccessCreateEdit = false
    //   state.isErrorCreateEdit = true
    //   state.messageCreateEdit = action.payload?.data?.message
    //   state.typeError = action.payload?.data?.typeError
    // })

    // Update payment type
    builder.addCase(updatePaymentTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updatePaymentTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action?.payload?.data?._id
      state.isErrorCreateEdit = !action?.payload?.data?._id
      state.messageCreateEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete payment type
    builder.addCase(deletePaymentTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deletePaymentTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete Multiple payment type
    builder.addCase(deleteMultiplePaymentTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMultiplePaymentTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action?.payload?.data
      state.isErrorMultipleDelete = !action?.payload?.data
      state.messageMultipleDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default paymentTypeSlice.reducer
export const { resetInitialState } = paymentTypeSlice.actions
