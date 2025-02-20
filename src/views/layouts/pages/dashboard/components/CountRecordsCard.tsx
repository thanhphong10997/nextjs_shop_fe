import { Icon } from '@iconify/react/dist/iconify.js'
import { Avatar, Box, Grid, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatNumberToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

interface TProps {
  data: Record<string, number>
}

const CountRecordsCard = (props: TProps) => {
  // props
  const { data } = props

  // hooks
  const { t } = useTranslation()
  const theme = useTheme()

  // const
  const mapRecord = {
    user: {
      title: t('users'),
      icon: 'tdesign:user-filled',
      theme: theme.palette.primary.main
    },
    product: {
      title: t('products'),
      icon: 'hugeicons:product-loading',
      theme: theme.palette.error.main
    },
    order: {
      title: t('orders'),
      icon: 'lets-icons:order',
      theme: theme.palette.success.main
    },
    review: {
      title: t('reviews'),
      icon: 'material-symbols:reviews',
      theme: theme.palette.info.main
    },
    comment: {
      title: t('comments'),
      icon: 'icon-park-outline:comment',
      theme: theme.palette.secondary.main
    },
    revenue: {
      title: t('revenue'),
      icon: 'tdesign:money',
      theme: theme.palette.warning.main
    }
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
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ fontSize: '26px', fontWeight: '600', mb: 4 }}>Statistics</Typography>
      </Box>
      <Grid container spacing={6}>
        {Object.keys(data)?.map(record => {
          return (
            <Grid item key={record} md={3} sm={6} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  variant='rounded'
                  sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    color: hexToRGBA((mapRecord as any)?.[record]?.theme, 0.16)
                  }}
                >
                  <Icon
                    icon={(mapRecord as any)?.[record]?.icon}
                    fontSize={30}
                    color={(mapRecord as any)?.[record]?.theme}
                  />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '26px' }}>
                    {record === 'revenue' ? `${formatNumberToLocal(data?.[record])} VND` : data?.[record]}
                  </Typography>
                  <Typography sx={{ fontSize: '16px' }}>{(mapRecord as any)?.[record]?.title}</Typography>
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CountRecordsCard
