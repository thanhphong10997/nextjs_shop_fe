import axios from 'axios'
import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

export const getCountUserType = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/user-type/count`)

    return res.data
  } catch (err) {
    return err
  }
}

export const getCountProductStatus = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/product-status/count`)

    return res.data
  } catch (err) {
    return err
  }
}

export const getCountAllRecords = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/all-records/count`)

    return res.data
  } catch (err) {
    return err
  }
}

export const getCountProductTypes = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/product-type/count`)

    return res.data
  } catch (err) {
    return err
  }
}

export const getCountRevenueCurrentYear = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/revenue-total`)

    return res.data
  } catch (err) {
    return err
  }
}

export const getCountOrderStatus = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.REPORT.INDEX}/order-status/count`)

    return res.data
  } catch (err) {
    return err
  }
}
