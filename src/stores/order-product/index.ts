// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import { createOrderProductAsync, serviceName } from './actions'

const initialState = {
  isLoading: false,
  isSuccessCreate: false,
  isErrorCreate: false,
  messageErrorCreate: '',
  typeError: '',
  orderItems: []
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
    }
  },
  extraReducers: builder => {
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
  }
})

export default orderProductSlice.reducer
export const { updateProductToCart, resetInitialState } = orderProductSlice.actions
