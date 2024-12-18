// Import Mui
import { IconButton, Tooltip } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'

type TGridDelete = {
  onClick: () => void
  disabled?: boolean
}

const GridDelete = (props: TGridDelete) => {
  const { t } = useTranslation()
  const { onClick, disabled } = props

  return (
    <Tooltip title={t('Delete')}>
      <IconButton onClick={onClick} disabled={disabled}>
        <Icon icon='ic:outline-delete' />
      </IconButton>
    </Tooltip>
  )
}

export default GridDelete
