// Import Mui
import { IconButton, Tooltip, useTheme } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'

type TGridCreate = {
  onClick: () => void
  disabled?: boolean
}

const GridCreate = (props: TGridCreate) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { onClick, disabled } = props

  return (
    <Tooltip title={t('Create')}>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{ backgroundColor: `${theme.palette.primary.main}!important`, color: theme.palette.common.white }}
      >
        <Icon icon='meteor-icons:plus' />
      </IconButton>
    </Tooltip>
  )
}

export default GridCreate
