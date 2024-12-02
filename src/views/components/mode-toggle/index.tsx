import { Icon } from '@iconify/react/dist/iconify.js'
import { IconButton } from '@mui/material'
import React from 'react'
import { useSettings } from 'src/hooks/useSettings'
import { Mode } from 'src/types/layouts'

type TProps = {}
const ModeToggle = (props: TProps) => {
  const { settings, saveSettings } = useSettings()
  const handleModeChange = (mode: Mode) => {
    saveSettings({ ...settings, mode })
  }
  const handleToggleMode = () => {
    if (settings.mode === 'dark') {
      handleModeChange('light')
    } else {
      handleModeChange('dark')
    }
  }

  return (
    <IconButton onClick={handleToggleMode}>
      <Icon
        icon={settings.mode === 'dark' ? 'iconamoon:mode-light-light' : 'material-symbols-light:dark-mode-outline'}
      />
    </IconButton>
  )
}

export default ModeToggle
