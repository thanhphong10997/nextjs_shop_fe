// ** MUI Imports
import { Icon } from '@iconify/react/dist/iconify.js'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

type TProps = {
  numRow: number
  onClear: () => void
  actions: { label: string; value: string; disabled?: boolean }[]
  handleAction: (type: string) => void
}

const StyledTableHeader = styled(Box)(({ theme }) => {
  return {
    borderRadius: '15px',
    border: `2px solid ${theme.palette.primary.main}`,
    width: '100% ',
    padding: '4px 10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

const TableHeader = (props: TProps) => {
  // props
  const { numRow, onClear, actions, handleAction } = props

  // ** Hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme()

  // translate
  const { t } = useTranslation()

  // handle

  return (
    <StyledTableHeader>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography>{t('selected')}</Typography>
        <Typography
          sx={{
            backgroundColor: theme.palette.primary.main,
            height: '20px',
            width: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: theme.palette.customColors.lightPaperBg,
            fontSize: '12px!important',
            fontWeight: 600
          }}
        >
          <span>{numRow}</span>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {actions.map(action => {
          return (
            <Button
              variant='contained'
              disabled={action?.disabled}
              key={action.value}
              onClick={() => handleAction(action.value)}
            >
              {action.label}
            </Button>
          )
        })}
        <IconButton onClick={onClear}>
          <Icon icon='ic:baseline-close' fontSize={'20px '} />
        </IconButton>
      </Box>
    </StyledTableHeader>
  )
}

export default memo(TableHeader)
