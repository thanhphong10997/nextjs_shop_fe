export default {
  // meEndpoint: '/auth/me',
  // loginEndpoint: '/jwt/login',
  // registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

export const USER_DATA = 'userData'
export const ACCESS_TOKEN = 'accessToken'
export const REFRESH_TOKEN = 'refreshToken'
export const TEMPORARY_TOKEN = 'temporaryToken'

export const LIST_PAGE_PUBLIC = ['/product', '/']
