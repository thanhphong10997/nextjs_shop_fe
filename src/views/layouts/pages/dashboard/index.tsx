// react
import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Spinner from 'src/components/spinner'

// services
import {
  getCountAllRecords,
  getCountOrderStatus,
  getCountProductTypes,
  getCountRevenueCurrentYear,
  getCountUserType
} from 'src/services/report'
import CountRecordsCard from './components/CountRecordsCard'
import CountRevenueCard from './components/CountRevenueCard'
import ProductTypeCard from './components/ProductTypeCard'
import CountUserTypeCard from './components/CountUserTypeCard'
import CountOrderStatusCard from './components/CountOrderStatusCard'
import { getAllProducts } from 'src/services/product'
import PopularProductCard from './components/PopularProductCard'

export interface TCountProductType {
  typeName: string
  total: number
}

export interface TCountRevenue {
  total: number
  month: string
  year: string
}

export interface TPopularProduct {
  _id: string
  name: string
  slug: string
  price: string
  image: string
  type: {
    name: string
  }
}

const DashboardPage = () => {
  const [loading, setLoading] = useState(false)
  const [countRecords, setCountRecords] = useState<Record<string, number>>({})
  const [countProductTypes, setCountProductTypes] = useState<TCountProductType[]>([])
  const [countRevenues, setCountRevenues] = useState<TCountRevenue[]>([])
  const [countUserType, setCountUserType] = useState<Record<number, number>>({} as any)
  const [countOrderStatus, setCountOrderStatus] = useState<Record<number, number>>({} as any)
  const [popularProductList, setPopularProductList] = useState<TPopularProduct[]>([])

  // fetch api
  const fetchAllCountRecords = async () => {
    setLoading(true)
    await getCountAllRecords()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountRecords(data)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const fetchAllProductTypes = async () => {
    setLoading(true)
    await getCountProductTypes()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountProductTypes(data)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const fetchAllTotalRevenues = async () => {
    setLoading(true)
    await getCountRevenueCurrentYear()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountRevenues(data)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const fetchCountUserType = async () => {
    setLoading(true)
    await getCountUserType()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountUserType(data?.data)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const fetchAllStatusCountOrder = async () => {
    setLoading(true)
    await getCountOrderStatus()
      .then(res => {
        const data = res?.data
        setLoading(false)
        setCountOrderStatus(data?.data)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const fetchPopularProductList = async () => {
    setLoading(true)
    await getAllProducts({ params: { limit: 5, page: 1, order: 'sold desc' } })
      .then(res => {
        const data = res?.data
        setLoading(false)
        setPopularProductList(data?.products)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAllCountRecords()
    fetchAllProductTypes()
    fetchAllTotalRevenues()
    fetchCountUserType()
    fetchAllStatusCountOrder()
    fetchPopularProductList()
  }, [])

  return (
    <Box>
      {loading && <Spinner />}
      <CountRecordsCard data={countRecords} />
      <Grid container spacing={10}>
        <Grid item md={6} xs={12}>
          <ProductTypeCard data={countProductTypes} />
        </Grid>
        <Grid item md={6} xs={12}>
          <CountRevenueCard data={countRevenues} />
        </Grid>
        <Grid item md={4} xs={12}>
          <PopularProductCard data={popularProductList} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CountUserTypeCard data={countUserType} />
        </Grid>
        <Grid item md={4} xs={12}>
          <CountOrderStatusCard data={countOrderStatus} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage
