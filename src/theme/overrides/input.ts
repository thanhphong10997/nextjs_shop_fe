// ** Type Import
import { OwnerStateThemeType } from '.'

const input = () => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -8px) scale(0.75)'
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '&:before': {
            borderBottom: `1px solid ${theme.palette.customColors.main}33`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid ${theme.palette.customColors.main}47`
          },
          '&.Mui-disabled:before': {
            borderBottomStyle: 'solid'
          }
        })
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '&:not(.MuiInputBase-sizeSmall)': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          },
          backgroundColor: `${theme.palette.customColors.main}0a`,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: `${theme.palette.customColors.main}14`
          },
          '&:before': {
            borderBottom: `1px solid ${theme.palette.customColors.main}33`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid ${theme.palette.customColors.main}47`
          }
        })
      }
    },
    // eslint-disable-next-line lines-around-comment
    // MuiOutlinedInput: {
    //    styleOverrides: {
    //       root: ({ theme }: OwnerStateThemeType) => ({
    //          "&:not(.MuiInputBase-sizeSmall)": {
    //             borderRadius: 8
    //          },
    //          "&:hover:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
    //             borderColor: `rgba(${theme.palette.customColors.main}, 0.28)`
    //          },
    //          "&:hover.Mui-error .MuiOutlinedInput-notchedOutline": {
    //             borderColor: theme.palette.error.main
    //          },
    //          "& .MuiOutlinedInput-notchedOutline": {
    //             borderColor: `rgba(${theme.palette.customColors.main}, 0.2)`
    //          },
    //          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    //             borderColor: theme.palette.text.disabled
    //          },
    //          "&.Mui-focused": {
    //             boxShadow: theme.shadows[2]
    //          }
    //       })
    //    }
    // },

    // Radio, Checkbox & Switch
    MuiFormControlLabel: {
      styleOverrides: {
        label: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.secondary
        })
      }
    }
  }
}

export default input
