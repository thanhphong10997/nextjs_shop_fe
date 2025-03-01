import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryKeys } from 'src/configs/queryKey'
import { getAllRoles, updateRole } from 'src/services/role'
import { TParamsEditRole, TParamsGetRoles } from 'src/types/role/role'

export const useGetListRoles = (
  params: TParamsGetRoles,
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [queryKeys.role_list, params.limit, params.page, params.order, params.search],
    queryFn: async () => {
      const res = await getAllRoles({ params: { ...params } })

      return res?.data
    },
    ...options
  })
}

export const useMutationEditRole = (
  options: Omit<UseMutationOptions<any, unknown, TParamsEditRole>, 'mutationKey' | 'mutationFn'>
) => {
  return useMutation({
    mutationKey: [queryKeys.update_role],
    mutationFn: async (data: TParamsEditRole) => {
      const res = await updateRole(data)

      return res?.data
    },
    ...options
  })
}
