// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  cancelOrderProductOfMeAsync,
  createOrderProductAsync,
  deleteOrderProductAsync,
  getAllOrderProductsAsync,
  getAllOrderProductsByMeAsync,
  serviceName,
  updateOrderProductAsync,
  updateOrderProductStatusAsync
} from './actions'

const initialState = {
  isLoading: false,
  isSuccessCreate: false,
  isErrorCreate: false,
  messageCreate: '',
  isSuccessCancelMe: false,
  isErrorCancelMe: false,
  messageCancelMe: '',
  isSuccessEdit: false,
  isErrorEdit: false,
  messageEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageDelete: '',
  typeError: '',
  orderItems: [],
  orderProducts: {
    data: [],
    total: 0
  },
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
      state.isLoading = false
      state.typeError = ''
      state.isSuccessCreate = false
      state.isErrorCreate = false
      state.messageCreate = ''
      state.isSuccessEdit = false
      state.isErrorEdit = false
      state.messageEdit = ''
      state.isSuccessCancelMe = false
      state.isErrorCancelMe = false
      state.messageCancelMe = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messageDelete = ''
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
      state.messageCreate = action?.payload?.message
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
      state.messageCancelMe = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // get all order products
    builder.addCase(getAllOrderProductsAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllOrderProductsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.orderProducts.data = action?.payload?.data?.orders || []
      state.orderProducts.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllOrderProductsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.orderProducts.data = []
      state.orderProducts.total = 0
    })

    // Update order product
    builder.addCase(updateOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessEdit = !!action?.payload?.data?._id
      state.isErrorEdit = !action?.payload?.data?._id
      state.messageEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Update order product status
    builder.addCase(updateOrderProductStatusAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateOrderProductStatusAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessEdit = !!action?.payload?.data?._id
      state.isErrorEdit = !action?.payload?.data?._id
      state.messageEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete order product
    builder.addCase(deleteOrderProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteOrderProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default orderProductSlice.reducer
export const { updateProductToCart, resetInitialState } = orderProductSlice.actions
