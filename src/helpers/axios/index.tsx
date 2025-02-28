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
import { FC, useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'

const instanceAxios = axios.create({ baseURL: BASE_URL })
type TAxiosInterceptor = {
  children: React.ReactNode
}

// this variable is used to prevent the refresh token from being called multiple times
let isRefreshing: boolean = false
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

  // ** Interceptors
  useEffect(() => {
    const reqInterceptor = instanceAxios.interceptors.request.use(async config => {
      const { accessToken, refreshToken } = getLocalUserData()
      const { temporaryToken } = getTemporaryToken()
      const isPublicApi = config?.params?.isPublic
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
            if (decodedRefreshToken?.exp > Date.now() / 1000 && !isRefreshing) {
              isRefreshing = true

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
                .finally(() => {
                  isRefreshing = true
                })
            } else {
              handleRedirectLogin(router, setUser)
            }
          } else {
            handleRedirectLogin(router, setUser)
          }
        }
      } else if (!isPublicApi) {
        handleRedirectLogin(router, setUser)
      }

      // delete params isPublic after use it so that the isPublic param won't be sent to the server
      if (config?.params?.isPublic) {
        delete config.params.isPublic
      }

      return config
    })
    const respInterceptor = instanceAxios.interceptors.response.use(response => {
      return response
    })

    return () => {
      instanceAxios.interceptors.request.eject(reqInterceptor)
      instanceAxios.interceptors.response.eject(respInterceptor)
    }
  }, [])

  return <>{children}</>
}

export default instanceAxios
export { AxiosInterceptor }
