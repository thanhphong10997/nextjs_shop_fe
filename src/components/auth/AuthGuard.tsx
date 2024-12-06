/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { CONFIG_API } from 'src/configs/api'
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'
import { clearLocalUserData } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const router = useRouter()
  const authContext = useAuth()

  useEffect(() => {
    // Handle if the first render of the page is not ready yet
    if (!router.isReady) return

    if (
      authContext.user === null &&
      !window.localStorage.getItem(USER_DATA) &&
      !window.localStorage.getItem(ACCESS_TOKEN)
    ) {
      if (router.asPath !== '/' && router.asPath !== '/login') {
        router.replace({ pathname: `/login`, query: { returnUrl: router.asPath } })
      } else {
        router.replace(`/login`)
      }
      authContext.setUser(null)

      // Clear local storage before login
      clearLocalUserData()
    }
  }, [router.route])

  if (authContext.loading || authContext.user === null) return fallback

  return <>{children}</>
}

export default AuthGuard
