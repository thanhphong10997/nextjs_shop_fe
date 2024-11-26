import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'
import LoginPage from 'src/views/layouts/pages/login'

type TProps = {}

export const Login: NextPage<TProps> = () => {
  return <LoginPage />
}

export default Login

Login.getLayout = (page: ReactElement) => <BlankLayout>{page}</BlankLayout>
