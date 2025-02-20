// Import Next
import { NextPage } from 'next'

// Import components
import Spinner from 'src/components/spinner'
import InputSearch from 'src/components/input-search'
import ProductCard from '../product/components/ProductCard'
import NoData from 'src/components/no-data'
import CustomPagination from 'src/components/custom-pagination'

// Import Mui
import { Box, Grid, useTheme, styled, Tabs, TabsProps, Tab } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// react toast
import toast from 'react-hot-toast'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { resetInitialState } from 'src/stores/product'
import { AppDispatch, RootState } from 'src/stores'
import { getAllProductsLikedAsync, getAllProductsViewedAsync } from 'src/stores/product/actions'

// configs
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'

// types
import { TProduct } from 'src/types/product'
import SkeletonCard from '../product/components/SkeletonCard'

type TProps = {}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => {
  return {
    '&.MuiTabs-root': {
      borderBottom: 'none'
    }
  }
})

const TYPE_VALUE = {
  liked: '1',
  viewed: '2'
}

export const MyProductPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // react
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [loading, setLoading] = useState(false)
  const [searchBy, setSearchBy] = useState('')
  const [tabActive, seTabActive] = useState(TYPE_VALUE.viewed)
  const [typesOption, setTypesOption] = useState([
    {
      label: t('viewed_product'),
      value: TYPE_VALUE.viewed
    },
    {
      label: t('liked_product'),
      value: TYPE_VALUE.liked
    }
  ])

  // redux
  const {
    isLoading,
    viewedProducts,
    likedProducts,
    isSuccessLike,
    isErrorLike,
    messageLike,
    isSuccessUnLike,
    isErrorUnLike,
    messageUnLike,
    typeError
  } = useSelector((state: RootState) => state.product)
  const dispatch: AppDispatch = useDispatch()

  // handle
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    seTabActive(newValue)
    setPage(1)
    setPageSize(PAGE_SIZE_OPTION[0])
    setSearchBy('')
  }

  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  // fetch API
  const handleGetListProductLiked = () => {
    const query = {
      params: { limit: pageSize, search: searchBy }
    }
    dispatch(getAllProductsLikedAsync(query))
  }

  const handleGetListProductViewed = () => {
    const query = {
      params: { limit: pageSize, search: searchBy }
    }
    dispatch(getAllProductsViewedAsync(query))
  }

  const handleGetListData = () => {
    if (tabActive === TYPE_VALUE.liked) {
      handleGetListProductLiked()
    } else {
      handleGetListProductViewed()
    }
  }

  useEffect(() => {
    handleGetListData()
  }, [searchBy, tabActive])

  useEffect(() => {
    if (isSuccessLike) {
      toast.success(t('like_product_successfully'))
      dispatch(resetInitialState())
      handleGetListData()
    } else if (isErrorLike && messageLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('like_product_error'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessLike, isErrorLike, messageLike, typeError])

  useEffect(() => {
    if (isSuccessUnLike) {
      toast.success(t('unlike_product_successfully'))
      dispatch(resetInitialState())
      handleGetListData()
    } else if (isErrorUnLike && messageUnLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('unlike_product_error'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessUnLike, isErrorUnLike, messageUnLike, typeError])

  return (
    <>
      {(isLoading || loading) && <Spinner />}
      <Grid container>
        {/* Left side */}
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            py: '20px',
            px: 4
          }}
        >
          <Box sx={{ heigh: '100%', width: '100%' }}>
            <StyledTabs value={tabActive} onChange={handleChange} aria-label='wrapped label tabs'>
              {typesOption.map(opt => {
                return <Tab key={opt?.value} value={opt?.value} label={opt?.label} />
              })}
            </StyledTabs>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, width: '100%' }}>
              <Box sx={{ width: '240px' }}>
                <InputSearch
                  placeholder={t('search_product_name')}
                  value={searchBy}
                  onChange={(value: string) => {
                    setSearchBy(value)
                  }}
                />
              </Box>
            </Box>
          </Box>
          {tabActive === TYPE_VALUE.liked && (
            <Box sx={{ heigh: '100%', width: '100%', mt: 6 }}>
              {isLoading ? (
                <Grid container item md={12} xs={12} spacing={6} sx={{ width: '100%' }}>
                  {Array.from({ length: 6 }).map((_, index) => {
                    return (
                      <Grid item key={index} md={3} sm={6} xs={12}>
                        <SkeletonCard />
                      </Grid>
                    )
                  })}
                </Grid>
              ) : (
                <Grid container item md={12} xs={12} spacing={6} sx={{ width: '100%' }}>
                  {likedProducts?.data?.length > 0 ? (
                    likedProducts?.data.map((product: TProduct) => (
                      <Grid item key={product._id} md={3} sm={6} xs={12}>
                        <ProductCard item={product} />
                      </Grid>
                    ))
                  ) : (
                    <Box sx={{ width: '100%', mt: 10 }}>
                      <NoData widthImage='60px' heightImage='60px' textNodata={t('no_product')} />
                    </Box>
                  )}
                </Grid>
              )}
            </Box>
          )}
          {tabActive === TYPE_VALUE.viewed && (
            <Box sx={{ heigh: '100%', width: '100%', mt: 6 }}>
              {isLoading ? (
                <Grid container item md={12} xs={12} spacing={6} sx={{ width: '100%' }}>
                  {Array.from({ length: 6 }).map((_, index) => {
                    return (
                      <Grid item key={index} md={3} sm={6} xs={12}>
                        <SkeletonCard />
                      </Grid>
                    )
                  })}
                </Grid>
              ) : (
                <Grid container item md={12} xs={12} spacing={6}>
                  {viewedProducts?.data?.length > 0 ? (
                    viewedProducts?.data.map((product: TProduct) => (
                      <Grid item key={product._id} md={3} sm={6} xs={12}>
                        <ProductCard item={product} />
                      </Grid>
                    ))
                  ) : (
                    <Box sx={{ width: '100%', mt: 10 }}>
                      <NoData widthImage='60px' heightImage='60px' textNodata={t('no_product')} />
                    </Box>
                  )}
                </Grid>
              )}
            </Box>
          )}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CustomPagination
              pageSize={pageSize}
              page={page}
              rowLength={tabActive === TYPE_VALUE.liked ? likedProducts?.total : viewedProducts?.total}
              pageSizeOptions={PAGE_SIZE_OPTION}
              onChangePagination={handleOnChangePagination}
              isHideShowed
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default MyProductPage
