// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Chip, ChipProps, Grid, styled, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useState } from 'react'

// Import redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/product'
import { getAllProductsAsync, deleteProductAsync, deleteMultipleProductAsync } from 'src/stores/product/actions'

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
import CreateEditProduct from './component/CreateEditProduct'

// react toast
import toast from 'react-hot-toast'

// config
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// services

// hooks
import { usePermission } from 'src/hooks/usePermission'

// utils
import { formatFilter, formatNumberToLocal } from 'src/utils'
import CustomSelect from 'src/components/custom-select'
import { OBJECT_STATUS_PRODUCT } from 'src/configs/product'
import { getAllProductTypes } from 'src/services/product-type'
import { formatDate } from 'src/utils/date'

type TProps = {}

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

export const ProductListPage: NextPage<TProps> = () => {
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
  const [openConfirmationDeleteProduct, setOpenConfirmationDeleteProduct] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteMultipleProduct, setOpenConfirmationDeleteMultipleProduct] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  const [typesOption, setTypesOption] = useState<{ label: string; value: string }[]>([])
  const [typeSelected, setTypeSelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState<string[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})

  const CONSTANT_STATUS_PRODUCT = OBJECT_STATUS_PRODUCT()

  // hooks
  const { VIEW, CREATE, UPDATE, DELETE } = usePermission('MANAGE_PRODUCT.PRODUCT', [
    'VIEW',
    'CREATE',
    'UPDATE',
    'DELETE'
  ])

  // redux
  const {
    products,
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
  } = useSelector((state: RootState) => state.product)

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
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.type?.name}</Typography>
      }
    },
    {
      field: 'price',
      headerName: t('Price'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{`${formatNumberToLocal(row?.price)} VND`}</Typography>
      }
    },
    {
      field: 'countInStock',
      headerName: t('count_in_stock'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.countInStock}</Typography>
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

        return <Typography>{formatDate(row?.createdAt)}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1,
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return (
          <Typography>
            {row.status ? <ActiveUserStyled label={t('Public')} /> : <DeactiveUserStyled label={t('Private')} />}
          </Typography>
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
                  setOpenConfirmationDeleteProduct({
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
        rowLength={products.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  // ****** Custom pagination

  // fetch API
  const handleGetListProducts = () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    dispatch(getAllProductsAsync(query))
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleCloseConfirmDeleteProduct = () => {
    setOpenConfirmationDeleteProduct({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleProduct = () => {
    setOpenConfirmationDeleteMultipleProduct(false)
  }

  const handleDeleteMultipleProduct = () => {
    dispatch(
      deleteMultipleProductAsync({
        productIds: selectedRow
      })
    )
  }

  const handleDeleteProduct = () => {
    dispatch(deleteProductAsync(openConfirmationDeleteProduct.id))
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
        setOpenConfirmationDeleteMultipleProduct(true)
        break
      }
    }
  }

  // fetch api
  const fetchAllTypes = async () => {
    setLoading(true)
    await getAllProductTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.productTypes
        if (data) {
          setTypesOption(
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
    handleGetListProducts()
  }, [sortBy, searchBy, page, pageSize, filterBy])

  useEffect(() => {
    fetchAllTypes()
  }, [])

  useEffect(() => {
    setFilterBy({ productType: typeSelected, status: statusSelected })
  }, [typeSelected, statusSelected])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update_product_success'))
      } else {
        toast.success(t('create_product_success'))
      }
      handleGetListProducts()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('update_product_error'))
        } else {
          toast.error(t('create_product_error'))
        }
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_product_success'))
      handleGetListProducts()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteProduct()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('delete_product_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('delete_multiple_product_success'))
      handleGetListProducts()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleProduct()
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('delete_multiple_product_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_product')}
        description={t('confirm_delete_product')}
        open={openConfirmationDeleteProduct.open}
        handleClose={handleCloseConfirmDeleteProduct}
        handleCancel={handleCloseConfirmDeleteProduct}
        handleConfirm={handleDeleteProduct}
      />
      <ConfirmationDialog
        title={t('title_multiple_delete_product')}
        description={t('confirm_multiple_delete_product')}
        open={openConfirmationDeleteMultipleProduct}
        handleClose={handleCloseConfirmDeleteMultipleProduct}
        handleCancel={handleCloseConfirmDeleteMultipleProduct}
        handleConfirm={handleDeleteMultipleProduct}
      />
      <CreateEditProduct open={openCreateEdit.open} onClose={handleCloseCreateEdit} productId={openCreateEdit.id} />
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
                  value={typeSelected}
                  options={typesOption}
                  placeholder={t('Product_type')}
                  fullWidth
                  multiple
                  onChange={e => {
                    setTypeSelected(e.target.value as string[])
                  }}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  value={statusSelected}
                  options={Object.values(CONSTANT_STATUS_PRODUCT)}
                  placeholder={t('Status')}
                  fullWidth
                  multiple
                  onChange={e => {
                    setStatusSelected(e.target.value as string[])
                  }}
                />
              </Box>
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
            rows={products.data}
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

export default ProductListPage
