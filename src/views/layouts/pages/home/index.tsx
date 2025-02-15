// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Grid, Skeleton, styled, Tab, Tabs, TabsProps, Typography, useTheme } from '@mui/material'

// Import React
import React, { useEffect, useRef, useState } from 'react'

// translate
import { useTranslation } from 'react-i18next'

// Components

import CustomPagination from 'src/components/custom-pagination'
import Spinner from 'src/components/spinner'
import ProductCard from '../product/components/ProductCard'
import InputSearch from 'src/components/input-search'
import ProductFilter from '../product/components/ProductFilter'

// config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// services
import { getAllProductTypes } from 'src/services/product-type'
import { getAllProductsPublic } from 'src/services/product'
import { getAllCities } from 'src/services/city'

// types
import { TProduct } from 'src/types/product'

// utils
import { formatFilter } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/product'
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'
import NoData from 'src/components/no-data'
import CustomSelect from 'src/components/custom-select'
import SkeletonCard from '../product/components/SkeletonCard'

type TProps = {}

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => {
  return {
    '&.MuiTabs-root': {
      borderBottom: 'none'
    }
  }
})

export const HomePage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // redux
  const {
    isSuccessLike,
    isErrorLike,
    messageErrorLike,
    isSuccessUnLike,
    isErrorUnLike,
    messageErrorUnLike,
    typeError,
    isLoading
  } = useSelector((state: RootState) => state.product)
  const dispatch: AppDispatch = useDispatch()

  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])

  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)

  const [typesOption, setTypesOption] = useState<{ label: string; value: string }[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [productsPublic, setProductsPublic] = useState({
    data: [],
    total: 0
  })

  const [productTypeSelected, setProductTypeSelected] = React.useState('')
  const [reviewSelected, setReviewSelected] = React.useState('')
  const [locationSelected, setLocationSelected] = React.useState('')
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setProductTypeSelected(newValue)
  }

  // ref
  // optimize the calling api for better performance
  const firstRender = useRef<boolean>(false)

  // fetch API
  const handleGetListProducts = async () => {
    setLoading(true)
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }

    // dispatch(getAllProductsAsync(query))
    await getAllProductsPublic(query).then(res => {
      if (res?.data) {
        setLoading(false)
        setProductsPublic({
          data: res?.data?.products,
          total: res?.data?.totalCount
        })
      }
    })
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleFilterProduct = (value: string, type: string) => {
    switch (type) {
      case 'review':
        setReviewSelected(value)
        break
      case 'location':
        setLocationSelected(value)
        break
    }
  }

  const handleResetFilter = () => {
    setReviewSelected('')
    setLocationSelected('')
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
          setProductTypeSelected(data?.[0]?._id)
          firstRender.current = true
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

  // side effects
  useEffect(() => {
    fetchAllTypes()
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (firstRender.current) handleGetListProducts()
  }, [sortBy, searchBy, page, pageSize, filterBy])

  useEffect(() => {
    if (firstRender.current)
      setFilterBy({ productType: productTypeSelected, minStar: reviewSelected, productLocation: locationSelected })
  }, [productTypeSelected, reviewSelected, locationSelected])

  useEffect(() => {
    if (isSuccessLike) {
      toast.success(t('like_product_successfully'))
      dispatch(resetInitialState())
      handleGetListProducts()
    } else if (isErrorLike && messageErrorLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('like_product_error'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessLike, isErrorLike, messageErrorLike, typeError])

  useEffect(() => {
    if (isSuccessUnLike) {
      toast.success(t('unlike_product_successfully'))
      dispatch(resetInitialState())
      handleGetListProducts()
    } else if (isErrorUnLike && messageErrorUnLike && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('unlike_product_error'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessUnLike, isErrorUnLike, messageErrorUnLike, typeError])

  return (
    <>
      {loading && <Spinner />}

      <Box
        sx={{
          padding: '20px',
          height: '100%',
          maxHeight: '100%'
        }}
      >
        <StyledTabs value={productTypeSelected} onChange={handleChange} aria-label='wrapped label tabs example'>
          {typesOption.map(opt => {
            return <Tab key={opt?.value} value={opt?.value} label={opt?.label} />
          })}
        </StyledTabs>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Box sx={{ width: '240px' }}>
              <CustomSelect
                label={t('sort')}
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value as string)
                }}
                options={[
                  {
                    label: t('sort_best_sold'),
                    value: 'sold desc'
                  },
                  {
                    label: t('sort_new_create'),
                    value: 'createdAt desc'
                  }
                ]}
                placeholder={t('sort_by')}
                fullWidth
              />
            </Box>
            <Box sx={{ width: '240px' }}>
              <InputSearch
                placeholder={t('search_product_name')}
                value={searchBy}
                onChange={(value: string) => setSearchBy(value)}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: '100%', width: '100%', mt: 4, mb: 8 }}>
          <Grid
            container
            spacing={{
              md: 6,
              xs: 4
            }}
          >
            <Grid item md={3} display={{ md: 'flex', xs: 'none' }}>
              <Box sx={{ width: '100%', height: 'auto' }}>
                <ProductFilter
                  reviewSelected={reviewSelected}
                  locationSelected={locationSelected}
                  citiesOption={citiesOption}
                  handleFilterProduct={handleFilterProduct}
                  handleReset={handleResetFilter}
                />
              </Box>
            </Grid>
            <Grid item md={9} xs={12}>
              {loading ? (
                <Grid
                  container
                  spacing={{
                    md: 6,
                    xs: 4
                  }}
                >
                  {Array.from({ length: 6 }).map((_, index) => {
                    return (
                      <Grid item key={index} md={4} sm={6} xs={12}>
                        <SkeletonCard />
                      </Grid>
                    )
                  })}
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={{
                    md: 6,
                    xs: 4
                  }}
                >
                  {productsPublic?.data?.length > 0 ? (
                    productsPublic?.data.map((product: TProduct) => (
                      <Grid item key={product._id} md={4} sm={6} xs={12}>
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
            </Grid>
          </Grid>
        </Box>
        <CustomPagination
          pageSize={pageSize}
          page={page}
          rowLength={productsPublic?.total}
          pageSizeOptions={PAGE_SIZE_OPTION}
          onChangePagination={handleOnChangePagination}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default HomePage
