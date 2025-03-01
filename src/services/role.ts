import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role/role'

export const getAllRoles = async (data: { params: TParamsGetRoles }) => {
  // try {
  const res = await instanceAxios.get(`${API_ENDPOINT.SYSTEM.ROLE.INDEX}`, data)

  return res.data

  // } catch (err) {
  //   return err
  // }
}

export const createRole = async (data: TParamsCreateRole) => {
  // try {
  const res = await instanceAxios.post(`${API_ENDPOINT.SYSTEM.ROLE.INDEX}`, data)

  return res.data

  // } catch (err: any) {
  //   return err?.response?.data
  // }
}

export const updateRole = async (data: TParamsEditRole) => {
  const { id, ...rests } = data

  // try {
  const res = await instanceAxios.put(`${API_ENDPOINT.SYSTEM.ROLE.INDEX}/${id}`, rests)

  return res.data

  // } catch (err: any) {
  //   return err?.response?.data
  // }
}

export const deleteRole = async (id: string) => {
  // try {
  const res = await instanceAxios.delete(`${API_ENDPOINT.SYSTEM.ROLE.INDEX}/${id}`)

  return res.data

  // } catch (err: any) {
  //   return err?.response?.data
  // }
}

export const getDetailsRole = async (id: string) => {
  // try {
  const res = await instanceAxios.get(`${API_ENDPOINT.SYSTEM.ROLE.INDEX}/${id}`)

  return res.data

  // } catch (err: any) {
  //   return err?.response?.data
  // }
}
