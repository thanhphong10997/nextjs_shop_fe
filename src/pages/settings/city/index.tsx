// Next
import { NextPage } from 'next'

// configs
import { PERMISSIONS } from 'src/configs/permission'

// page
import CityListPage from 'src/views/layouts/pages/settings/city/CityList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <CityListPage />
}

Index.permission = [PERMISSIONS.SETTING.CITY.VIEW]
export default Index
