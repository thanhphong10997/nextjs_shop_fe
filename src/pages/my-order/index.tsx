// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import MyOrderPage from 'src/views/layouts/pages/my-order'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <MyOrderPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
