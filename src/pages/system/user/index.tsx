// Next
import { NextPage } from 'next'

// config
import { PERMISSIONS } from 'src/configs/permission'
import UserListPage from 'src/views/layouts/pages/system/user/UserList'

// pages

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <UserListPage />
}

Index.permission = [PERMISSIONS.SYSTEM.USER.VIEW]
export default Index
