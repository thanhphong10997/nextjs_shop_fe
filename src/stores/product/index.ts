// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  createProductAsync,
  deleteMultipleProductAsync,
  deleteProductAsync,
  getAllProductsAsync,
  getAllProductsLikedAsync,
  getAllProductsViewedAsync,
  likeProductAsync,
  serviceName,
  unLikeProductAsync,
  updateProductAsync
} from './actions'

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
  isSuccessLike: false,
  isErrorLike: false,
  messageErrorLike: '',
  isSuccessUnLike: false,
  isErrorUnLike: false,
  messageErrorUnLike: '',
  products: {
    data: [],
    total: 0
  },
  viewedProducts: {
    data: [],
    total: 0
  },
  likedProducts: {
    data: [],
    total: 0
  }
}

export const productSlice = createSlice({
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
      state.isSuccessLike = false
      state.isErrorLike = false
      state.messageErrorLike = ''
      state.isSuccessUnLike = false
      state.isErrorUnLike = false
      state.messageErrorUnLike = ''
    }
  },
  extraReducers: builder => {
    // Get all product
    builder.addCase(getAllProductsAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllProductsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.products.data = action?.payload?.data?.products || []
      state.products.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllProductsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.products.data = []
      state.products.total = 0
    })

    // Create Product
    builder.addCase(createProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(createProductAsync.fulfilled, (state, action) => {
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

    // Update Product
    builder.addCase(updateProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action?.payload?.data?._id
      state.isErrorCreateEdit = !action?.payload?.data?._id
      state.messageErrorCreateEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete Product
    builder.addCase(deleteProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageErrorDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete Multiple Product
    builder.addCase(deleteMultipleProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMultipleProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action?.payload?.data
      state.isErrorMultipleDelete = !action?.payload?.data
      state.messageErrorMultipleDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Like
    builder.addCase(likeProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(likeProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessLike = !!action?.payload?.data?._id
      state.isErrorLike = !action?.payload?.data?._id
      state.messageErrorLike = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Unlike
    builder.addCase(unLikeProductAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(unLikeProductAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessUnLike = !!action?.payload?.data?._id
      state.isErrorUnLike = !action?.payload?.data?._id
      state.messageErrorUnLike = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // get all viewed products
    builder.addCase(getAllProductsViewedAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllProductsViewedAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.viewedProducts.data = action?.payload?.data?.products || []
      state.viewedProducts.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllProductsViewedAsync.rejected, (state, action) => {
      state.isLoading = false
      state.viewedProducts.data = []
      state.viewedProducts.total = 0
    })

    // get all liked products
    builder.addCase(getAllProductsLikedAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllProductsLikedAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.likedProducts.data = action?.payload?.data?.products || []
      state.likedProducts.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllProductsLikedAsync.rejected, (state, action) => {
      state.isLoading = false
      state.likedProducts.data = []
      state.likedProducts.total = 0
    })
  }
})

export default productSlice.reducer
export const { resetInitialState } = productSlice.actions
