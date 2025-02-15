// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  deleteMultipleCommentAsync,
  deleteCommentAsync,
  getAllCommentsCMSAsync,
  serviceName,
  updateCommentAsync,
  createCommentAsync,
  replyCommentAsync,
  deleteMyCommentAsync,
  updateMyCommentAsync

  // createReviewAsync,
  // deleteMyCommentAsync,
  // updateMyCommentAsync,
} from './actions'

const initialState = {
  isLoading: false,

  isSuccessCreate: false,
  isErrorCreate: false,
  messageErrorCreate: '',
  isSuccessReply: false,
  isErrorReply: false,
  messageErrorReply: '',
  isSuccessEdit: false,
  isErrorEdit: false,
  messageErrorEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',
  isSuccessMultipleDelete: false,
  isErrorMultipleDelete: false,
  messageErrorMultipleDelete: '',
  typeError: '',
  comments: {
    data: [],
    total: 0
  }
}

export const commentSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.typeError = ''
      state.isSuccessCreate = false
      state.isErrorCreate = false
      state.messageErrorCreate = ''
      state.isSuccessReply = false
      state.isErrorReply = false
      state.messageErrorReply = ''
      state.isSuccessEdit = false
      state.isErrorEdit = false
      state.messageErrorEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = false
      state.messageErrorDelete = ''
      state.isSuccessMultipleDelete = false
      state.isErrorMultipleDelete = false
      state.messageErrorMultipleDelete = ''
    }
  },
  extraReducers: builder => {
    // Get all comments CMS
    builder.addCase(getAllCommentsCMSAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllCommentsCMSAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.comments.data = action?.payload?.data?.comments || []
      state.comments.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllCommentsCMSAsync.rejected, (state, action) => {
      state.isLoading = false
      state.comments.data = []
      state.comments.total = 0
    })

    // create comment
    builder.addCase(createCommentAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(createCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreate = !!action?.payload?.data?._id
      state.isErrorCreate = !action?.payload?.data?._id
      state.messageErrorCreate = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // reply comment
    builder.addCase(replyCommentAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(replyCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessReply = !!action?.payload?.data?._id
      state.isErrorReply = !action?.payload?.data?._id
      state.messageErrorReply = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Update comment
    builder.addCase(updateCommentAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessEdit = !!action?.payload?.data?._id
      state.isErrorEdit = !action?.payload?.data?._id
      state.messageErrorEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Update my comment
    builder.addCase(updateMyCommentAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateMyCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessEdit = !!action?.payload?.data?._id
      state.isErrorEdit = !action?.payload?.data?._id
      state.messageErrorEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete comment
    builder.addCase(deleteCommentAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageErrorDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete my comment
    builder.addCase(deleteMyCommentAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMyCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageErrorDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete multiple comment
    builder.addCase(deleteMultipleCommentAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMultipleCommentAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action?.payload?.data
      state.isErrorMultipleDelete = !action?.payload?.data
      state.messageErrorMultipleDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default commentSlice.reducer
export const { resetInitialState } = commentSlice.actions
