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

// config
import { OBJECT_TYPE_ERROR_USER } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// services

// utils
import { formatFilter, toFullName } from 'src/utils'

// hooks
import { usePermission } from 'src/hooks/usePermission'
import CreateEditUser from './component/CreateEditUser'
import TableHeader from 'src/components/table-header'
import { PERMISSIONS } from 'src/configs/permission'
import CustomSelect from 'src/components/custom-select'
import { getAllRoles } from 'src/services/role'
import { CONFIG_USER_TYPE, OBJECT_STATUS_USER, OBJECT_USER_TYPE } from 'src/configs/user'
import { getAllCities } from 'src/services/city'
import { getCountUserType } from 'src/services/report'
import UserCountCard from './component/UserCountCard'
import { Icon } from '@iconify/react/dist/iconify.js'

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
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [roleSelected, setRoleSelected] = useState<string[]>([])
  const [citySelected, setCitySelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState<string[]>([])
  const [typeSelected, setTypeSelected] = useState<string[]>([])
  const [countUserType, setCountUserType] = useState<{
    data: Record<number, number>
    totalUser: number
  }>({} as any)

  // const
  const CONSTANT_STATUS_USER = OBJECT_STATUS_USER()
  const CONSTANT_USER_TYPE = OBJECT_USER_TYPE()
  const userDataList = [
    {
      icon: 'tdesign:user-filled',
      userType: 4
    },
    {
      icon: 'logos:facebook',
      userType: CONFIG_USER_TYPE.FACEBOOK
    },
    {
      icon: 'flat-color-icons:google',
      userType: CONFIG_USER_TYPE.GOOGLE
    },
    {
      icon: 'logos:google-gmail',
      userType: CONFIG_USER_TYPE.DEFAULT
    }
  ]

  const mapUserType = {
    1: {
      title: t('Facebook'),
      icon: 'logos:facebook'
    },
    2: {
      title: t('Google'),
      icon: 'flat-color-icons:google'
    },
    3: {
      title: t('Email'),
      icon: 'logos:google-gmail',
      iconSize: 18
    }
  }

  // hooks
  const { VIEW, CREATE, UPDATE, DELETE } = usePermission('SYSTEM.USER', ['VIEW', 'CREATE', 'UPDATE', 'DELETE'])

  // redux
  const {
    users,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageCreateEdit,
    isLoading,
    isSuccessDelete,
    isErrorDelete,
    messageDelete,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageMultipleDelete,
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

        return <Typography>{row?.city?.name}</Typography>
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
      field: 'userType',
      headerName: t('User Type'),
      minWidth: 100,
      maxWidth: 100,
      renderCell: params => {
        const { row } = params

        return (
          <>
            {row.userType && (
              <Box>
                <Icon
                  icon={(mapUserType as any)?.[row.userType]?.icon}
                  fontSize={(mapUserType as any)?.[row.userType]?.iconSize || 24}
                />
              </Box>
            )}
          </>
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
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
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

  const handleDeleteUser = () => {
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
    setLoading(true)
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

  const fetchAllCities = async () => {
    await getAllCities({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.cities
        if (data) {
          setCitiesOption(
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

  const fetchCountUserType = async () => {
    setLoading(true)
    await getCountUserType()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountUserType({
          data: data?.data,
          totalUser: data?.total
        })
      })
      .catch(err => {
        setLoading(false)
      })
  }

  // side effects

  useEffect(() => {
    fetchAllRoles()
    fetchAllCities()
    fetchCountUserType()
  }, [])

  useEffect(() => {
    setFilterBy({ roleId: roleSelected, status: statusSelected, cityId: citySelected, userType: typeSelected })
  }, [roleSelected, statusSelected, citySelected, typeSelected])

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
    } else if (isErrorCreateEdit && messageCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_USER[typeError]
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
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_user_success'))
      handleGetListUser()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteUser()
    } else if (isErrorDelete && messageDelete) {
      toast.error(t('delete_user_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('delete_multiple_user_success'))
      handleGetListUser()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleUser()
    } else if (isErrorMultipleDelete && messageMultipleDelete) {
      toast.error(t('delete_multiple_user_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_user')}
        description={t('confirm_delete_user')}
        open={openConfirmationDeleteUser.open}
        handleClose={handleCloseConfirmDeleteUser}
        handleCancel={handleCloseConfirmDeleteUser}
        handleConfirm={handleDeleteUser}
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
      {/* count user type */}
      <Box
        sx={{
          backgroundColor: 'inherit',
          width: '100%',
          mb: 4
        }}
      >
        <Grid container spacing={6} sx={{ height: '100%' }}>
          {userDataList?.map((item: any, index: number) => {
            return (
              <Grid key={index} item xs={12} md={3} sm={6}>
                <UserCountCard {...item} countUserType={countUserType} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
      {/* count user type */}
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
          {!selectedRow?.length && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4, width: '100%', gap: 4 }}
            >
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  value={roleSelected}
                  options={roleOptions}
                  placeholder={t('Role')}
                  fullWidth
                  multiple
                  onChange={e => {
                    setRoleSelected(e.target.value as string[])
                  }}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  value={citySelected}
                  options={citiesOption}
                  placeholder={t('City')}
                  fullWidth
                  multiple
                  onChange={e => {
                    setCitySelected(e.target.value as string[])
                  }}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  value={statusSelected}
                  options={Object.values(CONSTANT_STATUS_USER)}
                  placeholder={t('Status')}
                  fullWidth
                  multiple
                  onChange={e => {
                    setStatusSelected(e.target.value as string[])
                  }}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  value={typeSelected}
                  options={Object.values(CONSTANT_USER_TYPE)}
                  placeholder={t('user_type')}
                  fullWidth
                  multiple
                  onChange={e => {
                    setTypeSelected(e.target.value as string[])
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
              actions={[{ label: t('delete'), value: 'delete', disabled: memoDisabledDeleteUser || !DELETE }]}
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
