// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import CheckoutProductPage from 'src/views/layouts/pages/checkout-product'

type TProps = {}

export const Profile: NextPage<TProps> = () => {
  return <CheckoutProductPage />
}

export default Profile

Profile.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
