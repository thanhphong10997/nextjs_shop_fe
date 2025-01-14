// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import DetailsProductPage from 'src/views/layouts/pages/product/DetailsProduct'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <DetailsProductPage />
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
