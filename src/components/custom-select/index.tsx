// Mui
import { Box, InputLabel, InputLabelProps, MenuItem, Select, SelectProps, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'

type TCustomSelect = SelectProps & {
  options: { label: string; value: string }[]
}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => {
  return {
    // '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input': {
    //   padding: '4px 8px 8px 10px !important',

    //   // height: '38px',
    //   boxSizing: 'border-box'
    // },
    '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input': {
      backgroundColor: theme.palette.background.paper,
      padding: '9px 32px'
    },

    legend: {
      height: '14px!important',
      lineHeight: 1.2
    },
    '.css-14lo706 > span': {
      opacity: 1
    }

    // '.MuiOutlinedInput-notchedOutline': {
    //   top: '0!important',
    //   bottom: '2px!important'
    // }
  }
})

const CustomPlaceholder = styled(InputLabel)<InputLabelProps>(({ theme }) => {
  return {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '18px',
    zIndex: 2
  }
})

const CustomSelect = (props: TCustomSelect) => {
  const { value, label, fullWidth, options, placeholder, onChange, ...rests } = props
  const { t } = useTranslation()

  return (
    <Box sx={{ width: '100%', height: '39px', position: 'relative' }}>
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
