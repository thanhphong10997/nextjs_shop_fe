import React, { useState } from 'react'
import { NotificationsType } from '..'
import { useTranslation } from 'react-i18next'
import { Badge, Box, IconButton, Menu, MenuItem, styled, Typography, TypographyProps } from '@mui/material'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { deleteNotificationAsync, markReadNotificationAsync } from 'src/stores/notification/actions'

type TProps = {
  notification: NotificationsType
  handleDropdownClose: () => void
}

// Styled component for the title in MenuItem
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 500,
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))

// Styled component for the subtitle in MenuItem
const MenuItemSubTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))

const NotificationItem = (props: TProps) => {
  // hooks
  const { t } = useTranslation()

  // redux
  const dispatch: AppDispatch = useDispatch()

  // const
  const mapTitle = {
    Create_order: t('create_order')
  }

  // props
  const { notification, handleDropdownClose } = props

  // states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openOptions = Boolean(anchorEl)

  // handle
  const handleCloseOptions = () => {
    setAnchorEl(null)
  }

  const handleMarkNotification = () => {
    dispatch(markReadNotificationAsync(notification?._id))
  }

  const handleDeleteNotification = () => {
    dispatch(deleteNotificationAsync(notification?._id))
  }

  return (
    <MenuItem disableRipple disableTouchRipple>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        <Box sx={{ mr: 4, ml: 2.5, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
          <MenuItemTitle onClick={handleDropdownClose}>{(mapTitle as any)[notification?.title]}</MenuItemTitle>
          <MenuItemSubTitle variant='body2'>{notification?.body}</MenuItemSubTitle>
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            {/* {notification?.meta} */}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <Badge color='error' overlap='circular' variant='dot' />
          <Typography>Unread</Typography>
          <>
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}>
              <Icon icon='pepicons-pencil:dots-y' />
            </IconButton>
            <Menu
              keepMounted
              anchorEl={anchorEl}
              open={openOptions}
              onClose={handleCloseOptions}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem sx={{ '& svg': { mr: 2 }, border: 'none!important' }} onClick={handleMarkNotification}>
                <Icon icon='gg:read' fontSize={20} />
                {t('mark read')}
              </MenuItem>
              <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleDeleteNotification}>
                <Icon icon='mdi:delete-outline' fontSize={20} />
                {t('delete')}
              </MenuItem>
            </Menu>
          </>
        </Box>
      </Box>
    </MenuItem>
  )
}

export default NotificationItem
