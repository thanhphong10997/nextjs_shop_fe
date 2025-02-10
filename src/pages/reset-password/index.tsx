// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import BlankLayout from 'src/views/layouts/BlankLayout'
import ResetPasswordPage from 'src/views/layouts/pages/reset-password'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <ResetPasswordPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Index.guestGuard = true
