import { Icon } from '@iconify/react/dist/iconify.js'
import { Avatar, Box, Card, CardContent, SxProps, Theme, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

export type UserCountCardProps = {
  icon: string
  userType: number
  countUserType: { data: Record<number, number>; totalUser: number }
  count: number
  sx?: SxProps<Theme>
  avatarSize?: number
  iconSize?: number | string
}

const UserCountCard = (props: UserCountCardProps) => {
  // hooks
  const { t } = useTranslation()
  const theme = useTheme()

  // props
  const { sx, icon, count, countUserType, iconSize = 24, avatarSize = 38, userType } = props

  // const
  const mapUserType = {
    1: {
      title: t('Facebook Users'),
      count: countUserType?.data?.[1],
      themeColor: theme.palette.success.main
    },
    2: {
      title: t('Google Users'),
      count: countUserType?.data?.[2],
      themeColor: theme.palette.error.main
    },
    3: {
      title: t('Email Users'),
      count: countUserType?.data?.[3],
      themeColor: theme.palette.info.main
    },
    4: {
      title: t('Total User'),
      count: countUserType?.totalUser,
      themeColor: theme.palette.primary.main
    }
  }

  return (
    <Card sx={{ ...sx, backgroundColor: hexToRGBA((mapUserType as any)?.[userType]?.themeColor, 0.7) }}>
      <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Typography sx={{ mb: 1, color: theme.palette.customColors.lightPaperBg }}>
            {(mapUserType as any)[userType]?.title}
          </Typography>
          <Box sx={{ mb: 1, columnGap: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant='h4' sx={{ color: theme.palette.customColors.lightPaperBg, fontWeight: 'bold' }}>
              {(mapUserType as any)[userType]?.count}
            </Typography>
          </Box>
        </Box>
        <Avatar
          variant='rounded'
          sx={{
            width: avatarSize,
            height: avatarSize,
            backgroundColor: theme.palette.grey[400]
          }}
        >
          <Icon icon={icon} fontSize={iconSize} color={(mapUserType as any)?.[userType]?.themeColor} />
        </Avatar>
      </CardContent>
    </Card>
  )
}

export default UserCountCard
