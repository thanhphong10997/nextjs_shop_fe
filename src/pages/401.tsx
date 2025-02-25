// ** React Imports

import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'
import { Button, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ROUTE_CONFIG } from 'src/configs/route'
import Link from 'next/link'

// styled component
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20)
  }
}))

const Error401 = () => {
  const { t } = useTranslation()

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h2' sx={{ mb: 1.5 }}>
            {t('you_are_not_authorized')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t('you_do_not_have_permission_access_the_page')}</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 6 }}>{t('contact_site_administrator')}</Typography>
          <Button href={ROUTE_CONFIG.HOME} component={Link} variant='contained'>
            {t('return_home')}
          </Button>
        </BoxWrapper>
        <Img height='500' alt='error-illustration' src='/images/401.png' />
      </Box>
    </Box>
  )
}

export default Error401
Error401.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
