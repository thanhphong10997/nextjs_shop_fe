import dynamic from 'next/dynamic'
import { EditorProps } from 'react-draft-wysiwyg'

// use this component if the browser have the error (Window is not defined)
const ReactDraftWysiwyg = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false
})

export default ReactDraftWysiwyg
