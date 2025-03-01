// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Button, Grid, useTheme } from '@mui/material'
import { GridColDef, GridRowClassNameParams, GridSortModel } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useRef, useState, useCallback } from 'react'

// translate
import { useTranslation } from 'react-i18next'

// config
// import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// Components
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import CustomPagination from 'src/components/custom-pagination'
import CustomDataGrid from 'src/components/custom-data-grid'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './component/CreateEditRole'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import TablePermission from './component/TablePermission'

// react toast
import toast from 'react-hot-toast'

// icon
import { Icon } from '@iconify/react/dist/iconify.js'

// config
import { PERMISSIONS } from 'src/configs/permission'

// services
import { deleteRole, getAllRoles, getDetailsRole, updateRole } from 'src/services/role'

// utils
import { getAllObjectValues } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermission } from 'src/hooks/usePermission'
import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from 'src/configs/queryKey'
import { TParamsEditRole } from 'src/types/role/role'
import { useGetListRoles, useMutationEditRole } from 'src/queries/role'

type TProps = {}

export const RoleListPage: NextPage<TProps> = () => {
  // translate
  const { t } = useTranslation()

  // theme
  const theme = useTheme()

  // ref
  const refActionGrid = useRef<boolean>(false)

  // state
  // const [page, setPage] = useState(1)
  // const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteRole, setOpenConfirmationDeleteRole] = useState({
    open: false,
    id: ''
  })
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: ''
  })
  const [isDisabledPermission, setIsDisabledPermission] = useState(false)

  const { VIEW, CREATE, UPDATE, DELETE } = usePermission('SYSTEM.ROLE', ['VIEW', 'CREATE', 'UPDATE', 'DELETE'])

  // Query
  const queryClient = useQueryClient()

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1
    },
    {
      field: 'action',
      headerName: t('Actions'),
      width: 150,
      sortable: false,
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ width: '100%' }}>
            {!row?.permissions?.some((per: string) => {
              return ['ADMIN.GRANTED', 'BASIC.PUBLIC']?.includes(per)
            }) ? (
              <Box>
                <GridEdit
                  disabled={!UPDATE}
                  onClick={() => {
                    refActionGrid.current = true
                    setOpenCreateEdit({
                      open: true,
                      id: String(params.id)
                    })
                  }}
                />
                <GridDelete
                  disabled={!DELETE}
                  onClick={() => {
                    refActionGrid.current = true
                    setOpenConfirmationDeleteRole({
                      open: true,
                      id: String(params.id)
                    })
                  }}
                />
              </Box>
            ) : (
              <Icon icon='material-symbols-light:lock-outline' fontSize={30} />
            )}
          </Box>
        )
      }
    }
  ]

  // ****** Custom pagination
  // const PaginationComponent = () => {
  //   return (
  //     <CustomPagination
  //       pageSize={pageSize}
  //       page={page}
  //       rowLength={roles.total}
  //       pageSizeOptions={PAGE_SIZE_OPTION}
  //       onChangePagination={handleOnChangePagination}
  //     />
  //   )
  // }

  // ****** Custom pagination

  // fetch API

  // Query

  // get the status of the latest data after call create role API, can use to push the toast message
  // const data = useMutationState({
  //   filters: { mutationKey: [queryKeys.create_role] },
  //   select: mutation => mutation.state
  // })
  // const isSuccessCreate = data?.[length - 1]?.status

  // get all roles

  const { data: roleList, isPending } = useGetListRoles(
    { limit: -1, page: -1, order: sortBy, search: searchBy },
    {
      select: data => data?.roles,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 10000
    }
  )

  // delete role
  const fetchDeleteRole = async (id: string) => {
    const res = await deleteRole(id)

    return res?.data
  }

  const { isPending: isLoadingDelete, mutate: mutateDeleteRole } = useMutation({
    mutationKey: [queryKeys.delete_role],
    mutationFn: fetchDeleteRole,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [queryKeys.role_list, -1, -1, sortBy, searchBy] })
      handleCloseConfirmDeleteRole()
      toast.success(t('delete_role_success'))
    },
    onError: () => {
      toast.error(t('delete_role_error'))
    },
    onSettled: () => {}
  })

  // update role permissions

  const { isPending: isLoadingEdit, mutate: mutateEditRole } = useMutationEditRole({
    onSuccess: () => {
      // refetch API
      queryClient.refetchQueries({ queryKey: [queryKeys.role_list, -1, -1, sortBy, searchBy] })
      toast.success(t('update_role_success'))
    },
    onError: () => {
      toast.error(t('update_role_error'))
    }
  })

  // Handler

  const handleCloseConfirmDeleteRole = useCallback(() => {
    setOpenConfirmationDeleteRole({
      open: false,
      id: ''
    })
    refActionGrid.current = false
  }, [])

  const handleDeleteRole = () => {
    // dispatch(deleteRoleAsync(openConfirmationDeleteRole.id))
    mutateDeleteRole(openConfirmationDeleteRole.id)
  }

  const handleCloseCreateEdit = useCallback(() => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }, [])

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`)
  }

  const handleUpdateRole = () => {
    // dispatch(updateRoleAsync({ name: selectedRow.name, id: selectedRow.id, permissions: selectedPermission }))
    mutateEditRole({ name: selectedRow.name, id: selectedRow.id, permissions: selectedPermission })
  }

  const handleGetDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailsRole(id)
      .then(res => {
        if (res?.data) {
          if (res?.data?.permissions.includes(PERMISSIONS.ADMIN)) {
            setIsDisabledPermission(true)
            setSelectedPermission(getAllObjectValues(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC]))
          } else if (res?.data?.permissions.includes(PERMISSIONS.BASIC)) {
            setIsDisabledPermission(true)
            setSelectedPermission((PERMISSIONS as any)?.DASHBOARD)
          } else {
            setIsDisabledPermission(false)
            setSelectedPermission(res.data?.permissions || [])
          }
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (selectedRow.id) {
      handleGetDetailsRole(selectedRow.id)
    }
  }, [selectedRow])

  return (
    <>
      {(isLoadingEdit || isPending || isLoadingDelete || loading) && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_role')}
        description={t('confirm_delete_role')}
        open={openConfirmationDeleteRole.open}
        handleClose={handleCloseConfirmDeleteRole}
        handleCancel={handleCloseConfirmDeleteRole}
        handleConfirm={handleDeleteRole}
      />
      <CreateEditRole
        open={openCreateEdit.open}
        roleId={openCreateEdit.id}
        sortBy={sortBy}
        searchBy={searchBy}
        onClose={handleCloseCreateEdit}
      />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%',
          maxHeight: '100%',
          borderRadius: '15px'
        }}
      >
        <Grid container sx={{ height: '100%', width: '100%' }}>
          <Grid item md={4} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
              </Box>
              <GridCreate
                disabled={!CREATE}
                onClick={() => {
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }}
              />
            </Box>
            <CustomDataGrid
              sx={{
                '.row-selected': {
                  backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)}`,
                  color: `${theme.palette.primary.main}`
                }
              }}
              rows={roleList || []}
              columns={columns}
              autoHeight
              getRowId={row => row._id}
              getRowClassName={(row: GridRowClassNameParams<any>) => {
                return row.id === selectedRow.id ? 'row-selected' : ''
              }}
              pageSizeOptions={[5]}
              sortingMode='server'
              onSortModelChange={handleSort}
              sortingOrder={['desc', 'asc']}
              disableRowSelectionOnClick
              disableColumnFilter
              hideFooter
              onRowClick={row => {
                if (!refActionGrid.current) {
                  setSelectedRow({
                    id: String(row.id),
                    name: row?.row?.name
                  })
                }
              }}

              // slots={{
              //   pagination: PaginationComponent
              // }}
            />
          </Grid>
          <Grid item md={8} xs={12} paddingLeft={{ md: '40px', xs: 0 }} paddingTop={{ md: 0, xs: '20px' }}>
            {selectedRow.id && (
              <>
                <TablePermission
                  selectedPermission={selectedPermission}
                  setSelectedPermission={setSelectedPermission}
                  disabled={isDisabledPermission}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    disabled={isDisabledPermission}
                    type='submit'
                    variant='contained'
                    color='primary'
                    onClick={handleUpdateRole}
                  >
                    {t('update')}
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
