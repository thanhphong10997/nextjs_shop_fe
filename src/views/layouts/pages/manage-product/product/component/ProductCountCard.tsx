import { Icon } from '@iconify/react/dist/iconify.js'
import { Avatar, Box, Card, CardContent, SxProps, Theme, Typography, useTheme } from '@mui/material'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

export type ProductCountCard = {
  icon: string
  status: number
  countProductStatus: { data: Record<number, number>; total: number }
  sx?: SxProps<Theme>
  avatarSize?: number
  iconSize?: number | string
}

const ProductCountCard = (props: ProductCountCard) => {
  // hooks
  const { t } = useTranslation()
  const theme = useTheme()

  // props
  const { sx, icon, countProductStatus, iconSize = 24, avatarSize = 38, status } = props

  // const
  const mapProductStatus = {
    1: {
      title: t('Public Product'),
      count: countProductStatus?.data?.[1],
      themeColor: theme.palette.success.main
    },
    2: {
      title: t('Total Product'),
      count: countProductStatus?.total,
      themeColor: theme.palette.error.main
    },
    0: {
      title: t('Private Product'),
      count: countProductStatus?.data?.[0],
      themeColor: theme.palette.info.main
    }
  }

  return (
    <Card sx={{ ...sx, backgroundColor: hexToRGBA((mapProductStatus as any)?.[status]?.themeColor, 0.7) }}>
      <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Typography sx={{ mb: 1, color: theme.palette.customColors.lightPaperBg }}>
            {(mapProductStatus as any)[status]?.title}
          </Typography>
          <Box sx={{ mb: 1, columnGap: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='h4' sx={{ color: theme.palette.customColors.lightPaperBg, fontWeight: 'bold' }}>
              {(mapProductStatus as any)[status]?.count}
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
          <Icon icon={icon} fontSize={iconSize} color={(mapProductStatus as any)?.[status]?.themeColor} />
        </Avatar>
      </CardContent>
    </Card>
  )
}

export default memo(ProductCountCard)
