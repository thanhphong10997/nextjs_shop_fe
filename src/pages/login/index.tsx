// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import BlankLayout from 'src/views/layouts/BlankLayout'
import LoginPage from 'src/views/layouts/pages/login'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <LoginPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
Index.guestGuard = true
