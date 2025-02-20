// mui
import { Box, useTheme } from '@mui/material'

// react
import React, { useMemo } from 'react'

// type
import { TCountRevenue } from '..'

import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import { useTranslation } from 'react-i18next'

interface TProps {
  data: TCountRevenue[]
}

const CountRevenueCard = (props: TProps) => {
  const { t } = useTranslation()

  // props
  const { data } = props

  // hooks
  const theme = useTheme()

  const labelsMemo = useMemo(() => {
    return data?.map(item => `${item.month}/${item.year}`)
  }, [data])

  const totalMemo = useMemo(() => {
    return data?.map(item => item?.total)
  }, [data])

  const dataSets = [
    {
      label: t('sales'),
      backgroundColor: [
        theme.palette.error.main,
        theme.palette.info.main,
        theme.palette.secondary.main,
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.warning.main
      ],
      data: totalMemo
    }
  ]

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: '20px',
        height: '100%',
        maxHeight: '100%',
        borderRadius: '15px',
        mt: 4
      }}
    >
      <Bar
        data={{
          labels: labelsMemo,
          datasets: dataSets
        }}
        options={{
          plugins: {
            legend: { display: false },
            title: { display: true, text: t('sales_in_current_year') }
          }
        }}
      />
    </Box>
  )
}

export default CountRevenueCard
