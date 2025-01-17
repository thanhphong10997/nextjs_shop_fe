// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import MyCartPage from 'src/views/layouts/pages/my-cart'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <MyCartPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
