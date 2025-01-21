// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig, { LIST_PAGE_PUBLIC } from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { loginAuth, logoutAuth } from 'src/services/auth'
import { API_ENDPOINT } from 'src/configs/api'
import { clearLocalUserData, setLocalUserData, setTemporaryToken } from 'src/helpers/storage'
import instanceAxios from 'src/helpers/axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { updateProductToCart } from 'src/stores/order-product'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  // redux
  const dispatch: AppDispatch = useDispatch()

  // translate
  const { t } = useTranslation()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await instanceAxios

          // .get(authConfig.meEndpoint, {
          .get(API_ENDPOINT.AUTH.AUTH_ME)
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data })
          })
          .catch(() => {
            clearLocalUserData()
            setUser(null)
            setLoading(false)
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    // axios
    //   .post(authConfig.loginEndpoint, params)
    loginAuth({ email: params.email, password: params.password })
      .then(async response => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response?.data?.access_token)
        }
        const returnUrl = router.query.returnUrl

        setUser({ ...response.data.user })
        toast.success(t('login_success'))

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setLoading(true)
    logoutAuth().then(res => {
      setUser(null)
      clearLocalUserData()
      if (!LIST_PAGE_PUBLIC?.some(item => router?.asPath?.startsWith(item))) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }

      // reset the items in the cart when the user is logged out
      dispatch(updateProductToCart({ orderItems: [] }))
      setLoading(false)

      // router.push('/login')
    })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
