// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import MyProductPage from 'src/views/layouts/pages/my-product'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <MyProductPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
