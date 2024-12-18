// Import Mui
import { IconButton, Tooltip } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'

type TGridEdit = {
  onClick: () => void
  disabled?: boolean
}

const GridEdit = (props: TGridEdit) => {
  const { t } = useTranslation()
  const { onClick, disabled } = props

  return (
    <Tooltip title={t('Edit')}>
      <IconButton onClick={onClick} disabled={disabled}>
        <Icon icon='lucide:edit' />
      </IconButton>
    </Tooltip>
  )
}

export default GridEdit
