// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Chip, ChipProps, Grid, styled, Tab, Tabs, TabsProps, Typography, useTheme } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// translate
import { useTranslation } from 'react-i18next'

// Components

import CustomPagination from 'src/components/custom-pagination'

import Spinner from 'src/components/spinner'

// config
import { OBJECT_TYPE_ERROR_PRODUCT } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// services

// hooks

// utils
import { formatDate, formatFilter } from 'src/utils'

import { getAllProductTypes } from 'src/services/product-type'
import ProductCard from './components/ProductCard'
import { getAllProductsPublic } from 'src/services/product'
import { TProduct } from 'src/types/product'
import InputSearch from 'src/components/input-search'
import ProductFilter from './components/ProductFilter'

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setProductTypeSelected(newValue)
  }

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

  const handleFilterProduct = (review: string) => {
    setReviewSelected(review)
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
    setFilterBy({ productType: productTypeSelected, minStar: reviewSelected })
  }, [productTypeSelected, reviewSelected])

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
            <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
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
                <ProductFilter handleFilterProduct={handleFilterProduct} />
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
