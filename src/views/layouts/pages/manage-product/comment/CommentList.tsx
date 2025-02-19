// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Grid, Tooltip, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useMemo, useState } from 'react'

// Import redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/comments'

// translate
import { useTranslation } from 'react-i18next'

// config

// Components
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import CustomPagination from 'src/components/custom-pagination'
import CustomDataGrid from 'src/components/custom-data-grid'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'

// react toast
import toast from 'react-hot-toast'

// config
import { OBJECT_TYPE_ERROR_USER } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// utils
import { formatFilter, toFullName } from 'src/utils'

// hooks
import { usePermission } from 'src/hooks/usePermission'
import { deleteCommentAsync, deleteMultipleCommentAsync, getAllCommentsCMSAsync } from 'src/stores/comments/actions'
import EditComment from './components/EditComment'
import TableHeader from 'src/components/table-header'

type TProps = {}

export const CommentListPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openEdit, setOpenEdit] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteComment, setOpenConfirmationDeleteComment] = useState({
    open: false,
    id: ''
  })

  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [selectedRow, setSelectedRow] = useState<string[]>([])
  const [openConfirmationDeleteMultipleComment, setOpenConfirmationDeleteMultipleComment] = useState(false)

  // hooks
  const { UPDATE, DELETE } = usePermission('SYSTEM.MANAGE_PRODUCT.COMMENT', ['UPDATE', 'DELETE'])

  // redux
  const {
    comments,
    isLoading,
    isSuccessEdit,
    isErrorEdit,
    messageErrorEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete,

    typeError
  } = useSelector((state: RootState) => state.comments)

  // redux
  const dispatch: AppDispatch = useDispatch()

  const columns: GridColDef[] = [
    {
      field: 'full_name',
      headerName: t('Full_name'),
      minWidth: 300,
      maxWidth: 300,
      renderCell: params => {
        const { row } = params

        const fullName = toFullName(
          row?.user?.lastName || '',
          row?.user?.middleName || '',
          row?.user?.firstName || '',
          i18n.language
        )

        return (
          <Tooltip title={fullName}>
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{fullName}</Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'product_name',
      headerName: t('product_name'),
      minWidth: 350,
      maxWidth: 350,
      renderCell: params => {
        const { row } = params

        return (
          <Tooltip title={row?.product?.name}>
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
              {row?.product?.name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'content',
      headerName: t('content'),
      minWidth: 400,
      maxWidth: 400,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.content}</Typography>
      }
    },

    {
      field: 'action',
      headerName: t('Actions'),
      width: 150,
      sortable: false,
      renderCell: params => {
        return (
          <Box sx={{ width: '100%' }}>
            <Box>
              <GridEdit
                disabled={!UPDATE}
                onClick={() => {
                  setOpenEdit({
                    open: true,
                    id: String(params.id)
                  })
                }}
              />
              <GridDelete
                disabled={!DELETE}
                onClick={() => {
                  setOpenConfirmationDeleteComment({
                    open: true,
                    id: String(params.id)
                  })
                }}
              />
            </Box>
          </Box>
        )
      }
    }
  ]

  // ****** Custom pagination

  const PaginationComponent = () => {
    return (
      <CustomPagination
        pageSize={pageSize}
        page={page}
        rowLength={comments.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  // ****** Custom pagination

  // fetch API
  const handleGetListComments = () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    dispatch(getAllCommentsCMSAsync(query))
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('createdAt desc')
    }
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenConfirmationDeleteMultipleComment(true)
        break
      }
    }
  }

  const handleCloseEdit = () => {
    setOpenEdit({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteComment = () => {
    setOpenConfirmationDeleteComment({
      open: false,
      id: ''
    })
  }

  const handleDeleteComment = () => {
    dispatch(deleteCommentAsync(openConfirmationDeleteComment.id))
  }

  const handleCloseConfirmDeleteMultipleComment = () => {
    setOpenConfirmationDeleteMultipleComment(false)
  }

  const handleDeleteMultipleComment = () => {
    dispatch(
      deleteMultipleCommentAsync({
        commentIds: selectedRow
      })
    )
  }

  // side effects

  useEffect(() => {
    handleGetListComments()
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])

  useEffect(() => {
    if (isSuccessEdit) {
      toast.success(t('update_comment_success'))
      handleGetListComments()
      handleCloseEdit()
      dispatch(resetInitialState())
    } else if (isErrorEdit && messageErrorEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_USER[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('update_comment_error'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessEdit, isErrorEdit, messageErrorEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_comment_success'))
      handleGetListComments()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteComment()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('delete_comment_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('delete_multiple_comment_success'))
      handleGetListComments()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleComment()
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('delete_multiple_comment_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_comment')}
        description={t('confirm_delete_comment')}
        open={openConfirmationDeleteComment.open}
        handleClose={handleCloseConfirmDeleteComment}
        handleCancel={handleCloseConfirmDeleteComment}
        handleConfirm={handleDeleteComment}
      />
      <ConfirmationDialog
        title={t('title_delete_multiple_comment')}
        description={t('confirm_delete_multiple_comment')}
        open={openConfirmationDeleteMultipleComment}
        handleClose={handleCloseConfirmDeleteMultipleComment}
        handleCancel={handleCloseConfirmDeleteMultipleComment}
        handleConfirm={handleDeleteMultipleComment}
      />

      <EditComment open={openEdit.open} onClose={handleCloseEdit} commentId={openEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%',
          maxHeight: '100%',
          borderRadius: '15px'
        }}
      >
        <Grid container sx={{ height: '100%', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 4, width: '100%', gap: 4 }}>
            {!selectedRow?.length && (
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
              </Box>
            )}
          </Box>
          {selectedRow.length > 0 && (
            <TableHeader
              numRow={selectedRow?.length}
              onClear={() => setSelectedRow([])}
              actions={[{ label: t('delete'), value: 'delete', disabled: !DELETE }]}
              handleAction={handleAction}
            />
          )}
          <CustomDataGrid
            sx={
              {
                // '.row-selected': {
                //   backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)}`,
                //   color: `${theme.palette.primary.main}`
                // }
              }
            }
            rows={comments.data}
            columns={columns}
            autoHeight
            getRowId={row => row._id}
            pageSizeOptions={[5]}
            sortingMode='server'
            onSortModelChange={handleSort}
            sortingOrder={['desc', 'asc']}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnMenu
            slots={{
              pagination: PaginationComponent
            }}
            checkboxSelection
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              setSelectedRow(row as string[])
            }}
          />
        </Grid>
      </Box>
    </>
  )
}

export default CommentListPage
