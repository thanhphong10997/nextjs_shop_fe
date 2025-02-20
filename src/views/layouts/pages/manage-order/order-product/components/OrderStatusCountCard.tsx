// mui
import { Avatar, Box, Card, CardContent, SxProps, Theme, Typography, useTheme } from '@mui/material'

// icon
import { Icon } from '@iconify/react/dist/iconify.js'

// react
import React from 'react'

// translate
import { useTranslation } from 'react-i18next'

// others
import { hexToRGBA } from 'src/utils/hex-to-rgba'

export type OrderStatusCountCardProps = {
  icon: string
  countOrderStatus: { data: Record<number, number>; total: number }
  status: number
  sx?: SxProps<Theme>
  avatarSize?: number
  iconSize?: number | string
}

const OrderStatusCountCard = (props: OrderStatusCountCardProps) => {
  // hooks
  const { t } = useTranslation()
  const theme = useTheme()

  // props
  const { sx, icon, status, iconSize = 24, avatarSize = 38, countOrderStatus } = props

  // const
  const mapOrderStatus = {
    0: {
      title: t('wait_payment'),
      count: countOrderStatus?.data?.[0],
      themeColor: theme.palette.success.main
    },
    1: {
      title: t('wait_delivery'),
      count: countOrderStatus?.data?.[1],
      themeColor: theme.palette.info.main
    },
    2: {
      title: t('done_order'),
      count: countOrderStatus?.data?.[2],
      themeColor: theme.palette.error.main
    },
    3: {
      title: t('cancel_order'),
      count: countOrderStatus?.data?.[3],
      themeColor: theme.palette.warning.main
    },
    4: {
      title: t('total_order'),
      count: countOrderStatus?.total,
      themeColor: theme.palette.primary.main
    }
  }

  return (
    <Card sx={{ ...sx, backgroundColor: hexToRGBA((mapOrderStatus as any)?.[status]?.themeColor, 0.7) }}>
      <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Typography sx={{ mb: 1, color: theme.palette.customColors.lightPaperBg }}>
            {(mapOrderStatus as any)[status]?.title}
          </Typography>
          <Box sx={{ mb: 1, columnGap: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='h4' sx={{ color: theme.palette.customColors.lightPaperBg, fontWeight: 'bold' }}>
              {(mapOrderStatus as any)[status]?.count}
            </Typography>
          </Box>
        </Box>
        <Avatar
          variant='rounded'
          sx={{
            width: avatarSize,
            height: avatarSize
          }}
        >
          <Icon icon={icon} fontSize={iconSize} color={(mapOrderStatus as any)?.[status]?.themeColor} />
        </Avatar>
      </CardContent>
    </Card>
  )
}

export default OrderStatusCountCard
