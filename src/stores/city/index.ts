// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** actions
import {
  createCityAsync,
  deleteMultipleCityAsync,
  deleteCityAsync,
  getAllCitiesAsync,
  serviceName,
  updateCityAsync
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
  cities: {
    data: [],
    total: 0
  }
}

export const citySlice = createSlice({
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
    }
  },
  extraReducers: builder => {
    // Get all Citys
    builder.addCase(getAllCitiesAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(getAllCitiesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.cities.data = action?.payload?.data?.cities || []
      state.cities.total = action?.payload?.data?.totalCount
    })
    builder.addCase(getAllCitiesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.cities.data = []
      state.cities.total = 0
    })

    // Create City
    builder.addCase(createCityAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(createCityAsync.fulfilled, (state, action) => {
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

    // Update City
    builder.addCase(updateCityAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(updateCityAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action?.payload?.data?._id
      state.isErrorCreateEdit = !action?.payload?.data?._id
      state.messageErrorCreateEdit = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete City
    builder.addCase(deleteCityAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteCityAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action?.payload?.data?._id
      state.isErrorDelete = !action?.payload?.data?._id
      state.messageErrorDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })

    // Delete Multiple City
    builder.addCase(deleteMultipleCityAsync.pending, (state, action) => {
      state.isLoading = true
    })

    // Still go to fullfilled (not rejected) even if the api return an error

    builder.addCase(deleteMultipleCityAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessMultipleDelete = !!action?.payload?.data
      state.isErrorMultipleDelete = !action?.payload?.data
      state.messageErrorMultipleDelete = action?.payload?.message
      state.typeError = action?.payload?.typeError
    })
  }
})

export default citySlice.reducer
export const { resetInitialState } = citySlice.actions
