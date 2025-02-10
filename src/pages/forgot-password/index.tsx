// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import BlankLayout from 'src/views/layouts/BlankLayout'
import ForgotPasswordPage from 'src/views/layouts/pages/forgot-password'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <ForgotPasswordPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Index.guestGuard = true
