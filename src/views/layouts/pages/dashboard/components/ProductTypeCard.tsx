// mui
import { Box, useTheme } from '@mui/material'

// react
import React, { useMemo } from 'react'

// type
import { TCountProductType } from '..'

// others
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import { useTranslation } from 'react-i18next'

interface TProps {
  data: TCountProductType[]
}

const ProductTypeCard = (props: TProps) => {
  const { t } = useTranslation()

  // props
  const { data } = props

  // hooks
  const theme = useTheme()

  const labelsMemo = useMemo(() => {
    return data?.map(item => item?.typeName)
  }, [data])

  const totalMemo = useMemo(() => {
    return data?.map(item => item?.total)
  }, [data])

  const dataSets = [
    {
      label: t('quantity'),
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.error.main,
        theme.palette.info.main,
        theme.palette.secondary.main,
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
            title: { display: true, text: t('product_quantity_based_on_type') }
          }
        }}
      />
    </Box>
  )
}

export default ProductTypeCard
