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
import { resetInitialState } from 'src/stores/product-type'
import {
  getAllProductTypesAsync,
  deleteProductTypeAsync,
  deleteMultipleProductTypeAsync,
  createProductTypeAsync,
  updateProductTypeAsync
} from 'src/stores/product-type/actions'

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
import CreateEditProductType from './component/CreateEditProductType'

// react toast
import toast from 'react-hot-toast'

// config
import { OBJECT_TYPE_ERROR_PRODUCT_TYPE } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// services

// hooks
import { usePermission } from 'src/hooks/usePermission'

// utils
import { formatDate } from 'src/utils/date'

type TProps = {}

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

export const ProductTypeListPage: NextPage<TProps> = () => {
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
  const [openConfirmationDeleteProductType, setOpenConfirmationDeleteProductType] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteMultipleProductType, setOpenConfirmationDeleteMultipleProductType] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  // hooks
  const { VIEW, CREATE, UPDATE, DELETE } = usePermission('MANAGE_PRODUCT.PRODUCT_TYPE', [
    'VIEW',
    'CREATE',
    'UPDATE',
    'DELETE'
  ])

  // redux
  const {
    productTypes,
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
  } = useSelector((state: RootState) => state.productType)

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
      field: 'slug',
      headerName: t('Slug'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.slug}</Typography>
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
                  setOpenConfirmationDeleteProductType({
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
        rowLength={productTypes.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  // ****** Custom pagination

  // fetch API
  const handleGetListProductTypes = () => {
    const query = { params: { limit: pageSize, page: page, search: searchBy, order: sortBy } }
    dispatch(getAllProductTypesAsync(query))
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleCloseConfirmDeleteProductType = () => {
    setOpenConfirmationDeleteProductType({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleProductType = () => {
    setOpenConfirmationDeleteMultipleProductType(false)
  }

  const handleDeleteMultipleProductType = () => {
    dispatch(
      deleteMultipleProductTypeAsync({
        productTypeIds: selectedRow
      })
    )
  }

  const handleDeleteProductType = () => {
    dispatch(deleteProductTypeAsync(openConfirmationDeleteProductType.id))
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
        setOpenConfirmationDeleteMultipleProductType(true)
        break
      }
    }
  }

  // fetch api

  // side effects

  useEffect(() => {
    handleGetListProductTypes()
  }, [sortBy, searchBy, page, pageSize])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update_product_type_success'))
      } else {
        toast.success(t('create_product_type_success'))
      }
      handleGetListProductTypes()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT_TYPE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('update_product_type_error'))
        } else {
          toast.error(t('create_product_type_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_product_type_success'))
      handleGetListProductTypes()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteProductType()
    } else if (isErrorDelete && messageDelete) {
      toast.error(t('delete_product_type_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('delete_multiple_product_type_success'))
      handleGetListProductTypes()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleProductType()
    } else if (isErrorMultipleDelete && messageMultipleDelete) {
      toast.error(t('delete_multiple_product_type_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_product_type')}
        description={t('confirm_delete_product_type')}
        open={openConfirmationDeleteProductType.open}
        handleClose={handleCloseConfirmDeleteProductType}
        handleCancel={handleCloseConfirmDeleteProductType}
        handleConfirm={handleDeleteProductType}
      />
      <ConfirmationDialog
        title={t('title_multiple_delete_product_type')}
        description={t('confirm_multiple_delete_product_type')}
        open={openConfirmationDeleteMultipleProductType}
        handleClose={handleCloseConfirmDeleteMultipleProductType}
        handleCancel={handleCloseConfirmDeleteMultipleProductType}
        handleConfirm={handleDeleteMultipleProductType}
      />
      <CreateEditProductType
        open={openCreateEdit.open}
        onClose={handleCloseCreateEdit}
        productTypeId={openCreateEdit.id}
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
            rows={productTypes.data}
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

export default ProductTypeListPage
