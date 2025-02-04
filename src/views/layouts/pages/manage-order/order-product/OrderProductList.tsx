// Import Next
import { NextPage } from 'next'

// Import Mui
import { Avatar, AvatarGroup, Box, Chip, ChipProps, Grid, styled, Typography, useTheme } from '@mui/material'
import { GridColDef, GridSortModel } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useMemo, useState } from 'react'

// Import redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/order-product'

// translate
import { useTranslation } from 'react-i18next'

// config
// import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// Components
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import CustomPagination from 'src/components/custom-pagination'
import CustomDataGrid from 'src/components/custom-data-grid'
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
import CustomSelect from 'src/components/custom-select'
import { getAllCities } from 'src/services/city'
import { deleteOrderProductAsync, getAllOrderProductsAsync } from 'src/stores/order-product/actions'
import { PRODUCT_ORDER_STATUS } from 'src/configs/orderProduct'
import { TItemOrderProduct } from 'src/types/order-product'
import EditOrderProduct from './components/EditOrderProduct'

type TProps = {}

type StatusOrderChip = ChipProps & {
  background: string
}

const OrderStatusStyled = styled(Chip)<StatusOrderChip>(({ theme, background }) => {
  return {
    backgroundColor: background,
    color: theme.palette.common.white,
    fontSize: '14px',
    fontWeight: 400,
    padding: '8px 4px'
  }
})

export const OrderProductListPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // CONST
  const PRODUCT_ORDER_STATUS_STYLE = {
    0: {
      label: 'wait_payment',
      background: theme.palette.warning.main
    },
    1: {
      label: 'wait_delivery',
      background: theme.palette.secondary.main
    },
    2: {
      label: 'done_order',
      background: theme.palette.success.main
    },
    3: {
      label: 'canceled_order',
      background: theme.palette.error.main
    }
  }

  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openEdit, setOpenEdit] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteOrderProduct, setOpenConfirmationDeleteOrderProduct] = useState({
    open: false,
    id: ''
  })
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [citySelected, setCitySelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState<string[]>([])

  // hooks
  const { VIEW, UPDATE, DELETE } = usePermission('SYSTEM.MANAGE_ORDER_ORDER', ['VIEW', 'UPDATE', 'DELETE'])

  // redux
  const {
    orderProducts,
    isLoading,
    isSuccessEdit,
    isErrorEdit,
    messageErrorEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,

    typeError
  } = useSelector((state: RootState) => state.orderProduct)

  // redux
  const dispatch: AppDispatch = useDispatch()

  const columns: GridColDef[] = [
    {
      field: 'items',
      headerName: t('product_items'),
      hideSortIcons: true,
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return (
          <AvatarGroup max={1} total={row?.orderItems?.length}>
            {row?.orderItems?.map((item: TItemOrderProduct) => {
              return <Avatar key={item?.product?._id} alt={item?.product?.slug} src={item?.image} />
            })}
          </AvatarGroup>
        )
      }
    },
    {
      field: 'full_name',
      headerName: t('full_name'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.shippingAddress?.fullName}</Typography>
      }
    },
    {
      field: 'totalPrice',
      headerName: t('total_price'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.totalPrice}</Typography>
      }
    },
    {
      field: 'phoneNumber',
      headerName: t('phone_number'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.shippingAddress?.phone}</Typography>
      }
    },
    {
      field: 'city',
      headerName: t('city'),
      hideSortIcons: true,
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.shippingAddress?.city?.name}</Typography>
      }
    },

    {
      field: 'status',
      headerName: t('Status'),
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params
        console.log('row', { row })

        return (
          <>
            {
              <OrderStatusStyled
                background={(PRODUCT_ORDER_STATUS_STYLE as any)[row?.status]?.background}
                label={t((PRODUCT_ORDER_STATUS_STYLE as any)[row?.status]?.label)}
              />
            }
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
                  setOpenEdit({
                    open: true,
                    id: String(params.id)
                  })
                }}
              />
              <GridDelete
                disabled={!DELETE}
                onClick={() => {
                  setOpenConfirmationDeleteOrderProduct({
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
        rowLength={orderProducts.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  // ****** Custom pagination

  // fetch API
  const handleGetListOrderProduct = () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    dispatch(getAllOrderProductsAsync(query))
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleCloseConfirmDeleteOrderProduct = () => {
    setOpenConfirmationDeleteOrderProduct({
      open: false,
      id: ''
    })
  }

  const handleDeleteOrderProduct = () => {
    dispatch(deleteOrderProductAsync(openConfirmationDeleteOrderProduct.id))
  }

  const handleCloseEdit = () => {
    setOpenEdit({
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

  // fetch api

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

  const memoStatusOption = useMemo(() => {
    return Object.values(PRODUCT_ORDER_STATUS)?.map(item => ({
      label: t(item?.label),
      value: item?.value
    }))
  }, [])

  // side effects

  useEffect(() => {
    fetchAllCities()
  }, [])

  useEffect(() => {
    setFilterBy({ status: statusSelected, cityId: citySelected })
  }, [statusSelected, citySelected])

  useEffect(() => {
    handleGetListOrderProduct()
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])

  useEffect(() => {
    if (isSuccessEdit) {
      toast.success(t('update_order_product_success'))
      handleGetListOrderProduct()
      handleCloseEdit()
      dispatch(resetInitialState())
    } else if (isErrorEdit && messageErrorEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_USER[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('update_order_product_error'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessEdit, isErrorEdit, messageErrorEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_order_product_success'))
      handleGetListOrderProduct()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteOrderProduct()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('delete_order_product_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_order_product')}
        description={t('confirm_delete_order_product')}
        open={openConfirmationDeleteOrderProduct.open}
        handleClose={handleCloseConfirmDeleteOrderProduct}
        handleCancel={handleCloseConfirmDeleteOrderProduct}
        handleConfirm={handleDeleteOrderProduct}
      />

      <EditOrderProduct open={openEdit.open} onClose={handleCloseEdit} orderId={openEdit.id} />
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4, width: '100%', gap: 4 }}>
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
                options={memoStatusOption}
                placeholder={t('Status')}
                fullWidth
                multiple
                onChange={e => {
                  setStatusSelected(e.target.value as string[])
                }}
              />
            </Box>
            <Box sx={{ width: '200px' }}>
              <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
            </Box>
          </Box>

          <CustomDataGrid
            sx={
              {
                // '.row-selected': {
                //   backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)}`,
                //   color: `${theme.palette.primary.main}`
                // }
              }
            }
            rows={orderProducts.data}
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
            slots={{
              pagination: PaginationComponent
            }}
          />
        </Grid>
      </Box>
    </>
  )
}

export default OrderProductListPage
