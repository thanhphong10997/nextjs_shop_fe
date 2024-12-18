// axios
import axios from 'axios'

// components
import { BASE_URL, API_ENDPOINT } from 'src/configs/api'
import {
  clearLocalUserData,
  clearTemporaryToken,
  getLocalUserData,
  getTemporaryToken,
  setLocalUserData,
  setTemporaryToken
} from '../storage'

// jwt
import { jwtDecode } from 'jwt-decode'
import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'

const instanceAxios = axios.create({ baseURL: BASE_URL })
type TAxiosInterceptor = {
  children: React.ReactNode
}
const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter()
  const { user, setUser } = useAuth()

  const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
    if (router.asPath !== '/' && router.asPath !== '/login') {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    } else {
      router.replace('/login')
    }
    setUser(null)
    clearLocalUserData()
    clearTemporaryToken()
  }
  instanceAxios.interceptors.request.use(async config => {
    const { accessToken, refreshToken } = getLocalUserData()
    const { temporaryToken } = getTemporaryToken()
    if (accessToken || temporaryToken) {
      let decodedAccessToken: any = {}
      if (accessToken) {
        decodedAccessToken = jwtDecode(accessToken)
      } else if (temporaryToken) {
        decodedAccessToken = jwtDecode(temporaryToken)
      }
      if (decodedAccessToken?.exp > Date.now() / 1000) {
        config.headers['Authorization'] = `Bearer ${accessToken ? accessToken : temporaryToken}`
      } else {
        if (refreshToken) {
          const decodedRefreshToken: any = jwtDecode(refreshToken)
          if (decodedRefreshToken?.exp > Date.now() / 1000) {
            // call api and return new access
            await axios
              .post(
                `${API_ENDPOINT.AUTH.INDEX}/refresh-token`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`
                  }
                }
              )
              .then(response => {
                if (response?.data?.data?.access_token) {
                  const newAccessToken = response.data.data.access_token
                  if (accessToken) {
                    setLocalUserData(JSON.stringify(user), newAccessToken, refreshToken)
                  }
                  config.headers['Authorization'] = `Bearer ${newAccessToken}`
                } else {
                  handleRedirectLogin(router, setUser)
                }
              })
              .catch(err => {
                handleRedirectLogin(router, setUser)
              })
          } else {
            handleRedirectLogin(router, setUser)
          }
        } else {
          handleRedirectLogin(router, setUser)
        }
      }
    } else {
      handleRedirectLogin(router, setUser)
    }

    return config
  })
  instanceAxios.interceptors.response.use(response => {
    return response
  })

  return <>{children}</>
}

export default instanceAxios
export { AxiosInterceptor }
