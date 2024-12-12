// Mui
import {
  Box,
  FormControl,
  InputLabel,
  InputLabelProps,
  MenuItem,
  MenuItemProps,
  Select,
  SelectProps,
  styled
} from '@mui/material'
import { useTranslation } from 'react-i18next'

type TCustomSelect = SelectProps & {
  options: { label: string; value: string }[]
}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => {
  return {
    legend: {
      height: '14px!important',
      lineHeight: 1.2
    },
    '.css-14lo706 > span': {
      opacity: 1
    }
  }
})

const CustomPlaceholder = styled(InputLabel)<InputLabelProps>(({ theme }) => {
  return {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '18px'
  }
})

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => {
  return {}
})

const CustomSelect = (props: TCustomSelect) => {
  const { value, label, fullWidth, options, placeholder, onChange, ...rests } = props
  const { t } = useTranslation()

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {((Array.isArray(value) && !value.length) || !value) && <CustomPlaceholder>{placeholder}</CustomPlaceholder>}
      {/* <CustomPlaceholder>{placeholder}</CustomPlaceholder> */}
      <StyledSelect fullWidth={fullWidth} value={value} label={label} onChange={onChange} {...rests}>
        {options?.length > 0 ? (
          options.map(option => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            )
          })
        ) : (
          <MenuItem>{t('no_data')}</MenuItem>
        )}
      </StyledSelect>
    </Box>
  )
}

export default CustomSelect
