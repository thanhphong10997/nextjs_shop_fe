// Import Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// Import Mui
import { Box, useTheme, Tab, styled, Tabs, TabsProps } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// hooks
import { useAuth } from 'src/hooks/useAuth'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { getAllOrderProductsByMeAsync } from 'src/stores/order-product/actions'

// components
import NoData from 'src/components/no-data'
import OrderCard from './components/OrderCard'
import CustomPagination from 'src/components/custom-pagination'
import Spinner from 'src/components/spinner'
import InputSearch from 'src/components/input-search'

// others
import { TItemOrderProductMe } from 'src/types/order-product'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/order-product'

type TProps = {}

const OPTION_STATUS_VALUE = {
  WAIT_PAYMENT: 0,
  WAIT_DELIVERY: 1,
  DONE: 2,
  CANCEL: 3,
  ALL: 4

  // 0: wait payment, 1: wait delivery, 2: done, 3, cancel
}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => {
  return {
    '&.MuiTabs-root': {
      borderBottom: 'none'
    }
  }
})

export const MyOrderPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // auth
  const { user } = useAuth()

  // translate
  const { t, i18n } = useTranslation()

  // router
  const router = useRouter()

  // const
  const OPTIONS_STATUS = [
    ,
    {
      label: t('all'),
      value: OPTION_STATUS_VALUE.ALL
    },
    {
      label: t('wait_payment'),
      value: OPTION_STATUS_VALUE.WAIT_PAYMENT
    },
    {
      label: t('wait_delivery'),
      value: OPTION_STATUS_VALUE.WAIT_DELIVERY
    },
    {
      label: t('done'),
      value: OPTION_STATUS_VALUE.DONE
    },
    {
      label: t('cancel_order'),
      value: OPTION_STATUS_VALUE.CANCEL
    }
  ]

  // react
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [statusSelected, setStatusSelected] = useState(OPTION_STATUS_VALUE.ALL)
  const [searchBy, setSearchBy] = useState('')

  // redux
  const { ordersOfMe, isLoading, isSuccessCancelMe, isErrorCancelMe, messageErrorCancelMe, typeError } = useSelector(
    (state: RootState) => state.orderProduct
  )
  const dispatch: AppDispatch = useDispatch()

  // handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setStatusSelected(+newValue)
  }

  // fetch API
  const handleGetListOrdersOfMe = () => {
    const query = {
      params: {
        limit: pageSize,
        page: page,
        status: statusSelected === OPTION_STATUS_VALUE.ALL ? '' : statusSelected,
        search: searchBy
      }
    }
    dispatch(getAllOrderProductsByMeAsync(query))
  }

  // side Effects

  useEffect(() => {
    handleGetListOrdersOfMe()
  }, [page, pageSize, statusSelected, searchBy])

  useEffect(() => {
    if (isSuccessCancelMe) {
      toast.success(t('cancel_order_success'))
      handleGetListOrdersOfMe()
      dispatch(resetInitialState())
    } else if (isErrorCancelMe && messageErrorCancelMe) {
      toast.error(t('cancel_order_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessCancelMe, isErrorCancelMe, messageErrorCancelMe])

  return (
    <>
      {(isLoading || loading) && <Spinner />}
      <StyledTabs value={statusSelected} onChange={handleChange} aria-label='wrapped label tabs example'>
        {OPTIONS_STATUS.map(opt => {
          return <Tab key={opt?.value} value={opt?.value} label={opt?.label} />
        })}
      </StyledTabs>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 4 }}>
        <Box sx={{ width: '240px' }}>
          <InputSearch
            placeholder={t('search_product_name')}
            value={searchBy}
            onChange={(value: string) => setSearchBy(value)}
          />
        </Box>
      </Box>
      <Box>
        {ordersOfMe?.data?.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px', margin: '1rem 0' }}>
            {ordersOfMe?.data?.map((item: TItemOrderProductMe) => {
              return <OrderCard key={item?._id} dataOrder={item} />
            })}
          </Box>
        ) : (
          <Box sx={{ width: '100%', padding: '20px' }}>
            {' '}
            <NoData widthImage='100px' heightImage='100px' textNodata={t('no_product')} />
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 4 }}>
        <CustomPagination
          pageSize={pageSize}
          page={page}
          rowLength={ordersOfMe?.total}
          pageSizeOptions={PAGE_SIZE_OPTION}
          onChangePagination={handleOnChangePagination}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default MyOrderPage
