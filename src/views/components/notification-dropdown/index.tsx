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
import React, { Fragment, SyntheticEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NotificationItem from './components/NotificationItem'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { getAllNotificationsAsync } from 'src/stores/notification/actions'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/notification'

export type NotificationsType = {
  _id: string
  createdAt: string
  title: string
  body: string
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

  // state
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // redux
  const dispatch: AppDispatch = useDispatch()
  const {
    notifications,
    isLoading,
    isErrorRead,
    isSuccessRead,
    messageRead,
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

  const handleGetListNotification = () => {
    dispatch(
      getAllNotificationsAsync({
        params: {
          limit: -1,
          page: -1
        }
      })
    )
  }

  // side effects
  useEffect(() => {
    handleGetListNotification()
  }, [])

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

  console.log('notification', { notifications })

  return (
    <Fragment>
      {/* Notification icon */}
      <IconButton color='inherit' aria-haspopup='true' aria-controls='customized-menu' onClick={handleDropdownOpen}>
        <Badge
          color='error'
          badgeContent={4}
          sx={{
            '& .MuiBadge-badge': {
              top: 4,
              right: 4,
              boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
            }
          }}
        >
          <Icon icon='tabler:bell' fontSize='1.625rem' />
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
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Chip size='small' color='primary' label={`${notifications?.total} New`} />
              <Icon icon='line-md:email-opened' />
            </Box>
          </Box>
        </MenuItem>
        <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>
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
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            {t('Mark read all notifications')}
          </Button>
        </MenuItem>
      </StyledMenu>
    </Fragment>
  )
}

export default NotificationDropDown
