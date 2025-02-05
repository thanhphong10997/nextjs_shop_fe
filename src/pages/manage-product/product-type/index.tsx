// Next
import { NextPage } from 'next'

// config
import { PERMISSIONS } from 'src/configs/permission'

// pages
import ProductTypeListPage from 'src/views/layouts/pages/manage-product/product-type/ProductTypeList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <ProductTypeListPage />
}

export default Index
