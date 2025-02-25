// Next
import { NextPage } from 'next'
import Head from 'next/head'

// React
import { ReactNode } from 'react'
import { getDetailsProductPublicBySlug, getListRelatedProductBySlug } from 'src/services/product'
import { TProduct } from 'src/types/product'
import { getTextFromHTML } from 'src/utils'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import DetailsProductPage from 'src/views/layouts/pages/product/DetailsProduct'

type TProps = {
  productData: TProduct
  relatedProductList: TProduct[]
}

export const Index: NextPage<TProps> = ({ productData, relatedProductList }) => {
  return (
    <>
      <Head>
        <title>{productData?.name}</title>
        <meta name='description' content={getTextFromHTML(productData?.description)} />
        <meta name='author' content='Phong cute' />
        <meta name='name' content='Shop bán hàng điện tử' />
        <meta name='image' content={productData?.image} />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        {/* custom meta for facebook */}
        <meta property='og:type' content='website' />
        <meta property='og:title' content={productData?.name} />
        <meta property='og:description' content={getTextFromHTML(productData?.description)} />
        <meta property='og:image' content={productData?.image} />
        {/* custom meta for twitter(X) */}
        <meta property='twitter:card' content='website' />
        <meta property='twitter:title' content={productData?.name} />
        <meta property='twitter:description' content={getTextFromHTML(productData?.description)} />
        <meta property='twitter:image' content={productData?.image} />
      </Head>
      <DetailsProductPage productDataServer={productData} relatedProductListServer={relatedProductList} />
    </>
  )
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
Index.authGuard = false
Index.guestGuard = false

export async function getServerSideProps(context: any) {
  const slugId = context?.query?.productId

  try {
    const res = await getDetailsProductPublicBySlug(slugId, true)
    const productData = res?.data
    const resRelated = await getListRelatedProductBySlug({ params: { slug: slugId } })
    const relatedProductList = resRelated?.data

    if (!productData?._id) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        productData: productData,
        relatedProductList: relatedProductList
      }
    }
  } catch (err) {
    return {
      props: {
        productData: {},
        relatedProductList: []
      }
    }
  }
}
