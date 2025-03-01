// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, ChipProps, Grid, Tooltip, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// Import React
import React, { useCallback, useEffect, useMemo, useState } from 'react'

// Import redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/reviews'
import { deleteMultipleReviewAsync, deleteReviewAsync, getAllReviewsAsync } from 'src/stores/reviews/actions'

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
import EditReview from './components/EditReview'
import CustomSelect from 'src/components/custom-select'

// react toast
import toast from 'react-hot-toast'

// config
import { OBJECT_TYPE_ERROR_USER } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { FILTER_REVIEW_CMS } from 'src/configs/reviews'

// utils
import { formatFilter, toFullName } from 'src/utils'

// hooks
import { usePermission } from 'src/hooks/usePermission'
import TableHeader from 'src/components/table-header'

type TProps = {}

export const ReviewListPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  const reviewOptions = FILTER_REVIEW_CMS()

  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openEdit, setOpenEdit] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteReview, setOpenConfirmationDeleteReview] = useState({
    open: false,
    id: ''
  })
  const [selectedRow, setSelectedRow] = useState<string[]>([])
  const [openConfirmationDeleteMultipleReview, setOpenConfirmationDeleteMultipleReview] = useState(false)

  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [filterBy, setFilterBy] = useState<Record<string, string | string[]>>({})
  const [starSelected, setStarSelected] = useState<string[]>([])

  // hooks
  const { VIEW, UPDATE, DELETE } = usePermission('SYSTEM.MANAGE_ORDER.ORDER', ['VIEW', 'UPDATE', 'DELETE'])

  // redux
  const {
    reviews,
    isLoading,
    isSuccessEdit,
    isErrorEdit,
    messageEdit,
    isSuccessDelete,
    isErrorDelete,
    messageDelete,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageMultipleDelete,
    typeError
  } = useSelector((state: RootState) => state.review)

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
      minWidth: 300,
      maxWidth: 300,
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
      field: 'star',
      headerName: t('star'),
      hideSortIcons: true,
      minWidth: 100,
      maxWidth: 100,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.star}</Typography>
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
                  setOpenConfirmationDeleteReview({
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
        rowLength={reviews.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  // ****** Custom pagination

  // fetch API
  const handleGetListReview = () => {
    const query = {
      params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) }
    }
    dispatch(getAllReviewsAsync(query))
  }

  // Handle
  const handleOnChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'delete': {
        setOpenConfirmationDeleteMultipleReview(true)
        break
      }
    }
  }, [])

  const handleCloseConfirmDeleteReview = useCallback(() => {
    setOpenConfirmationDeleteReview({
      open: false,
      id: ''
    })
  }, [])

  const handleDeleteReview = useCallback(() => {
    dispatch(deleteReviewAsync(openConfirmationDeleteReview.id))
  }, [])

  const handleCloseConfirmDeleteMultipleReview = useCallback(() => {
    setOpenConfirmationDeleteMultipleReview(false)
  }, [])

  const handleDeleteMultipleReview = useCallback(() => {
    dispatch(
      deleteMultipleReviewAsync({
        reviewIds: selectedRow
      })
    )
  }, [selectedRow])

  const handleCloseEdit = useCallback(() => {
    setOpenEdit({
      open: false,
      id: ''
    })
  }, [])

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('createdAt desc')
    }
  }

  // side effects

  useEffect(() => {
    setFilterBy({ minStar: starSelected })
  }, [starSelected])

  useEffect(() => {
    handleGetListReview()
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])

  useEffect(() => {
    if (isSuccessEdit) {
      toast.success(t('update_review_success'))
      handleGetListReview()
      handleCloseEdit()
      dispatch(resetInitialState())
    } else if (isErrorEdit && messageEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_USER[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        toast.error(t('update_review_error'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessEdit, isErrorEdit, messageEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_review_success'))
      handleGetListReview()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteReview()
    } else if (isErrorDelete && messageDelete) {
      toast.error(t('delete_review_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageDelete])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('delete_multiple_review_success'))
      handleGetListReview()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleReview()
    } else if (isErrorMultipleDelete && messageMultipleDelete) {
      toast.error(t('delete_multiple_review_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_review')}
        description={t('confirm_delete_review')}
        open={openConfirmationDeleteReview.open}
        handleClose={handleCloseConfirmDeleteReview}
        handleCancel={handleCloseConfirmDeleteReview}
        handleConfirm={handleDeleteReview}
      />
      <ConfirmationDialog
        title={t('title_delete_multiple_review')}
        description={t('confirm_delete_multiple_review')}
        open={openConfirmationDeleteMultipleReview}
        handleClose={handleCloseConfirmDeleteMultipleReview}
        handleCancel={handleCloseConfirmDeleteMultipleReview}
        handleConfirm={handleDeleteMultipleReview}
      />
      <EditReview open={openEdit.open} onClose={handleCloseEdit} reviewId={openEdit.id} />
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
            <Box sx={{ width: '200px' }}>
              <CustomSelect
                value={starSelected}
                options={reviewOptions}
                placeholder={t('review')}
                fullWidth
                multiple
                onChange={e => {
                  setStarSelected(e.target.value as string[])
                }}
              />
            </Box>
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
            rows={reviews.data}
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

export default ReviewListPage
