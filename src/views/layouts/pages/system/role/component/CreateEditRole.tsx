// Import Mui
import { Box, Button, IconButton, TextField, Tooltip, Typography, useTheme } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'
import CustomModal from 'src/components/custom-modal'
import { Controller, useForm } from 'react-hook-form'

// hook form
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { createRole, getDetailsRole, updateRole } from 'src/services/role'
import Spinner from 'src/components/spinner'
import { PERMISSIONS } from 'src/configs/permission'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from 'src/configs/queryKey'
import { TParamsCreateRole, TParamsEditRole } from 'src/types/role/role'
import toast from 'react-hot-toast'
import { useMutationEditRole } from 'src/queries/role'

type TCreateEditRole = {
  open: boolean
  onClose: () => void
  roleId?: string
  sortBy: string
  searchBy: string
}

const CreateEditRole = (props: TCreateEditRole) => {
  // hooks
  const { t } = useTranslation()
  const theme = useTheme()

  // props
  const { open, onClose, roleId, sortBy, searchBy } = props

  // query
  const queryClient = useQueryClient()

  // react hook form
  const schema = yup
    .object()
    .shape({
      name: yup.string().required(t('required_field'))
    })
    .required()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: { name: string }) => {
    if (!Object.keys(errors)?.length) {
      if (roleId) {
        // update
        // dispatch(updateRoleAsync({ name: data?.name, id: roleId }))
        mutateEditRole({ name: data?.name, id: roleId })
      } else {
        // dispatch(createRoleAsync({ name: data?.name, permissions: [PERMISSIONS.DASHBOARD] }))
        mutateCreateRole({ name: data?.name, permissions: [PERMISSIONS.DASHBOARD] })
      }
    }
  }

  // fetch api
  const fetchDetailsRole = async (id: string) => {
    const res = await getDetailsRole(id)

    return res?.data
  }

  // Query
  const { data: roleDetails, isFetching: isLoadingDetails } = useQuery({
    queryKey: [queryKeys.role_detail, roleId],
    queryFn: () => fetchDetailsRole(roleId || ''),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 10000,

    // staleTime: 5000,

    initialData: () => {
      // get the data from the role list for placeholder
      const roles = (queryClient.getQueryData([queryKeys.role_list, sortBy, searchBy]) as any)?.roles

      return roles?.find((item: { _id: string }) => item?._id === roleId)
    },

    // the query won't be called if the role id is empty
    enabled: !!roleId
  })

  // create role
  const fetchCreateRole = async (data: TParamsCreateRole) => {
    const res = await createRole(data)

    return res?.data
  }

  const { isPending: isLoadingCreate, mutate: mutateCreateRole } = useMutation({
    mutationKey: [queryKeys.create_role],
    mutationFn: fetchCreateRole,
    onSuccess: newRole => {
      queryClient.setQueryData([queryKeys.role_list, -1, -1, sortBy, searchBy], (oldData: any) => {
        return { ...oldData, roles: [newRole, ...oldData.roles] }
      })
      onClose()
      toast.success(t('create_role_success'))
    },
    onError: () => {
      toast.error(t('create_role_error'))
    }
  })

  // update role name

  const { isPending: isLoadingEdit, mutate: mutateEditRole } = useMutationEditRole({
    onSuccess: newRole => {
      // set data to cache without fetching API
      queryClient.setQueryData([queryKeys.role_list, -1, -1, sortBy, searchBy], (oldData: any) => {
        const editedRole = oldData?.roles?.find((item: any) => item?._id === newRole?._id)
        if (editedRole) editedRole.name = newRole?.name

        return oldData
      })
      onClose()
      toast.success(t('update_role_success'))
    },
    onError: () => {
      toast.error(t('update_role_error'))
    }
  })

  useEffect(() => {
    if (!open) {
      reset({
        name: ''
      })
    }
  }, [open])

  useEffect(() => {
    if (roleDetails) {
      reset({
        name: roleDetails?.name
      })
    }
  }, [roleDetails])

  return (
    <>
      {(isLoadingDetails || isLoadingCreate || isLoadingEdit) && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '400px', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {roleId ? t('edit_role') : t('create_role')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                width: '100%',
                padding: '30px 20px',
                borderRadius: '15px'
              }}
            >
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.name)}
                      variant='outlined'
                      label={t('Role_name')}
                      placeholder={t('enter_name')}
                      fullWidth
                      helperText={errors?.name?.message}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type='submit' variant='contained' color='primary'>
                {!roleId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditRole
