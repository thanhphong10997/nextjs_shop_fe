// Next
import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permission'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <h1>This is dashboard</h1>
}

Index.permission = [PERMISSIONS.DASHBOARD]
export default Index
