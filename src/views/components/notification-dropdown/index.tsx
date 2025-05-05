import { Icon } from '@iconify/react/dist/iconify.js'
import {
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  styled,
  Typography,
  useTheme
} from '@mui/material'
import React, { Fragment, SyntheticEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NotificationItem from './components/NotificationItem'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { getAllNotificationsAsync, markReadAllNotificationAsync } from 'src/stores/notification/actions'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/notification'
import fireBaseApp from 'src/configs/firebase'
import { getMessaging, onMessage } from 'firebase/messaging'
import useFcmToken from 'src/hooks/useFcmToken'
import { updateDeviceToken } from 'src/services/auth'
import { clearLocalDeviceToken, getLocalDeviceToken, setLocalDeviceToken } from 'src/helpers/storage'

export type NotificationsType = {
  _id: string
  createdAt: string
  title: string
  body: string
  isRead: boolean
  context: string
  referenceId: string
}

interface TProps {}

// styled menu component
const StyledMenu = styled(Menu)<MenuProps>(({ theme }) => {
  return {
    '& .MuiMenu-paper': {
      width: 380,
      overflow: 'hidden',
      marginTop: theme.spacing(4.25),
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    },
    '& .MuiMenu-list': {
      padding: 0,
      '& .MuiMenuItem-root': {
        margin: 0,
        borderRadius: 0,
        padding: theme.spacing(4, 6),
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        }
      }
    }
  }
})

const NotificationDropDown = () => {
  // hooks
  const theme = useTheme()
  const { t } = useTranslation()

  // firebase cloud message token
  const { fcmToken } = useFcmToken()

  // state
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [limit, setLimit] = useState(10)
  const localDeviceToken = getLocalDeviceToken()

  // ref
  const wrapperListRef = useRef<HTMLDivElement>(null)

  // redux
  const dispatch: AppDispatch = useDispatch()
  const {
    notifications,
    isLoading,
    isErrorRead,
    isSuccessRead,
    messageRead,
    isSuccessReadAll,
    isErrorReadAll,
    messageReadAll,
    isSuccessDelete,
    isErrorDelete,
    messageDelete
  } = useSelector((state: RootState) => state.notification)

  // handle
  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event?.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleMarkReadAllNotifications = () => {
    dispatch(markReadAllNotificationAsync())
  }

  const handleGetListNotification = () => {
    dispatch(
      getAllNotificationsAsync({
        params: {
          limit: limit,
          page: 1,
          order: 'createdAt desc'
        }
      })
    )
  }

  const handleScrollListNotification = () => {
    const wrapperContent = wrapperListRef.current
    if (!wrapperContent) return
    const listHeight = wrapperContent.clientHeight
    const scrollHeight = wrapperContent.scrollHeight
    const maxHeight = scrollHeight - listHeight
    const currentHeight = wrapperContent.scrollTop
    if (currentHeight >= maxHeight) {
      if (notifications.total > limit) setLimit(prev => prev + 10)
    }
  }

  // update device token
  const handleUpdateDeviceToken = async (deviceToken: string) => {
    clearLocalDeviceToken()
    setLocalDeviceToken(deviceToken)
    await updateDeviceToken({ deviceToken: deviceToken })
  }

  // side effects
  useEffect(() => {
    handleGetListNotification()
  }, [limit])

  // device token
  useEffect(() => {
    if (localDeviceToken !== fcmToken) {
      handleUpdateDeviceToken(fcmToken)
    }
  }, [fcmToken])

  // show popup message
  useEffect(() => {
    if (messageRead) {
      if (isSuccessRead && !isErrorRead) {
        toast.success(t('marked_notifications_success'))
        dispatch(resetInitialState())
        handleGetListNotification()
      } else if (isErrorRead && messageRead) {
        toast.error(t('marked_notifications_error'))
        dispatch(resetInitialState())
        handleGetListNotification()
      }
    }
  }, [isSuccessRead, isErrorRead, messageRead])

  useEffect(() => {
    if (messageReadAll) {
      if (isSuccessReadAll && !isErrorReadAll) {
        toast.success(t('marked_all_notifications_success'))
        dispatch(resetInitialState())
        handleGetListNotification()
      } else if (isErrorReadAll && messageReadAll) {
        toast.error(t('marked_all_notifications_error'))
        dispatch(resetInitialState())
        handleGetListNotification()
      }
    }
  }, [isSuccessReadAll, isErrorReadAll, messageReadAll])

  useEffect(() => {
    if (messageDelete) {
      if (isSuccessDelete && !isErrorDelete) {
        toast.success(t('delete_notifications_success'))
        dispatch(resetInitialState())
        handleGetListNotification()
      } else if (isErrorDelete && messageDelete) {
        toast.error(t('delete_notifications_error'))
        dispatch(resetInitialState())
        handleGetListNotification()
      }
    }
  }, [isSuccessDelete, isErrorDelete, messageDelete])

  // send message notification to firebase
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(fireBaseApp)
      const unsubscribe = onMessage(messaging, payload => {
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
        // console.log('Foreground push notification received:', payload)
        handleGetListNotification()
      })

      return () => {
        unsubscribe() // Unsubscribe from the onMessage event
      }
    }
  }, [])

  return (
    <Fragment>
      {/* Notification icon */}
      <IconButton color='inherit' aria-haspopup='true' aria-controls='customized-menu' onClick={handleDropdownOpen}>
        <Badge
          color='error'
          badgeContent={notifications?.totalNew}
          sx={{
            '& .MuiBadge-badge': {
              top: 4,
              right: 4,
              boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
            }
          }}
        >
          <Icon
            icon='tabler:bell'
            fontSize='1.625rem'
            color={theme.palette.mode === 'light' ? '#2F2B3D8a' : '#D0D4F18a'}
          />
        </Badge>
      </IconButton>
      {/* Notification icon */}
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent!important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant='h5' sx={{ cursor: 'text' }}>
              {t('notifications')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Chip size='small' color='primary' label={`${notifications?.totalNew} New`} />
              <Icon icon='line-md:email-opened' />
            </Box>
          </Box>
        </MenuItem>
        <Box
          sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}
          ref={wrapperListRef}
          onScroll={handleScrollListNotification}
        >
          {notifications?.data?.map((notification: NotificationsType, index: number) => (
            <NotificationItem key={index} notification={notification} handleDropdownClose={handleDropdownClose} />
          ))}
        </Box>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: `${theme.palette.background.paper}!important`,
            borderBottom: 0,
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button fullWidth variant='contained' onClick={handleMarkReadAllNotifications}>
            {t('mark_read_all_notifications')}
          </Button>
        </MenuItem>
      </StyledMenu>
    </Fragment>
  )
}

export default NotificationDropDown
