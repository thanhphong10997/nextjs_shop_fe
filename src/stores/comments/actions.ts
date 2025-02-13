import { createAsyncThunk } from '@reduxjs/toolkit'
import { deleteComment, deleteMultipleComment, getAllComments, updateComment } from 'src/services/comment-product'

// types
import { TParamsDeleteMultipleComment, TParamsGetComments, TParamsUpdateComment } from 'src/types/comment'

export const serviceName = 'comment'

// export const createReviewAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsAddReview) => {
//   const response = await addReview(data)

//   return response
// })

export const getAllCommentsCMSAsync = createAsyncThunk(
  `${serviceName}/get-all-cms`,
  async (data: { params: TParamsGetComments }) => {
    const response = await getAllComments(data)

    return response
  }
)

export const updateCommentAsync = createAsyncThunk(`${serviceName}/update`, async (data: TParamsUpdateComment) => {
  const response = await updateComment(data)

  return response
})

// export const updateMyReviewAsync = createAsyncThunk(
//   `${serviceName}/update-my-review`,
//   async (data: TParamsUpdateReview) => {
//     const response = await updateMyReview(data)

//     return response
//   }
// )

export const deleteCommentAsync = createAsyncThunk(`${serviceName}/delete`, async (id: string) => {
  const response = await deleteComment(id)

  return response
})

// export const deleteMyReviewAsync = createAsyncThunk(`${serviceName}/delete-my-review`, async (id: string) => {
//   const response = await deleteReview(id)

//   return response
// })

export const deleteMultipleCommentAsync = createAsyncThunk(
  `${serviceName}/delete-multiple`,
  async (ids: TParamsDeleteMultipleComment) => {
    const response = await deleteMultipleComment(ids)

    return response
  }
)
