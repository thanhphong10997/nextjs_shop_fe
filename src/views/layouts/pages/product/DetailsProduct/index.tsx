// Import Next
import { NextPage } from 'next'
import Image from 'next/image'

// Import components
import Spinner from 'src/components/spinner'
import NoData from 'src/components/no-data'
import ProductCardRelated from '../components/ProductCardRelated'
import ReviewCard from '../components/ReviewCard'
import SkeletonCardRelated from '../components/SkeletonCardRelated'

// Import Mui
import { Box, Button, Grid, useTheme, Typography, Rating, IconButton, TextField } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// utils
import {
  cloneDeep,
  convertUpdateProductToCart,
  formatFilter,
  formatNumberToLocal,
  isExpiry,
  toFullName
} from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// router
import { useRouter } from 'next/router'

// types
import { TProduct } from 'src/types/product'
import { TParamsReviewItem } from 'src/types/reviews'

// auth
import { useAuth } from 'src/hooks/useAuth'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'
import { resetInitialState } from 'src/stores/reviews'
import { resetInitialState as resetInitialStateComment } from 'src/stores/comments'

// others
import { Icon } from '@iconify/react/dist/iconify.js'
import { getDetailsProductPublicBySlug, getListRelatedProductBySlug } from 'src/services/product'
import { getAllReviews } from 'src/services/review-product'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { ROUTE_CONFIG } from 'src/configs/route'
import { OBJECT_TYPE_ERROR_REVIEW } from 'src/configs/error'
import toast from 'react-hot-toast'
import CustomCarousel from 'src/components/custom-carousel'
import CommentItem from '../components/CommentItem'
import CommentInput from '../components/CommentInput'
import { getAllPublicComments } from 'src/services/comment-product'
import { TCommentItemProduct } from 'src/types/comment'
import { createCommentAsync } from 'src/stores/comments/actions'
import connectSocketIO from 'src/helpers/socket'
import { ACTION_SOCKET_COMMENT } from 'src/configs/socket'
import { TItemOrderProduct } from 'src/types/order-product'

type TProps = {}

export const DetailsProductPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // react
  const [loading, setLoading] = useState(false)
  const [dataProduct, setDataProduct] = useState<TProduct | any>({})
  const [amountProduct, setAmountProduct] = useState(1)
  const [listRelatedProduct, setRelatedProduct] = useState<TProduct[]>([])
  const [reviewList, setReviewList] = useState<TParamsReviewItem[]>([])
  const [listComment, setListComment] = useState<{ data: TCommentItemProduct[]; total: number }>({
    data: [],
    total: 0
  })

  // router
  const router = useRouter()

  // get slug from web address
  const productId = router.query?.productId as string

  // auth
  const { user } = useAuth()

  // redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const {
    isSuccessEdit,
    isErrorEdit,
    messageErrorEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,

    typeError
  } = useSelector((state: RootState) => state.review)
  const {
    isSuccessCreate: isSuccessCreateComment,
    isErrorCreate: isErrorCreateComment,
    messageErrorCreate: messageErrorCreateComment,
    isSuccessReply,
    isErrorReply,
    messageErrorReply,
    isSuccessDelete: isSuccessDeleteComment,
    isErrorDelete: isErrorDeleteComment,
    messageErrorDelete: messageErrorDeleteComment,
    isSuccessEdit: isSuccessEditComment,
    isErrorEdit: isErrorEditComment,
    messageErrorEdit: messageErrorEditComment
  } = useSelector((state: RootState) => state.comments)
  const dispatch: AppDispatch = useDispatch()

  const memoIsExpiry = React.useMemo(() => {
    return isExpiry(dataProduct?.discountStartDate, dataProduct?.discountEndDate)
  }, [dataProduct])

  // recursive comment items
  const renderCommentItems = (item: TCommentItemProduct, level: number) => {
    level += 1

    return (
      <Box sx={{ marginLeft: `${40 * level}px`, my: 4 }}>
        <CommentItem item={item} />
        {item?.replies && item?.replies?.length > 0 && (
          <>
            {item?.replies?.map((reply: TCommentItemProduct) => {
              return <>{renderCommentItems(reply, level)}</>
            })}
          </>
        )}
      </Box>
    )
  }

  // fetch api
  const fetchGetDetailsProduct = async (slug: string) => {
    setLoading(true)
    await getDetailsProductPublicBySlug(slug)
      .then(async res => {
        const data = res?.data
        if (data) {
          setDataProduct(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const fetchListRelatedProduct = async (slug: string) => {
    setLoading(true)
    await getListRelatedProductBySlug({ params: { slug: slug } })
      .then(async res => {
        const data = res?.data
        if (data) {
          setRelatedProduct(data?.products)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const fetchGetAllReviewListByProduct = async (id: string) => {
    setLoading(true)
    await getAllReviews({
      params: {
        limit: -1,
        page: -1,
        order: 'createdAt desc',
        isPublic: true,
        ...formatFilter({ productId: id })
      }
    })
      .then(async res => {
        const data = res?.data?.reviews
        if (data) {
          setReviewList(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const fetchListCommentProduct = async () => {
    setLoading(true)
    await getAllPublicComments({
      params: { limit: -1, page: -1, order: 'createdAt desc', isPublic: true, productId: dataProduct?._id }
    })
      .then(async res => {
        const data = res?.data
        if (data) {
          setListComment({
            data: data?.comments,
            total: data?.totalCount
          })
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // handle
  const handleUpdateProductToCart = (item: TProduct) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const discountItem = isExpiry(item?.discountStartDate, item?.discountEndDate) ? item?.discount : 0
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item?.name,
      amount: amountProduct,
      image: item?.image,
      price: item?.price,
      discount: discountItem,
      product: {
        _id: item?._id,
        slug: item?.slug,
        countInStock: item?.countInStock
      }
    })

    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const handleBuyProductToCart = (item: TProduct) => {
    handleUpdateProductToCart(item)

    // ROUTE_CONFIG.MY_CART is the custom URL so the cart page won't show the query on the router and the query data will be gone if the page reloads
    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,

        query: {
          selected: item?._id
        }
      },
      ROUTE_CONFIG.MY_CART
    )
  }

  const handleCancelComment = () => {}

  const handleComment = (comment: string) => {
    if (comment) {
      if (user) {
        dispatch(
          createCommentAsync({
            user: user?._id,
            product: dataProduct?._id,
            content: comment
          })
        )
      } else {
        router.replace({
          pathname: ROUTE_CONFIG.LOGIN,
          query: { returnUrl: router.asPath }
        })
      }
    }
  }

  // Recursive
  const findCommentByIdRecursive = (
    listComment: TCommentItemProduct[],
    id: string
  ): undefined | TCommentItemProduct => {
    for (const comment of listComment) {
      if (comment?._id === id) {
        return comment
      }
      if (comment?.replies && comment?.replies?.length > 0) {
        const replyComment: undefined | TCommentItemProduct = findCommentByIdRecursive(comment.replies, id)
        if (replyComment) return replyComment
      }
    }

    return undefined
  }

  const deleteCommentByIdRecursive = (
    listComment: TCommentItemProduct[],
    id: string
  ): undefined | TCommentItemProduct => {
    const commentIndex = listComment?.findIndex((comment: TCommentItemProduct) => comment?._id === id)
    if (commentIndex !== -1) {
      const commentItem = listComment[commentIndex]
      listComment.splice(commentIndex, 1)

      return commentItem
    }
    for (const comment of listComment) {
      if (comment?.replies && comment?.replies?.length > 0) {
        const deleteReplyComment: undefined | TCommentItemProduct = deleteCommentByIdRecursive(comment.replies, id)
        if (deleteReplyComment) return deleteReplyComment
      }
    }

    return undefined
  }

  const deleteManyCommentByIdRecursive = (listComment: TCommentItemProduct[], ids: string[]) => {
    let deleteCount: number = 0
    ids.forEach((id: string) => {
      const commentIndex = listComment?.findIndex((comment: TCommentItemProduct) => comment?._id === id)
      if (commentIndex !== -1) {
        listComment.splice(commentIndex, 1)
        console.log('deletedCountIn', { deleteCount })
        deleteCount += 1
      }
    })
    for (const comment of listComment) {
      if (comment?.replies && comment?.replies?.length > 0) {
        deleteManyCommentByIdRecursive(comment.replies, ids)
      }
    }

    return deleteCount
  }

  // side effects
  useEffect(() => {
    if (productId) {
      fetchGetDetailsProduct(productId)
      fetchListRelatedProduct(productId)
      fetchListCommentProduct()
    }
  }, [productId])

  useEffect(() => {
    if (dataProduct?._id) {
      fetchGetAllReviewListByProduct(dataProduct?._id)
    }
  }, [dataProduct?._id])

  useEffect(() => {
    const socket = connectSocketIO()
    const cloneListComment = cloneDeep(listComment)
    socket.on(ACTION_SOCKET_COMMENT.CREATE_COMMENT, data => {
      const newListCommentData = cloneListComment?.data
      newListCommentData?.unshift({ ...data })
      setListComment({
        data: newListCommentData,
        total: cloneListComment?.total + 1
      })
    })

    socket.on(ACTION_SOCKET_COMMENT.UPDATE_COMMENT, data => {
      const newListCommentData = cloneListComment?.data
      const findUpdateComment = findCommentByIdRecursive(newListCommentData, data?._id)
      if (findUpdateComment) {
        findUpdateComment.content = data?.content
        setListComment(cloneListComment)
      }
    })

    socket.on(ACTION_SOCKET_COMMENT.REPLY_COMMENT, data => {
      const newListCommentData = cloneListComment?.data
      const formatCommentList = newListCommentData?.map((comment: TCommentItemProduct) => {
        if (comment?._id === data?.parent) {
          comment?.replies?.push({ ...data })
        }

        return comment
      })

      setListComment({
        data: formatCommentList,
        total: cloneListComment?.total + 1
      })
    })

    socket.on(ACTION_SOCKET_COMMENT.DELETE_COMMENT, data => {
      const newListCommentData = cloneListComment?.data
      const deleteComment = deleteCommentByIdRecursive(newListCommentData, data?._id)
      if (deleteComment) {
        const totalDeleteItems = (deleteComment?.replies?.length ? deleteComment.replies.length : 0) + 1
        setListComment({
          data: newListCommentData,
          total: cloneListComment?.total - totalDeleteItems
        })
      }
    })

    socket.on(ACTION_SOCKET_COMMENT.DELETE_MULTIPLE_COMMENT, data => {
      const deletedCount = deleteManyCommentByIdRecursive(cloneListComment?.data, data)
      console.log('deletedCountOut', { deletedCount })

      setListComment({
        data: cloneListComment?.data,
        total: cloneListComment?.total - deletedCount
      })
    })

    // clean up
    return () => {
      socket.disconnect()
    }
  }, [listComment])

  console.log('listComment', { listComment })

  // review
  useEffect(() => {
    if (messageErrorEdit) {
      if (isSuccessEdit) {
        toast.success(t('update_review_success'))
        fetchGetAllReviewListByProduct(dataProduct?._id)
        dispatch(resetInitialState())
      } else if (isErrorEdit && typeError) {
        const errorConfig = OBJECT_TYPE_ERROR_REVIEW[typeError]
        if (errorConfig) {
          toast.error(t(errorConfig))
        } else {
          toast.error(t('update_review_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isSuccessEdit, isErrorEdit, messageErrorEdit, typeError])

  useEffect(() => {
    if (messageErrorDelete) {
      if (isSuccessDelete) {
        toast.success(t('delete_review_success'))
        fetchGetAllReviewListByProduct(dataProduct?._id)
        dispatch(resetInitialState())
      } else if (isErrorDelete) {
        toast.error(t('delete_review_error'))
        dispatch(resetInitialState())
      }
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  // comment
  useEffect(() => {
    if (messageErrorCreateComment) {
      if (isSuccessCreateComment) {
        toast.success(t('create_comment_success'))

        // fetchListCommentProduct()
        dispatch(resetInitialStateComment())
      } else if (isErrorCreateComment) {
        toast.error(t('create_comment_error'))
        dispatch(resetInitialStateComment())
      }
    }
  }, [isSuccessCreateComment, isErrorCreateComment, messageErrorCreateComment])

  useEffect(() => {
    if (messageErrorReply) {
      if (isSuccessReply) {
        toast.success(t('reply_comment_success'))

        // fetchListCommentProduct()
        dispatch(resetInitialStateComment())
      } else if (isErrorReply) {
        toast.error(t('reply_comment_error'))
        dispatch(resetInitialStateComment())
      }
    }
  }, [isSuccessReply, isErrorReply, messageErrorReply])

  useEffect(() => {
    if (messageErrorDeleteComment) {
      if (isSuccessDeleteComment) {
        toast.success(t('delete_comment_success'))

        // fetchListCommentProduct()
        dispatch(resetInitialStateComment())
      } else if (isErrorDeleteComment) {
        toast.error(t('delete_comment_error'))
        dispatch(resetInitialStateComment())
      }
    }
  }, [isSuccessDeleteComment, isErrorDeleteComment, messageErrorDeleteComment])

  useEffect(() => {
    if (messageErrorEditComment) {
      if (isSuccessEditComment) {
        toast.success(t('update_comment_success'))

        // fetchListCommentProduct()
        dispatch(resetInitialStateComment())
      } else if (isErrorEditComment) {
        toast.error(t('update_comment_error'))
        dispatch(resetInitialStateComment())
      }
    }
  }, [isSuccessEditComment, isErrorEditComment, messageErrorEditComment])

  return (
    <>
      {loading && <Spinner />}
      <Grid container>
        <Box
          sx={{
            width: '100%',
            borderRadius: '15px',
            mt: '0!important',
            py: '20px',
            px: 4
          }}
          display={{ md: 'block', xs: 'none' }}
          marginTop={{ md: 5, xs: 5 }}
        >
          <Typography sx={{ color: theme.palette.primary.main }}>
            {t('details_product')} / {dataProduct?.type?.name} / {dataProduct?.name}
          </Typography>
        </Box>
        {/* First section */}
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}
        >
          <Box sx={{ heigh: '100%', width: '100%' }}>
            <Grid container spacing={8}>
              <Grid item md={5} xs={12}>
                <Image
                  src={dataProduct?.image || ''}
                  width={0}
                  height={0}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '15px'
                  }}
                  alt='banner'
                />
              </Grid>
              <Grid item md={7} xs={12}>
                <Box>
                  <Typography
                    variant='h3'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {dataProduct?.name}
                  </Typography>
                </Box>
                {dataProduct.countInStock > 0 ? (
                  <>
                    {t('remain')} <b>{dataProduct?.countInStock}</b> {t('stock_product')}
                  </>
                ) : (
                  <Box
                    sx={{
                      backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                      width: '60px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '2px',
                      my: 1
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme.palette.error.main,
                        fontSize: '12px',
                        lineHeight: 1,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {t('out_of_stock')}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  {dataProduct.averageRating > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant='h3'
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        {Math.ceil(dataProduct?.averageRating)}
                      </Typography>
                      <Rating
                        sx={{ fontSize: '16px' }}
                        name='read-only'
                        defaultValue={Math.ceil(dataProduct?.averageRating)}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                  )}
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    {!!dataProduct?.totalReviews ? (
                      <span>
                        <b>{dataProduct?.totalReviews}</b> {t('Review')}
                      </span>
                    ) : (
                      <span>{t('not_review')}</span>
                    )}
                  </Typography>
                  {'|'}
                  {dataProduct.sold > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        {/* {t('sold_product', { count: dataProduct.sold })} */}
                        {t('sold')} <b>{dataProduct?.sold}</b> {t('product')}
                      </Typography>
                    </Box>
                  )}
                </Box>
                {dataProduct?.location?.name && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Icon icon='bx:map' />
                    <Typography
                      variant='h6'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        mt: 1
                      }}
                    >
                      {dataProduct?.location?.name}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  {dataProduct.discount > 0 && memoIsExpiry && (
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme.palette.error.main,
                        fontWeight: 'bold',
                        textDecoration: 'line-through',
                        fontSize: '18px'
                      }}
                    >
                      {formatNumberToLocal(dataProduct?.price)} VND
                    </Typography>
                  )}
                  <Typography
                    variant='h4'
                    sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '24px' }}
                  >
                    {formatNumberToLocal((dataProduct?.price * (100 - dataProduct.discount)) / 100)} VND
                  </Typography>
                  {dataProduct.discount > 0 && memoIsExpiry && (
                    <Box
                      sx={{
                        backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                        width: '32px',
                        height: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '2px'
                      }}
                    >
                      <Typography
                        variant='h6'
                        sx={{
                          color: theme.palette.error.main,
                          fontSize: '10px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        - {dataProduct?.discount}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ flexBasis: '10%', mt: 8, display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}`,
                      color: `${theme.palette.common.white}`,
                      '&:hover': { backgroundColor: `${theme.palette.primary.main}!important` }
                    }}
                    onClick={() => {
                      if (amountProduct > 1) {
                        setAmountProduct(prev => prev - 1)
                      }
                    }}
                  >
                    <Icon icon='lucide:minus' fontSize={12} />
                  </IconButton>
                  <TextField
                    type='number'
                    value={amountProduct}
                    sx={{
                      '.MuiInputBase-root.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '.MuiInputBase-input.MuiOutlinedInput-input': {
                        width: '30px',
                        padding: '4px 8px',
                        textAlign: 'center'
                      },
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },

                      // Hide increase/decrease button
                      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none'
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield'
                      }

                      // Hide increase/decrease button
                    }}
                    inputProps={{
                      inputMode: 'numeric',
                      min: 1,
                      max: dataProduct?.countInStock
                    }}
                    onChange={e => {
                      // replace all of characters into empty string, only accept numbers
                      setAmountProduct(+e.target.value)
                    }}
                  />
                  <IconButton
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}`,
                      color: `${theme.palette.common.white}`,
                      '&:hover': { backgroundColor: `${theme.palette.primary.main}!important` }
                    }}
                    onClick={() => {
                      if (amountProduct < dataProduct.countInStock) {
                        setAmountProduct(prev => prev + 1)
                      }
                    }}
                  >
                    <Icon icon='meteor-icons:plus' fontSize={12} />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    gap: 6,
                    mt: 8
                  }}
                >
                  <Button
                    disabled={dataProduct?.countInStock < 1}
                    type='submit'
                    variant='outlined'
                    color='primary'
                    sx={{ height: '40px', display: 'flex' }}
                    onClick={() => handleUpdateProductToCart(dataProduct)}
                  >
                    {t('add_to_cart')}
                  </Button>
                  <Button
                    disabled={dataProduct?.countInStock < 1}
                    type='submit'
                    variant='contained'
                    color='primary'
                    sx={{ height: '40px', display: 'flex' }}
                    onClick={() => handleBuyProductToCart(dataProduct)}
                  >
                    {t('buy_now')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Second section */}
        <Grid container md={12} xs={12} marginTop={{ md: 5, xs: 5 }}>
          <Grid container>
            {/* Description */}
            <Grid container item md={9} xs={12}>
              <Box sx={{ width: '100%' }}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '15px',
                    py: '20px',
                    px: 4
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      backgroundColor: theme.palette.customColors.bodyBg,
                      padding: '8px',
                      borderRadius: '8px'
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        color: `${theme.palette.customColors.main}ad`,
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}
                    >
                      {t('product_description')}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 4,
                      p: 4,
                      fontSize: '14px',
                      backgroundColor: theme.palette.customColors.bodyBg,
                      borderRadius: '8px'
                    }}
                    dangerouslySetInnerHTML={{ __html: dataProduct?.description }}
                  />
                </Box>
                {/* Description */}
                {/* Review on PC*/}
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '15px',
                    py: '20px',
                    px: 4
                  }}
                  display={{ md: 'block', xs: 'none' }}
                  marginTop={{ md: 5, xs: 5 }}
                >
                  <Typography fontSize={16} fontWeight={600}>
                    {t('product_reviews')}
                    {'( '}
                    {reviewList?.length > 0 && reviewList?.length}
                    {' )'}
                  </Typography>
                  <Box sx={{ width: '100%', mt: 4 }}>
                    <CustomCarousel
                      arrows
                      showDots={true}
                      ssr={true}
                      responsive={{
                        desktop: {
                          breakpoint: { max: 3000, min: 1024 },
                          items: 3,
                          slidesToSlide: 3 // optional, default to 1.
                        },
                        tablet: {
                          breakpoint: { max: 1024, min: 464 },
                          items: 2,
                          slidesToSlide: 2 // optional, default to 1.
                        },
                        mobile: {
                          breakpoint: { max: 464, min: 0 },
                          items: 1,
                          slidesToSlide: 1 // optional, default to 1.
                        }
                      }}
                    >
                      {reviewList?.length > 0 &&
                        reviewList?.map((item: TParamsReviewItem) => {
                          return (
                            <Box key={item?._id} sx={{ margin: '0 10px' }}>
                              <ReviewCard item={item} />
                            </Box>
                          )
                        })}
                    </CustomCarousel>
                  </Box>
                </Box>

                {/* Review on PC*/}

                {/* Comment on PC */}

                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '15px',
                    py: '20px',
                    px: 4
                  }}
                  display={{ md: 'block', xs: 'none' }}
                  marginTop={{ md: 5, xs: 5 }}
                >
                  <Typography fontSize={16} fontWeight={600}>
                    {t('comment_product')} <b style={{ color: theme.palette.primary.main }}> {listComment?.total}</b>{' '}
                    {t('comments')}
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    <CommentInput onApply={handleComment} onCancel={handleCancelComment} />

                    {/* list comments */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: '20px',
                        maxHeight: '500px',
                        overflow: 'auto'
                      }}
                    >
                      {listComment?.data?.map((comment: TCommentItemProduct) => {
                        const level: number = -1

                        return <>{renderCommentItems(comment, level)}</>
                      })}
                    </Box>
                  </Box>
                </Box>

                {/* Comment on PC */}
              </Box>
            </Grid>

            {/* Relate products */}
            <Grid container item md={3} xs={12} mt={{ md: 0, xs: 5 }}>
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '15px',
                  py: '20px',
                  px: 4
                }}
                marginLeft={{ md: 5, xs: 0 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      color: `${theme.palette.customColors.main}ad`,
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}
                  >
                    {t('same_product')}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    padding: '8px'
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {Array.from({ length: 6 }).map((_, index) => {
                        return <SkeletonCardRelated key={index} />
                      })}
                    </Box>
                  ) : (
                    <>
                      {listRelatedProduct?.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {listRelatedProduct?.map(item => {
                            return <ProductCardRelated key={item._id} item={item} />
                          })}
                        </Box>
                      ) : (
                        <Box sx={{ width: '100%', mt: 10 }}>
                          <NoData widthImage='60px' heightImage='60px' textNodata={t('no_product')} />
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
            {/* Relate products */}

            {/* Review on mobile*/}
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                width: '100%',
                py: '20px',
                px: 4
              }}
              display={{ md: 'none', xs: 'block' }}
              marginTop={{ md: 5, xs: 5 }}
            >
              <Typography fontSize={16} fontWeight={600}>
                {t('product_reviews')}
                {'( '}
                {reviewList?.length > 0 && reviewList?.length}
                {' )'}
              </Typography>
              <Box sx={{ width: '100%', mt: 4 }}>
                <CustomCarousel
                  arrows={false}
                  showDots={true}
                  ssr={true}
                  responsive={{
                    desktop: {
                      breakpoint: { max: 3000, min: 1024 },
                      items: 3,
                      slidesToSlide: 3 // optional, default to 1.
                    },
                    tablet: {
                      breakpoint: { max: 1024, min: 464 },
                      items: 2,
                      slidesToSlide: 2 // optional, default to 1.
                    },
                    mobile: {
                      breakpoint: { max: 464, min: 0 },
                      items: 1,
                      slidesToSlide: 1 // optional, default to 1.
                    }
                  }}
                >
                  {reviewList?.length > 0 &&
                    reviewList?.map((item: TParamsReviewItem) => {
                      return (
                        <Box key={item?._id} sx={{ margin: '0 10px' }}>
                          <ReviewCard item={item} />
                        </Box>
                      )
                    })}
                </CustomCarousel>
              </Box>
            </Box>

            {/* Review on mobile*/}

            {/* comment on mobile */}
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                width: '100%',
                py: '20px',
                px: 4
              }}
              display={{ md: 'none', xs: 'block' }}
              marginTop={{ md: 5, xs: 5 }}
            >
              <Typography fontSize={16} fontWeight={600}>
                {t('comment_product')} <b style={{ color: theme.palette.primary.main }}> {listComment?.total}</b>{' '}
                {t('comments')}
              </Typography>
              <Box sx={{ width: '100%' }}>
                <CommentInput onApply={handleComment} onCancel={handleCancelComment} />

                {/* comment */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: '20px',
                    maxHeight: '300px',
                    overflow: 'auto'
                  }}
                >
                  {listComment?.data?.map((comment: TCommentItemProduct) => {
                    const level: number = -1

                    return <>{renderCommentItems(comment, level)}</>
                  })}
                </Box>
              </Box>
            </Box>

            {/* comment on mobile */}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailsProductPage
