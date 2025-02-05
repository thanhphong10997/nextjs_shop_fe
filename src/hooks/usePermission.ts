import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from './useAuth'
import { useEffect, useState } from 'react'

type TActions = 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE'
export const usePermission = (key: string, actions: TActions[]) => {
  const { user } = useAuth()
  const defaultValues = {
    VIEW: false,
    CREATE: false,
    UPDATE: false,
    DELETE: false
  }

  const getObjectValue = (obj: any, key: string) => {
    const keys = key.split('.')
    let result = obj
    for (const key of keys) {
      if (key in result) {
        result = result[key]
      } else {
        return undefined
      }
    }

    return result
  }

  const userPermission = user?.role?.permissions
  const [permission, setPermission] = useState(defaultValues)

  useEffect(() => {
    const mapPermission = getObjectValue(PERMISSIONS, key)
    actions.forEach(mode => {
      if (userPermission?.includes(PERMISSIONS?.ADMIN)) {
        defaultValues[mode] = true
      } else if (userPermission?.includes(mapPermission?.[mode])) {
        defaultValues[mode] = true
      } else {
        defaultValues[mode] = false
      }
    })
    setPermission(defaultValues)
  }, [user?.role])

  return permission
}
