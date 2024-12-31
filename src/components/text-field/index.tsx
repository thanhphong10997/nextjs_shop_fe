import { styled, TextField, TextFieldProps } from '@mui/material'

export const CustomTextField = (props: TextFieldProps) => {
  const TextFieldStyled = styled(TextField)<TextFieldProps>(({ theme }) => {
    return {
      '& .MuiInputLabel-root': {
        transform: 'none',
        lineHeight: 1.2,
        position: 'relative',
        marginBottom: theme.spacing(1),
        fontSize: theme.typography.body2.fontSize
      },
      '& .MuiInputBase-root': {
        borderRadius: 8,
        backgroundColor: 'transparent!important',
        border: `1px solid  ${theme.palette.customColors.main}33`,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        duration: theme.transitions.duration.shorter,

        '&:before, &:after': {
          display: 'none'
        },
        '.MuiInputBase-input': {
          padding: '8px 10px'
        },
        '&.Mui-error': {
          borderColor: theme.palette.error.main
        },
        '& .MuiFormHelperText-root': {
          lineHeight: 1.154,
          margin: theme.spacing(1, 0, 0),
          color: theme.palette.text.secondary,
          fontSize: theme.typography.body2.fontSize,
          '&.Mui-error': {
            color: theme.palette.error.main
          }
        }
      }
    }
  })

  const { size = 'small', variant = 'filled', InputLabelProps, ...rests } = props

  return (
    <TextFieldStyled size={size} variant={variant} InputLabelProps={{ ...InputLabelProps, shrink: true }} {...rests} />
  )
}

export default CustomTextField
