import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type TProps = {
  children: React.ReactNode
  uploadFunc: (file: File) => void
  acceptObjectFile?: Record<string, string[]>
}
export default function WrapperFileUpload(props: TProps) {
  const { children, uploadFunc, acceptObjectFile } = props
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    uploadFunc(acceptedFiles[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // accept -> filter type of files which you want to upload
    accept: acceptObjectFile ? acceptObjectFile : {},
    onDrop
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}
