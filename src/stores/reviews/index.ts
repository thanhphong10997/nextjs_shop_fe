// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  createReviewAsync,
  deleteMultipleReviewAsync,
  deleteMyReviewAsync,
  deleteReviewAsync,
  getAllReviewsAsync,
  serviceName,
  updateMyReviewAsync,
  updateReviewAsync
} from './actions'

const initialState = {
  isLoading: false,
  isSuccessCreate: false,
  isErrorCreate: false,
  messageCreate: '',
  isSuccessEdit: false,
  isErrorEdit: false,
  messageEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageMultipleDelete: '',
  typeError: '',
  reviews: {
    data: [],
    total: 0
  }
}

export const reviewSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.typeError = ''
      state.isSuccessCreate = false
      state.isErrorCreate = false
      state.messageCreate = ''
      state.isSuccessEdit = false
      state.isErrorEdit = false
      state.messageEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messageDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.messageMultipleDelete = ''
    }
  },
  extraReducers: builder => {
    // Get all reviews
    builder.addCase(getAllReviewsAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllReviewsAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.reviews.data = action?.payload?.data?.reviews || []
      state.reviews.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllReviewsAsync.rejected, (state, action) => {
      state.isLoading = false
      state.reviews.data = []
      state.reviews.total = 0
    })

    // create review
    builder.addCase(createReviewAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(createReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreate = !!action?.payload?.data?._id
      state.isErrorCreate = !action?.payload?.data?._id
      state.messageCreate = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Update review
    builder.addCase(updateReviewAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessEdit = !!action?.payload?.data?._id
      state.isErrorEdit = !action?.payload?.data?._id
      state.messageEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Update my review
    builder.addCase(updateMyReviewAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateMyReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessEdit = !!action?.payload?.data?._id
      state.isErrorEdit = !action?.payload?.data?._id
      state.messageEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete review
    builder.addCase(deleteReviewAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete my review
    builder.addCase(deleteMyReviewAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMyReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete multiple review
    builder.addCase(deleteMultipleReviewAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMultipleReviewAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action?.payload?.data
      state.isErrorMultipleDelete = !action?.payload?.data
      state.messageMultipleDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default reviewSlice.reducer
export const { resetInitialState } = reviewSlice.actions
