// Next
import { NextPage } from 'next'

// others
import { PERMISSIONS } from 'src/configs/permission'
import OrderProductListPage from 'src/views/layouts/pages/manage-order/order-product/OrderProductList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <OrderProductListPage />
}
Index.permission = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]
export default Index
