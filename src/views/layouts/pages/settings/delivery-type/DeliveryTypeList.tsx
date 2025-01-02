// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useState } from 'react'

// Import redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/delivery-type'
import {
  getAllDeliveryTypesAsync,
  deleteDeliveryTypeAsync,
  deleteMultipleDeliveryTypeAsync,
  createDeliveryTypeAsync,
  updateDeliveryTypeAsync
} from 'src/stores/delivery-type/actions'

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
import TableHeader from 'src/components/table-header'
import CreateEditDeliveryType from './component/CreateEditDeliveryType'

// react toast
import toast from 'react-hot-toast'

// config
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// services

// hooks
import { usePermission } from 'src/hooks/usePermission'

// utils
import { formatDate } from 'src/utils'

type TProps = {}

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

export const DeliveryTypeListPage: NextPage<TProps> = () => {
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
  const [openConfirmationDeleteCity, setOpenConfirmationDeleteCity] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteMultipleCity, setOpenConfirmationDeleteMultipleCity] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  // hooks
  const { VIEW, CREATE, UPDATE, DELETE } = usePermission('SETTING.DELIVERY_TYPE', [
    'VIEW',
    'CREATE',
    'UPDATE',
    'DELETE'
  ])

  // redux
  const {
    deliveryTypes,
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
  } = useSelector((state: RootState) => state.deliveryType)

  // redux
  const dispatch: AppDispatch = useDispatch()

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.name}</Typography>
      }
    },
    {
      field: 'createdAt',
      headerName: t('Created_date'),
      flex: 1,
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return <Typography>{formatDate(row?.createdAt, { dateStyle: 'short' })}</Typography>
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
                  setOpenConfirmationDeleteCity({
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
        rowLength={deliveryTypes.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  // ****** Custom pagination

  // fetch API
  const handleGetListDeliveryTypes = () => {
    const query = { params: { limit: pageSize, page: page, search: searchBy, order: sortBy } }
    dispatch(getAllDeliveryTypesAsync(query))
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleCloseConfirmDeleteCity = () => {
    setOpenConfirmationDeleteCity({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleCity = () => {
    setOpenConfirmationDeleteMultipleCity(false)
  }

  const handleDeleteMultipleCity = () => {
    dispatch(
      deleteMultipleDeliveryTypeAsync({
        deliveryTypeIds: selectedRow
      })
    )
  }

  const handleDeleteCity = () => {
    dispatch(deleteDeliveryTypeAsync(openConfirmationDeleteCity.id))
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
        setOpenConfirmationDeleteMultipleCity(true)
        break
      }
    }
  }

  // fetch api

  // side effects

  useEffect(() => {
    handleGetListDeliveryTypes()
  }, [sortBy, searchBy, page, pageSize])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update_delivery_type_success'))
      } else {
        toast.success(t('create_delivery_type_success'))
      }
      handleGetListDeliveryTypes()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('update_delivery_type_error'))
        } else {
          toast.error(t('create_delivery_type_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_delivery_type_success'))
      handleGetListDeliveryTypes()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteCity()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('delete_delivery_type_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('delete_multiple_delivery_type_success'))
      handleGetListDeliveryTypes()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleCity()
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('delete_multiple_delivery_type_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_delivery_type')}
        description={t('confirm_delete_delivery_type')}
        open={openConfirmationDeleteCity.open}
        handleClose={handleCloseConfirmDeleteCity}
        handleCancel={handleCloseConfirmDeleteCity}
        handleConfirm={handleDeleteCity}
      />
      <ConfirmationDialog
        title={t('title_multiple_delete_delivery_type')}
        description={t('confirm_multiple_delete_delivery_type')}
        open={openConfirmationDeleteMultipleCity}
        handleClose={handleCloseConfirmDeleteMultipleCity}
        handleCancel={handleCloseConfirmDeleteMultipleCity}
        handleConfirm={handleDeleteMultipleCity}
      />
      <CreateEditDeliveryType
        open={openCreateEdit.open}
        onClose={handleCloseCreateEdit}
        deliveryTypeId={openCreateEdit.id}
      />
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
              actions={[{ label: t('delete'), value: 'delete', disabled: !DELETE }]}
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
            rows={deliveryTypes.data}
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
            rowSelectionModel={selectedRow}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              setSelectedRow(row as string[])
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

export default DeliveryTypeListPage
