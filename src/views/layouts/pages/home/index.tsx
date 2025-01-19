// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Grid, styled, Tab, Tabs, TabsProps, Typography, useTheme } from '@mui/material'

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
          <Box sx={{ width: '200px' }}>
            <InputSearch
              placeholder={t('search_product_name')}
              value={searchBy}
              onChange={(value: string) => setSearchBy(value)}
            />
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
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Typography>Khong co du lieu</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <CustomPagination
          pageSize={pageSize}
          page={page}
          rowLength={10}
          pageSizeOptions={PAGE_SIZE_OPTION}
          onChangePagination={handleOnChangePagination}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default HomePage
