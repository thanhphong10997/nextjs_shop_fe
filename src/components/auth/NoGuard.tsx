// ** React Imports
import { ReactElement, ReactNode, useEffect } from 'react'
import { clearLocalRememberLoginAuthSocial, clearTemporaryToken } from 'src/helpers/storage'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

interface NoGuardProps {
  children: ReactNode
  fallBack: ReactElement | null
}

const NoGuard = (props: NoGuardProps) => {
  // ** Props
  const { children, fallBack } = props
  const auth = useAuth()

  // useEffect(() => {
  //   // remove temporary token when reloading page
  //   const handleUnload = () => {
  //     clearTemporaryToken()
  //     clearLocalRememberLoginAuthSocial()
  //   }
  //   window.addEventListener('beforeunload', handleUnload)

  //   return () => {
  //     window.removeEventListener('beforeunload', handleUnload)
  //   }
  // }, [])

  if (auth.loading) {
    return fallBack
  }

  return <>{children}</>
}

export default NoGuard
