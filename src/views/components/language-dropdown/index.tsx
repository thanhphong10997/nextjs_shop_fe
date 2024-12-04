// React
import * as React from 'react'

// Mui
import Typography from '@mui/material/Typography'
import { Box, BoxProps, Button, Menu, MenuItem, Popover, styled } from '@mui/material'
import { LANGUAGE_OPTIONS } from 'src/configs/i18n'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react/dist/iconify.js'

interface TStyledItem extends BoxProps {
  selected: boolean
}

export default function LanguageDropdown() {
  const StyledItemLanguage = styled(Box)<TStyledItem>(({ theme, selected }) => {
    return {
      cursor: 'pointer',
      '.MuiTypography-root': {
        padding: '8px 12px'
      },
      '&:hover': {
        backgroundColor: '#7367f0'
      }
    }
  })
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const { i18n } = useTranslation()
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <Button aria-describedby='language-dropdown' variant='contained' onClick={handleClick}>
        <Icon icon='ic:baseline-translate' />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id='language-dropdown'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {LANGUAGE_OPTIONS.map(lang => {
          return (
            <MenuItem
              selected={i18n.language === lang.value}
              key={lang.value}
              onClick={() => handleChangeLanguage(lang.value)}
            >
              {lang.lang}
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}
