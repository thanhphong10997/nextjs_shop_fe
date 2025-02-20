// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  createDeliveryTypeAsync,
  deleteMultipleDeliveryTypeAsync,
  deleteDeliveryTypeAsync,
  getAllDeliveryTypesAsync,
  serviceName,
  updateDeliveryTypeAsync
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
  deliveryTypes: {
    data: [],
    total: 0
  }
}

export const deliveryTypeSlice = createSlice({
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
    // Get all delivery types
    builder.addCase(getAllDeliveryTypesAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllDeliveryTypesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.deliveryTypes.data = action?.payload?.data?.deliveryTypes || []
      state.deliveryTypes.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllDeliveryTypesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.deliveryTypes.data = []
      state.deliveryTypes.total = 0
    })

    // Create Delivery type
    builder.addCase(createDeliveryTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(createDeliveryTypeAsync.fulfilled, (state, action) => {
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

    // Update Delivery type
    builder.addCase(updateDeliveryTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateDeliveryTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action?.payload?.data?._id
      state.isErrorCreateEdit = !action?.payload?.data?._id
      state.messageCreateEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete Delivery type
    builder.addCase(deleteDeliveryTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteDeliveryTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete Multiple Delivery type
    builder.addCase(deleteMultipleDeliveryTypeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMultipleDeliveryTypeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action?.payload?.data
      state.isErrorMultipleDelete = !action?.payload?.data
      state.messageMultipleDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default deliveryTypeSlice.reducer
export const { resetInitialState } = deliveryTypeSlice.actions
