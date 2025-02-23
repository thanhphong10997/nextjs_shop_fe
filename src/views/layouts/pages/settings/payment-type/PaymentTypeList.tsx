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
import { resetInitialState } from 'src/stores/payment-type'
import {
  getAllPaymentTypesAsync,
  deletePaymentTypeAsync,
  deleteMultiplePaymentTypeAsync,
  createPaymentTypeAsync,
  updatePaymentTypeAsync
} from 'src/stores/payment-type/actions'

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
import CreateEditPaymentType from './component/CreateEditPaymentType'

// react toast
import toast from 'react-hot-toast'

// config
import { OBJECT_TYPE_ERROR_PAYMENT } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { PAYMENT_TYPES } from 'src/configs/payment'

// services

// hooks
import { usePermission } from 'src/hooks/usePermission'

// utils
import { formatDate } from 'src/utils/date'

type TProps = {}

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

export const PaymentTypeListPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  const ObjectPaymentType: any = PAYMENT_TYPES()

  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeletePaymentType, setOpenConfirmationDeletePaymentType] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteMultiplePaymentType, setOpenConfirmationDeleteMultiplePaymentType] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  // hooks
  const { VIEW, CREATE, UPDATE, DELETE } = usePermission('SETTING.PAYMENT_TYPE', ['VIEW', 'CREATE', 'UPDATE', 'DELETE'])

  // redux
  const {
    paymentTypes,
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
  } = useSelector((state: RootState) => state.paymentType)

  // redux
  const dispatch: AppDispatch = useDispatch()

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.name}</Typography>
      }
    },
    {
      field: 'type',
      headerName: t('Type'),
      flex: 1,
      minWidth: 220,
      maxWidth: 220,
      renderCell: params => {
        const { row } = params

        return <Typography>{ObjectPaymentType[row?.type]?.label}</Typography>
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
                  setOpenConfirmationDeletePaymentType({
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
        rowLength={paymentTypes.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  // ****** Custom pagination

  // fetch API
  const handleGetListPaymentTypes = () => {
    const query = { params: { limit: pageSize, page: page, search: searchBy, order: sortBy } }
    dispatch(getAllPaymentTypesAsync(query))
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleCloseConfirmDeletePaymentType = () => {
    setOpenConfirmationDeletePaymentType({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultiplePaymentType = () => {
    setOpenConfirmationDeleteMultiplePaymentType(false)
  }

  const handleDeleteMultiplePaymentType = () => {
    dispatch(
      deleteMultiplePaymentTypeAsync({
        paymentTypeIds: selectedRow
      })
    )
  }

  const handleDeletePaymentType = () => {
    dispatch(deletePaymentTypeAsync(openConfirmationDeletePaymentType.id))
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
        setOpenConfirmationDeleteMultiplePaymentType(true)
        break
      }
    }
  }

  // fetch api

  // side effects

  useEffect(() => {
    handleGetListPaymentTypes()
  }, [sortBy, searchBy, page, pageSize])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update_payment_type_success'))
      } else {
        toast.success(t('create_payment_type_success'))
      }
      handleGetListPaymentTypes()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PAYMENT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('update_payment_type_error'))
        } else {
          toast.error(t('create_payment_type_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_payment_type_success'))
      handleGetListPaymentTypes()
      dispatch(resetInitialState())
      handleCloseConfirmDeletePaymentType()
    } else if (isErrorDelete && messageDelete) {
      toast.error(t('delete_payment_type_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('delete_multiple_payment_type_success'))
      handleGetListPaymentTypes()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultiplePaymentType()
    } else if (isErrorMultipleDelete && messageMultipleDelete) {
      toast.error(t('delete_multiple_payment_type_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_payment_type')}
        description={t('confirm_delete_payment_type')}
        open={openConfirmationDeletePaymentType.open}
        handleClose={handleCloseConfirmDeletePaymentType}
        handleCancel={handleCloseConfirmDeletePaymentType}
        handleConfirm={handleDeletePaymentType}
      />
      <ConfirmationDialog
        title={t('title_multiple_delete_payment_type')}
        description={t('confirm_multiple_delete_payment_type')}
        open={openConfirmationDeleteMultiplePaymentType}
        handleClose={handleCloseConfirmDeleteMultiplePaymentType}
        handleCancel={handleCloseConfirmDeleteMultiplePaymentType}
        handleConfirm={handleDeleteMultiplePaymentType}
      />
      <CreateEditPaymentType
        open={openCreateEdit.open}
        onClose={handleCloseCreateEdit}
        paymentTypeId={openCreateEdit.id}
      />
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
          {!selectedRow?.length && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4, width: '100%', gap: 4 }}
            >
              {!selectedRow?.length && (
                <Box sx={{ width: '200px' }}>
                  <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
                </Box>
              )}
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
            rows={paymentTypes.data}
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

export default PaymentTypeListPage
