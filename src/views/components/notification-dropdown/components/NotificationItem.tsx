import React, { useState } from 'react'
import { NotificationsType } from '..'
import { useTranslation } from 'react-i18next'
import { Badge, Box, IconButton, Menu, MenuItem, styled, Tooltip, Typography, TypographyProps } from '@mui/material'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { deleteNotificationAsync, markReadNotificationAsync } from 'src/stores/notification/actions'
import { formatDate } from 'src/utils/date'
import { CONTEXT_NOTIFICATION } from 'src/configs/notification'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'

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
  const router = useRouter()

  // redux
  const dispatch: AppDispatch = useDispatch()

  // const
  const mapTitle = {
    Create_order: t('create_order'),
    Cancel_order: t('cancel_order'),
    Payment_vn_pay_success: t('payment_success'),
    Payment_vn_pay_error: t('payment_error'),
    Wait_payment: t('wait_payment'),
    Wait_delivery: t('wait_delivery'),
    Done_order: t('done_order'),
    Is_delivered: t('order_is_delivered'),
    Is_paid: t('order_is_paid')
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
    handleCloseOptions()
  }

  const handleDeleteNotification = () => {
    dispatch(deleteNotificationAsync(notification?._id))
    handleCloseOptions()
  }

  const handleNavigateDetails = (type: string) => {
    switch (type) {
      case CONTEXT_NOTIFICATION.ORDER: {
        dispatch(markReadNotificationAsync(notification?._id))
        handleDropdownClose()
        router.push(`${ROUTE_CONFIG.MY_ORDER}/${notification?.referenceId}`)
        break
      }
    }
  }

  return (
    <MenuItem disableRipple disableTouchRipple>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        <Box
          sx={{
            mr: 4,
            ml: 2.5,
            flex: '1 1',
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
            minWidth: '188px'
          }}
        >
          <MenuItemTitle onClick={() => handleNavigateDetails(notification?.context)}>
            {(mapTitle as any)[notification?.title] ? (mapTitle as any)[notification?.title] : notification?.title}
          </MenuItemTitle>
          <Tooltip title={notification?.body}>
            <MenuItemSubTitle variant='body2'>{notification?.body}</MenuItemSubTitle>
          </Tooltip>
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            {formatDate(notification?.createdAt)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          {notification?.isRead ? (
            <>
              <Badge color='success' overlap='circular' variant='dot' />
              <Typography>{t('read')}</Typography>
            </>
          ) : (
            <>
              <Badge color='error' overlap='circular' variant='dot' />
              <Typography>{t('unread')}</Typography>
            </>
          )}
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
