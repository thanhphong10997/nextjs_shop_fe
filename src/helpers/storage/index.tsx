import {
  ACCESS_TOKEN,
  DEVICE_TOKEN,
  PRE_AUTH_TOKEN,
  REFRESH_TOKEN,
  REMEMBER_AUTH_TOKEN,
  TEMPORARY_TOKEN,
  USER_DATA
} from 'src/configs/auth'
import { LOCAL_PRODUCT_CART } from 'src/configs/product'
import { TItemOrderProduct } from 'src/types/order-product'

// Access token, refresh token and user data
export const setLocalUserData = (userData: string, accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USER_DATA, JSON.stringify(userData))
    window.localStorage.setItem(ACCESS_TOKEN, accessToken)
    window.localStorage.setItem(REFRESH_TOKEN, refreshToken)
  }
}

export const getLocalUserData = () => {
  if (typeof window !== 'undefined') {
    return {
      userData: window.localStorage.getItem(USER_DATA),
      accessToken: window.localStorage.getItem(ACCESS_TOKEN),
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN)
    }
  }

  return {
    userData: '',
    accessToken: '',
    refreshToken: ''
  }
}

export const clearLocalUserData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(USER_DATA)
    window.localStorage.removeItem(ACCESS_TOKEN)
    window.localStorage.removeItem(REFRESH_TOKEN)
  }
}

// Temporary Token

export const setTemporaryToken = (accessToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TEMPORARY_TOKEN, accessToken)
  }
}

export const getTemporaryToken = () => {
  if (typeof window !== 'undefined') {
    return {
      temporaryToken: window.localStorage.getItem(TEMPORARY_TOKEN)
    }
  }

  return {
    temporaryToken: ''
  }
}

export const clearTemporaryToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TEMPORARY_TOKEN)
  }
}

export const setLocalProductToCart = (data: Record<string, TItemOrderProduct[]>) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_PRODUCT_CART, JSON.stringify(data))
  }
}

export const getLocalProductCart = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(LOCAL_PRODUCT_CART)
  }

  return ''
}

// third party apps token
export const setLocalPreTokenSocial = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PRE_AUTH_TOKEN, token)
  }
}

export const getLocalPreTokenSocial = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(PRE_AUTH_TOKEN)
  }

  return ''
}

export const clearLocalPreTokenSocial = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(PRE_AUTH_TOKEN)
  }
}

// remember-me local storage
export const setLocalRememberLoginAuthSocial = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(REMEMBER_AUTH_TOKEN, token)
  }
}

export const getLocalRememberLoginAuthSocial = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(REMEMBER_AUTH_TOKEN)
  }

  return ''
}

export const clearLocalRememberLoginAuthSocial = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(REMEMBER_AUTH_TOKEN)
  }
}

// firebase cloud message local storage
export const setLocalDeviceToken = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DEVICE_TOKEN, token)
  }
}

export const getLocalDeviceToken = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(DEVICE_TOKEN)
  }

  return ''
}

export const clearLocalDeviceToken = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(DEVICE_TOKEN)
  }
}
