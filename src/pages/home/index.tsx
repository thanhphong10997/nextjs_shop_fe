import Head from 'next/head'
import { ReactNode, useEffect } from 'react'
import { getAllProductsPublic } from 'src/services/product'
import { getAllProductTypes } from 'src/services/product-type'
import { TProduct } from 'src/types/product'
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import HomePage from 'src/views/layouts/pages/home'

interface TOptions {
  label: string
  value: string
}
interface TProps {
  products: TProduct[]
  totalCount: number
  productTypes: TOptions[]
  params: {
    limit: number
    page: number
    order: string
    productType: string
  }
}

export default function Home(props: TProps) {
  const { products, totalCount, params, productTypes } = props

  return (
    <>
      <Head>
        <title>Ecommerce-NextJS - Danh sách sản phẩm</title>
        <meta name='description' content='Bán hàng điện tử, điện thoại, laptop, máy tính bảng' />
        <meta name='keywords' content='ReactJS, NextJS, Typescript' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <HomePage products={products} totalCount={totalCount} serverParams={params} productTypesServer={productTypes} />
    </>
  )
}

Home.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

Home.guestGuard = false
Home.authGuard = false
Home.title = 'Product list page, contains all products of the store'

export async function getServerSideProps() {
  const limit = 10,
    page = 1,
    order = 'createdAt desc'
  try {
    const productTypes: TOptions[] = []
    await getAllProductTypes({ params: { limit: -1, page: -1 } }).then(res => {
      const data = res?.data?.productTypes
      if (data) {
        data?.map((item: { name: string; _id: string }) => {
          productTypes.push({ label: item?.name, value: item?._id })
        })
      }
    })

    const res = await getAllProductsPublic({
      params: { limit: +limit, page: +page, productType: productTypes?.[0]?.value }
    })
    const data = res?.data

    return {
      props: {
        products: data.products,
        totalCount: data?.totalCount,
        productTypes: productTypes,
        params: {
          limit,
          page,
          order,
          productType: productTypes?.[0]?.value
        }
      }
    }
  } catch (err) {
    return {
      props: {
        products: [],
        totalCount: 0,
        productTypes: [],
        params: {
          limit,
          page,
          order,
          productType: ''
        }
      }
    }
  }
}
