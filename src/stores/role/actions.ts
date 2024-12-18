import { createAsyncThunk } from '@reduxjs/toolkit'
import { createRole, deleteRole, getAllRoles, updateRole } from 'src/services/role'

// services
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/auth'

export const getAllRolesAsync = createAsyncThunk('role/get-all', async (data: { params: TParamsGetRoles }) => {
  const response = await getAllRoles(data)

  return response
})

export const createRoleAsync = createAsyncThunk('role/create', async (data: TParamsCreateRole) => {
  const response = await createRole(data)

  return response
})

export const updateRoleAsync = createAsyncThunk('role/update', async (data: TParamsEditRole) => {
  const response = await updateRole(data)
  console.log('action res', { response })

  return response
})

export const deleteRoleAsync = createAsyncThunk('role/delete', async (id: string) => {
  const response = await deleteRole(id)
  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response?.data?.message,
    typeError: response?.response?.data?.typeError
  }
})
