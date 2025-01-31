// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  cancelOrderProductOfMeAsync,
  createOrderProductAsync,
  getAllOrderProductsByMeAsync,
  serviceName
} from './actions'

const initialState = {
  isLoading: false,
  isSuccessCreate: false,
  isErrorCreate: false,
  messageErrorCreate: '',
  isSuccessCancelMe: false,
  isErrorCancelMe: false,
  messageErrorCancelMe: '',
  typeError: '',
  orderItems: [],
  ordersOfMe: {
    data: [],
    total: 0
  }
}

export const orderProductSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    updateProductToCart: (state, action) => {
      state.orderItems = action?.payload?.orderItems
    },
    resetInitialState: state => {
      state.isSuccessCreate = false
      state.isErrorCreate = false
      state.messageErrorCreate = ''
      state.isSuccessCancelMe = false
      state.isErrorCancelMe = false
      state.messageErrorCancelMe = ''
    }
  },
  extraReducers: builder => {
    // Get all order product by me
    builder.addCase(getAllOrderProductsByMeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllOrderProductsByMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.ordersOfMe.data = action?.payload?.data?.orders || []
      state.ordersOfMe.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderProductsByMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.ordersOfMe.data = []
      state.ordersOfMe.total = 0
    })

    // create product order
    builder.addCase(createOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(createOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreate = !!action?.payload?.data?._id
      state.isErrorCreate = !action?.payload?.data?._id
      state.messageErrorCreate = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // cancel product order of me
    builder.addCase(cancelOrderProductOfMeAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(cancelOrderProductOfMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCancelMe = !!action?.payload?.data?._id
      state.isErrorCancelMe = !action?.payload?.data?._id
      state.messageErrorCancelMe = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default orderProductSlice.reducer
export const { updateProductToCart, resetInitialState } = orderProductSlice.actions
