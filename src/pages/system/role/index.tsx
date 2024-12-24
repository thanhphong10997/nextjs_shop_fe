// Next
import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permission'
import RoleListPage from 'src/views/layouts/pages/system/role/RoleList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <RoleListPage />
}

Index.permission = [PERMISSIONS.SYSTEM.ROLE.VIEW]
export default Index
