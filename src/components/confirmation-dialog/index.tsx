// Import Mui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  styled,
  Typography,
  useTheme
} from '@mui/material'

// Import React
import React, { memo, useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'

type TConfirmationDialog = {
  open: boolean
  title: string
  description: string
  handleClose: () => void
  handleCancel: () => void
  handleConfirm: () => void
}

const ConfirmationDialog = (props: TConfirmationDialog) => {
  const { open, title, description, handleClose, handleCancel, handleConfirm } = props

  // translate
  const { t } = useTranslation()

  // theme
  const theme = useTheme()

  const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => {
    return {
      '.MuiPaper-root.MuiPaper-elevation': {
        width: '380px'
      }
    }
  })

  return (
    <React.Fragment>
      <StyledDialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px'
          }}
        >
          <Icon icon='fluent:warning-28-regular' style={{ fontSize: '50px', color: theme.palette.warning.main }} />
        </Box>
        <DialogTitle id='alert-dialog-title' sx={{ textAlign: 'center', fontSize: '' }}>
          <Typography variant='h4' sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ padding: '0px 20px!important', textAlign: 'center', marginBottom: '20px' }}>
          <DialogContentText id='alert-dialog-description' sx={{ padding: '10px 20px' }}>
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='error' variant='outlined' onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button variant='contained' onClick={handleConfirm}>
            {' '}
            {t('confirm')}
          </Button>
        </DialogActions>
      </StyledDialog>
    </React.Fragment>
  )
}

export default memo(ConfirmationDialog)
