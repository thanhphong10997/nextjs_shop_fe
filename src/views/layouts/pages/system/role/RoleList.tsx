// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Button, Grid, useTheme } from '@mui/material'
import { GridColDef, GridRowClassNameParams, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useRef, useState } from 'react'

// Import redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { deleteRoleAsync, getAllRolesAsync, updateRoleAsync } from 'src/stores/role/actions'
import { resetInitialState } from 'src/stores/role'

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
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/error'
import { PERMISSIONS } from 'src/configs/permission'

// services
import { getAllRoles, getDetailsRole } from 'src/services/role'

// utils
import { getAllObjectValues } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermission } from 'src/hooks/usePermission'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from 'src/configs/queryKey'

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
  const [sortBy, setSortBy] = useState('')
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

  // redux
  const {
    roles,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageCreateEdit,
    isLoading,
    isSuccessDelete,
    isErrorDelete,
    messageDelete,
    typeError
  } = useSelector((state: RootState) => state.role)

  // redux
  const dispatch: AppDispatch = useDispatch()

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
  const fetchRoles = async (sortBy: string, searchBy: string) => {
    const res = await getAllRoles({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } })

    return res?.data
  }

  const { data: roleList, isPending } = useQuery({
    queryKey: [queryKeys.role_list, sortBy, searchBy],
    queryFn: () => fetchRoles(sortBy, searchBy),
    select: data => data?.roles,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 10000
  })

  // Handler
  const handleOnChangePagination = () => {}

  const handleCloseConfirmDeleteRole = () => {
    setOpenConfirmationDeleteRole({
      open: false,
      id: ''
    })
    refActionGrid.current = false
  }

  const handleDeleteRole = () => {
    dispatch(deleteRoleAsync(openConfirmationDeleteRole.id))
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
    refActionGrid.current = false
  }

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`)
  }

  const handleUpdateRole = () => {
    dispatch(updateRoleAsync({ name: selectedRow.name, id: selectedRow.id, permissions: selectedPermission }))
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

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update_role_success'))
      } else {
        toast.success(t('create_role_success'))
      }

      // get role list by refetching API
      queryClient.refetchQueries({ queryKey: [queryKeys.role_list] })
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('update_role_error'))
        } else {
          toast.error(t('create_role_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_role_success'))

      // get role list by refetching API
      queryClient.refetchQueries({ queryKey: [queryKeys.role_list] })
      dispatch(resetInitialState())
      handleCloseConfirmDeleteRole()
    } else if (isErrorDelete && messageDelete) {
      toast.error(t(messageDelete))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageDelete])

  return (
    <>
      {(loading || isPending) && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_role')}
        description={t('confirm_delete_role')}
        open={openConfirmationDeleteRole.open}
        handleClose={handleCloseConfirmDeleteRole}
        handleCancel={handleCloseConfirmDeleteRole}
        handleConfirm={handleDeleteRole}
      />
      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} roleId={openCreateEdit.id} />
      {isLoading && <Spinner />}
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
