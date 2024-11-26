// Next
import { NextPage } from 'next'

// React
import { ReactElement } from 'react'

// views
import BlankLayout from 'src/views/layouts/BlankLayout'
import RegisterPage from 'src/views/layouts/pages/register'

type TProps = {}

export const Register: NextPage<TProps> = () => {
  return <RegisterPage />
}

export default Register

Register.getLayout = (page: ReactElement) => <BlankLayout>{page}</BlankLayout>
