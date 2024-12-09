// ** React Imports
import { ReactElement, ReactNode } from 'react'

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

  if (auth.loading) {
    return fallBack
  }

  return <>{children}</>
}

export default NoGuard
