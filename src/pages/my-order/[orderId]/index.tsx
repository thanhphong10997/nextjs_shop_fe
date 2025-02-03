// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import MyDetailsOrderPage from 'src/views/layouts/pages/my-order/DetailsOrder'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <MyDetailsOrderPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
