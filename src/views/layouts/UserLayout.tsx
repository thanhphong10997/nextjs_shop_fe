// React
import * as React from 'react'

// Mui
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'

// Next
import { NextPage } from 'next'

// Components
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import { useTheme } from '@mui/material'

// import MenuIcon from '@mui/icons-material/Menu'
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
// import NotificationsIcon from '@mui/icons-material/Notifications'
// import Chart from './Chart'
// import Deposits from './Deposits'
// import Orders from './Orders'

type TProps = {
  children: React.ReactNode
}

export const UserLayout: NextPage<TProps> = ({ children }) => {
  const theme = useTheme()
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <VerticalLayout open={open} toggleDrawer={toggleDrawer} />
      <HorizontalLayout open={open} toggleDrawer={toggleDrawer} />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container
          sx={{
            m: 4,
            width: `calc(100% - 32px)`,
            maxWidth: `calc(100% - 32px) !important`,

            // maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 32px)`,
            // minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 32px)`,
            padding: '0!important',
            overflow: 'auto'

            // borderRadius: '15px'
            // backgroundColor: theme =>
            //   theme.palette.mode === 'light'
            //     ? theme.palette.customColors.lightPaperBg
            //     : theme.palette.customColors.darkPaperBg
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  )
}
