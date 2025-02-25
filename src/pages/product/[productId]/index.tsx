// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'
import { getDetailsProductPublicBySlug, getListRelatedProductBySlug } from 'src/services/product'
import { TProduct } from 'src/types/product'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import DetailsProductPage from 'src/views/layouts/pages/product/DetailsProduct'

type TProps = {
  productData: TProduct
  relatedProductList: TProduct[]
}

export const Index: NextPage<TProps> = ({ productData, relatedProductList }) => {
  return <DetailsProductPage productDataServer={productData} relatedProductListServer={relatedProductList} />
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
