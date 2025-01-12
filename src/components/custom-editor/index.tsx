// Mui

import { Box, BoxProps, FormHelperText, styled, useTheme } from '@mui/material'
import { EditorProps } from 'react-draft-wysiwyg'
import ReactDraftWysiwyg from './react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type TCustomEditorProps = EditorProps & {
  error?: boolean
  helperText?: string
}

type StyledWrapperEditorProps = BoxProps & {
  error?: boolean
}

const StyledWrapperEditor = styled(Box)<StyledWrapperEditorProps>(({ theme, error }) => {
  return {
    '.rdw-editor-wrapper': {
      borderRadius: 8,
      backgroundColor: 'transparent!important',
      border: error ? `1px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.customColors.main}33`
    },
    '.rdw-editor-toolbar': {
      border: 'none',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    '.rdw-editor-main': {
      border: `1px solid ${theme.palette.customColors.main}33`,
      padding: '8px',
      minHeight: '200px',
      maxHeight: '200px',
      overflow: 'auto'
    }
  }
})

const CustomEditor = (props: TCustomEditorProps) => {
  const { error, helperText, ...rests } = props
  const theme = useTheme()

  return (
    <StyledWrapperEditor error={error}>
      <ReactDraftWysiwyg {...rests} />
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
    </StyledWrapperEditor>
  )
}

export default CustomEditor
