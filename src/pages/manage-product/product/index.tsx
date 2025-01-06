// Next
import { NextPage } from 'next'

// configs
import { PERMISSIONS } from 'src/configs/permission'

// pages
import ProductListPage from 'src/views/layouts/pages/manage-product/product/ProductList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <ProductListPage />
}

Index.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW]
export default Index
