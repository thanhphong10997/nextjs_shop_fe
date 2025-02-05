// Next
import { NextPage } from 'next'

// config
import { PERMISSIONS } from 'src/configs/permission'

// layouts
import DeliveryTypeListPage from 'src/views/layouts/pages/settings/delivery-type/DeliveryTypeList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <DeliveryTypeListPage />
}

// Index.permission = [PERMISSIONS.SETTING.DELIVERY_TYPE.VIEW]
export default Index
