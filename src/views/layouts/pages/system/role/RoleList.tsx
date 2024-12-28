// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Button, Grid, useTheme } from '@mui/material'
import { GridColDef, GridRowClassNameParams, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useState } from 'react'

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
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'
import { PERMISSIONS } from 'src/configs/permission'

// services
import { getDetailsRole } from 'src/services/role'

// utils
import { getAllObjectValues } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermission } from 'src/hooks/usePermission'

type TProps = {}

export const RoleListPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

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

  // redux
  const {
    roles,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageErrorCreateEdit,
    isLoading,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.role)

  // redux
  const dispatch: AppDispatch = useDispatch()

  // translate
  const { t } = useTranslation()

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
                    setOpenCreateEdit({
                      open: true,
                      id: String(params.id)
                    })
                  }}
                />
                <GridDelete
                  disabled={!DELETE}
                  onClick={() => {
                    console.log('click')
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
  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  // Handler
  const handleOnChangePagination = () => {}

  const handleCloseConfirmDeleteRole = () => {
    setOpenConfirmationDeleteRole({
      open: false,
      id: ''
    })
  }

  const handleDeleteRole = () => {
    dispatch(deleteRoleAsync(openConfirmationDeleteRole.id))
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`)
  }

  const handleUpdateRole = () => {
    dispatch(updateRoleAsync({ name: selectedRow.name, id: selectedRow.id, permissions: selectedPermission }))
  }

  // fetch api
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
            setSelectedPermission(PERMISSIONS.DASHBOARD)
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
    handleGetListRoles()
  }, [sortBy, searchBy])

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
      handleGetListRoles()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
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
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_role_success'))
      handleGetListRoles()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteRole()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t(messageErrorDelete))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <Spinner />}
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
          maxHeight: '100%'
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
              rows={roles.data}
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
              disableColumnMenu
              hideFooter
              onRowClick={row => {
                setSelectedRow({
                  id: String(row.id),
                  name: row?.row?.name
                })
                setOpenCreateEdit({
                  open: false,
                  id: String(row.id)
                })
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
