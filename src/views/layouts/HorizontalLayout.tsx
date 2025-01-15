// React
import * as React from 'react'

// Mui
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'

// Next
import { NextPage } from 'next'
import { Icon } from '@iconify/react/dist/iconify.js'
import UserDropdown from 'src/views/components/user-dropdown'
import ModeToggle from '../components/mode-toggle'
import LanguageDropdown from '../components/language-dropdown'
import { useAuth } from 'src/hooks/useAuth'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import Link from 'next/link'
import CartProduct from '../components/cart-product'

// Iconify
// import { Icon } from '@iconify/react'

type TProps = {
  open: boolean
  toggleDrawer: () => void
  hideMenu?: boolean
}

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer, hideMenu }) => {
  const auth = useAuth()
  const router = useRouter()

  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          pr: '24px' // keep right padding when drawer closed
        }}
      >
        {!hideMenu && (
          <IconButton
            edge='start'
            color='inherit'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' })
            }}
          >
            <Icon icon='mingcute:menu-line' />
          </IconButton>
        )}
        <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
          <Link href={ROUTE_CONFIG.HOME}>HOME</Link>
        </Typography>
        <LanguageDropdown />
        <ModeToggle />
        <CartProduct />
        {auth.user ? (
          <UserDropdown />
        ) : (
          <Button variant='contained' sx={{ width: 'auto', ml: 4 }} onClick={() => router.push(ROUTE_CONFIG.LOGIN)}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default HorizontalLayout
