// Mui
import { Box, useTheme } from '@mui/material'

// react
import React, { useMemo, useState } from 'react'

// react-chartjs
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { OBJECT_USER_TYPE } from 'src/configs/user'
import { useTranslation } from 'react-i18next'

type TProps = {
  data: Record<number, number>
}

const CountUserTypeCard = (props: TProps) => {
  // hooks
  const theme = useTheme()
  const { t } = useTranslation()

  // props
  const { data } = props

  const mapObject = OBJECT_USER_TYPE()
  const labelMemo = useMemo(() => {
    if (data) {
      return Object.keys(data)?.map(key => {
        return (mapObject as any)?.[key]?.label
      })
    }

    return []
  }, [data])

  const valueMemo = useMemo(() => {
    if (data) {
      return Object.keys(data)?.map(key => {
        return (data as any)?.[key]
      })
    }

    return []
  }, [data])

  const dataChart = {
    labels: labelMemo,
    datasets: [
      {
        label: t('number_of_users'),
        data: valueMemo,
        backgroundColor: [
          hexToRGBA(theme.palette.success.main, 0.4),
          hexToRGBA(theme.palette.warning.main, 0.4),
          hexToRGBA(theme.palette.error.main, 0.4),
          hexToRGBA(theme.palette.info.main, 0.4),
          hexToRGBA(theme.palette.secondary.main, 0.4)
        ],
        borderColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
          theme.palette.info.main,
          theme.palette.secondary.main
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: '20px',
        height: '100%',
        maxHeight: '100%',
        borderRadius: '15px'
      }}
    >
      <Pie
        data={dataChart}
        options={{
          plugins: {
            title: { display: true, text: t('users_type_statistic') }
          }
        }}
      />
    </Box>
  )
}

export default CountUserTypeCard
