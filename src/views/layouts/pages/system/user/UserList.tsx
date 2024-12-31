// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Chip, ChipProps, Grid, styled, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useMemo, useState } from 'react'

// Import redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/user'
import { deleteMultipleUserAsync, deleteUserAsync, getAllUsersAsync } from 'src/stores/user/actions'

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
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'

// react toast
import toast from 'react-hot-toast'

// icon
import { Icon } from '@iconify/react/dist/iconify.js'

// config
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// services

// utils
import { toFullName } from 'src/utils'

// hooks
import { usePermission } from 'src/hooks/usePermission'
import CreateEditUser from './component/CreateEditUser'
import TableHeader from 'src/components/table-header'
import { PERMISSIONS } from 'src/configs/permission'
import CustomSelect from 'src/components/custom-select'
import { getAllRoles } from 'src/services/role'
import { OBJECT_STATUS_USER } from 'src/configs/user'

type TProps = {}

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

const ActiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => {
  return {
    backgroundColor: '#28c76f29',
    color: '#3a8431',
    fontSize: '14px',
    fontWeight: 400,
    padding: '8px 4px'
  }
})

const DeactiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => {
  return {
    backgroundColor: '#da251d29',
    color: '#da251d',
    fontSize: '14px',
    fontWeight: 400,
    padding: '8px 4px'
  }
})

export const UserListPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteUser, setOpenConfirmationDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteMultipleUser, setOpenConfirmationDeleteMultipleUser] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TSelectedRow[]>([])
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string>>({})
  const [roleSelected, setRoleSelected] = useState('')
  const [statusSelected, setStatusSelected] = useState('')

  const CONSTANT_STATUS_USER = OBJECT_STATUS_USER()

  // hooks
  const { VIEW, CREATE, UPDATE, DELETE } = usePermission('SYSTEM.USER', ['VIEW', 'CREATE', 'UPDATE', 'DELETE'])

  // redux
  const {
    users,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageErrorCreateEdit,
    isLoading,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete,
    typeError
  } = useSelector((state: RootState) => state.user)

  // redux
  const dispatch: AppDispatch = useDispatch()

  const columns: GridColDef[] = [
    {
      field: i18n.language === 'vi' ? 'lastName' : 'firstName',
      headerName: t('Full_name'),
      flex: 1,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params
        const fullName = toFullName(row?.lastName || '', row?.middleName || '', row?.firstName || '', i18n.language)

        return <Typography>{fullName}</Typography>
      }
    },
    {
      field: 'email',
      headerName: t('Email'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.email}</Typography>
      }
    },
    {
      field: 'role',
      headerName: t('Role'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber',
      headerName: t('Phone_number'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.phoneNumber}</Typography>
      }
    },
    {
      field: 'city',
      headerName: t('City'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.city}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('Status'),
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return (
          <>{row.status ? <ActiveUserStyled label={t('Active')} /> : <DeactiveUserStyled label={t('Blocking')} />}</>
        )
      }
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
                  setOpenConfirmationDeleteUser({
                    open: true,
                    id: String(params.id)
                  })
                }}
              />
            </Box>
          </Box>
        )
      }
    }
  ]

  // ****** Custom pagination

  const PaginationComponent = () => {
    return (
      <CustomPagination
        pageSize={pageSize}
        page={page}
        rowLength={users.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  // ****** Custom pagination

  // fetch API
  const handleGetListUser = () => {
    const query = { params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...filterBy } }
    dispatch(getAllUsersAsync(query))
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleCloseConfirmDeleteUser = () => {
    setOpenConfirmationDeleteUser({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleUser = () => {
    setOpenConfirmationDeleteMultipleUser(false)
  }

  const handleDeleteMultipleUser = () => {
    dispatch(
      deleteMultipleUserAsync({
        userIds: selectedRow.map(row => row.id)
      })
    )
  }

  const handleDeleteRole = () => {
    dispatch(deleteUserAsync(openConfirmationDeleteUser.id))
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('createdAt desc')
    }
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenConfirmationDeleteMultipleUser(true)
        console.log('selectedRow', { selectedRow })
        break
      }
    }
  }

  const memoDisabledDeleteUser = useMemo(() => {
    return selectedRow.some((item: TSelectedRow) => item?.role?.permissions?.includes(PERMISSIONS.ADMIN))
  }, [selectedRow])

  // fetch api

  const fetchAllRoles = async () => {
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.roles
        if (data) {
          setRoleOptions(
            data?.map((item: { name: string; _id: string }) => {
              return {
                label: item?.name,
                value: item?._id
              }
            })
          )
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // side effects

  useEffect(() => {
    fetchAllRoles()
  }, [])

  useEffect(() => {
    setFilterBy({ roleId: roleSelected, status: statusSelected })
  }, [roleSelected, statusSelected])

  useEffect(() => {
    handleGetListUser()
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update_user_success'))
      } else {
        toast.success(t('create_user_success'))
      }
      handleGetListUser()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('update_user_error'))
        } else {
          toast.error(t('create_user_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_user_success'))
      handleGetListUser()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteUser()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('delete_user_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('delete_multiple_user_success'))
      handleGetListUser()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleUser()
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('delete_multiple_user_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_user')}
        description={t('confirm_delete_user')}
        open={openConfirmationDeleteUser.open}
        handleClose={handleCloseConfirmDeleteUser}
        handleCancel={handleCloseConfirmDeleteUser}
        handleConfirm={handleDeleteRole}
      />
      <ConfirmationDialog
        title={t('title_multiple_delete_user')}
        description={t('confirm_multiple_delete_user')}
        open={openConfirmationDeleteMultipleUser}
        handleClose={handleCloseConfirmDeleteMultipleUser}
        handleCancel={handleCloseConfirmDeleteMultipleUser}
        handleConfirm={handleDeleteMultipleUser}
      />
      <CreateEditUser open={openCreateEdit.open} onClose={handleCloseCreateEdit} userId={openCreateEdit.id} />
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
          {!selectedRow?.length && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4, width: '100%', gap: 4 }}
            >
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  value={statusSelected}
                  options={Object.values(CONSTANT_STATUS_USER)}
                  placeholder={t('Status')}
                  fullWidth
                  onChange={e => {
                    setStatusSelected(e.target.value as string)
                  }}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  value={roleSelected}
                  options={roleOptions}
                  placeholder={t('Role')}
                  fullWidth
                  onChange={e => {
                    setRoleSelected(e.target.value as string)
                  }}
                />
              </Box>
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
          )}
          {selectedRow.length > 0 && (
            <TableHeader
              numRow={selectedRow?.length}
              onClear={() => setSelectedRow([])}
              actions={[{ label: t('delete'), value: 'delete', disabled: memoDisabledDeleteUser }]}
              handleAction={handleAction}
            />
          )}
          <CustomDataGrid
            sx={
              {
                // '.row-selected': {
                //   backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)}`,
                //   color: `${theme.palette.primary.main}`
                // }
              }
            }
            rows={users.data}
            columns={columns}
            checkboxSelection
            autoHeight
            getRowId={row => row._id}
            pageSizeOptions={[5]}
            sortingMode='server'
            onSortModelChange={handleSort}
            sortingOrder={['desc', 'asc']}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnMenu
            rowSelectionModel={selectedRow?.map(item => item.id)}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              const formatData: any = row.map(id => {
                const findRow: any = users.data?.find((item: any) => item._id === id)
                if (findRow) {
                  return { id: findRow._id, role: findRow?.role }
                }
              })
              setSelectedRow(formatData)
            }}
            onRowClick={row => {
              // setOpenCreateEdit({
              //   open: true,
              //   id: String(row.id)
              // })
            }}
            slots={{
              pagination: PaginationComponent
            }}
          />
        </Grid>
      </Box>
    </>
  )
}

export default UserListPage
