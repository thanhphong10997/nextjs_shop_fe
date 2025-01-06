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

Index.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT_TYPE.VIEW]
export default Index
