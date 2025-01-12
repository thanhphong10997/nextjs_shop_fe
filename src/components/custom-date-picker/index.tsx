// Mui
import { Icon } from '@iconify/react/dist/iconify.js'
import { Box, BoxProps, FormHelperText, Modal, ModalProps, styled, useTheme } from '@mui/material'
import { useRef } from 'react'

// date picker
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type TCustomDatePicker = ReactDatePickerProps & {
  selectedDate?: Date | null
  placeholder?: string
  error?: boolean
  helperText?: string
}

type StyledDatePickerProps = BoxProps & {
  error?: boolean
}

const StyledDatePicker = styled(Box)<StyledDatePickerProps>(({ theme, error }) => {
  return {
    borderRadius: 8,
    border: error ? `1px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.customColors.main}33`,
    height: '38px',
    padding: '8px',
    position: 'relative',
    '.react-datepicker__header': {
      backgroundColor: theme.palette.customColors.bodyBg,
      color: '#fff',
      borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#000'}`,
      borderLeft: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#000'}`,
      borderRight: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#000'}`
    },
    '.react-datepicker': {
      border: 'none'
    },
    '.react-datepicker-wrapper': {
      width: '100%',
      input: {
        width: '100%',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent'
      }
    },
    '.date-picker-icon': {
      position: 'absolute',
      right: '10px',
      top: '4px'
    },
    '.date-picker-popper': {
      zIndex: 2
    },
    '.react-datepicker__day--keyboard-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.customColors.lightPaperBg
    },
    '.react-datepicker__month': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.customColors.darkPaperBg
          : theme.palette.customColors.lightPaperBg,
      border: `1px solid  ${theme.palette.mode === 'dark' ? '#fff' : '#000'}`,
      borderBottomLeftRadius: '0.3rem',
      borderBottomRightRadius: '0.3rem',
      margin: 0
    },
    '.react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day': {
      color: theme.palette.mode === 'dark' ? `${theme.palette.common.white}fff80` : theme.palette.common.black
    },
    '.react-datepicker__day:hover': {
      color: theme.palette.common.black
    },
    '.react-datepicker__day--disabled': {
      backgroundColor: `${theme.palette.customColors.main}1f`,
      borderRadius: '0.3rem'
    }
  }
})

const CustomDatePicker = (props: TCustomDatePicker) => {
  const { selectedDate, onChange, placeholder, error, helperText, ...rests } = props
  const datePickerRef = useRef<any>(null)

  const theme = useTheme()

  // handle
  const handleFocusCalendar = () => {
    if (datePickerRef.current) {
      datePickerRef.current?.setFocus()
    }
  }

  return (
    <StyledDatePicker error={error}>
      <DatePicker
        placeholderText={placeholder}
        ref={datePickerRef}
        selected={selectedDate}
        onChange={onChange}
        {...rests}
      />
      <Icon icon='uiw:date' className='date-picker-icon' fontSize={24} onClick={handleFocusCalendar} />
      {helperText && (
        <FormHelperText
          sx={{
            color: theme.palette.error.main,
            mt: '10px'
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </StyledDatePicker>
  )
}

export default CustomDatePicker
