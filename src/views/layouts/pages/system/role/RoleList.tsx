// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Grid, useTheme } from '@mui/material'
import { DataGrid, GridColDef, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useState } from 'react'

// Import redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { deleteRoleAsync, getAllRolesAsync } from 'src/stores/role/actions'
import { resetInitialState } from 'src/stores/role'

// translate
import { useTranslation } from 'react-i18next'

// config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// Components
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import CustomPagination from 'src/components/custom-pagination'
import CustomDataGrid from 'src/components/custom-data-grid'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './component/CreateEditRole'
import Spinner from 'src/components/spinner'

// react toast
import toast from 'react-hot-toast'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { Icon } from '@iconify/react/dist/iconify.js'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'
import TablePermission from './component/TablePermission'

type TProps = {}

export const RoleListPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
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
                  onClick={() => {
                    setOpenCreateEdit({
                      open: true,
                      id: String(params.id)
                    })
                  }}
                />
                <GridDelete
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

  const PaginationComponent = () => {
    return (
      <CustomPagination
        pageSize={pageSize}
        page={page}
        rowLength={roles.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

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

  useEffect(() => {
    handleGetListRoles()
  }, [sortBy, searchBy])

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
        <Grid container sx={{ height: '100%', width: '100%' }} spacing={10}>
          <Grid item md={4} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
              </Box>
              <GridCreate
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }
              />
            </Box>
            <CustomDataGrid
              rows={roles.data}
              columns={columns}
              autoHeight
              getRowId={row => row._id}
              pageSizeOptions={[5]}
              sortingMode='server'
              onSortModelChange={handleSort}
              sortingOrder={['desc', 'asc']}
              disableRowSelectionOnClick
              disableColumnFilter
              disableColumnMenu
              hideFooter
              slots={{
                pagination: PaginationComponent
              }}
            />
          </Grid>
          <Grid item md={8} xs={12}>
            <TablePermission />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
