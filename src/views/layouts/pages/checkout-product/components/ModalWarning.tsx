// Import Mui
import { Icon } from '@iconify/react/dist/iconify.js'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// components
import CustomModal from 'src/components/custom-modal'
import { ROUTE_CONFIG } from 'src/configs/route'

// others

import { useAuth } from 'src/hooks/useAuth'

type TModalWarning = {
  open: boolean
  onClose: () => void
}

const ModalWarning = (props: TModalWarning) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // router
  const router = useRouter()

  // auth
  const { user, setUser } = useAuth()

  // props
  const { open, onClose } = props

  return (
    <>
      {/* {(isLoading || loading) && <Spinner />} */}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '400px', xs: '80vw' }}
          maxWidth={{ md: '60vw', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {t('warning')}
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Icon icon='fluent:warning-28-regular' style={{ fontSize: '50px', color: theme.palette.warning.main }} />
            </Box>
            <Typography sx={{ textAlign: 'center' }}>{t('order_product_warning')}</Typography>
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}
              onClick={() => router.push(ROUTE_CONFIG.HOME)}
            >
              <Button variant='contained'>{t('return_home')}</Button>
            </Box>
          </Box>
        </Box>
      </CustomModal>
    </>
  )
}

export default ModalWarning
