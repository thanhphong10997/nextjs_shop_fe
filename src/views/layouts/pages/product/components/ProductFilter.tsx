// react
import * as React from 'react'

// mui
import { styled, useTheme } from '@mui/material/styles'
import { Box, BoxProps, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

// translate
import { useTranslation } from 'react-i18next'

// configs
import { FILTER_REVIEW_PRODUCT } from 'src/configs/product'

type TProductFilter = {
  handleFilterProduct: (value: string) => void
}

const StyledFilterProduct = styled(Box)<BoxProps>(({ theme }) => {
  return {
    boxShadow: theme.shadows[4],
    border: `1px solid  ${theme.palette.customColors.main}33`,
    borderRadius: '15px',
    padding: '10px',
    backgroundColor: theme.palette.background.paper
  }
})

const ProductFilter = (props: TProductFilter) => {
  // translate
  const { t, i18n } = useTranslation()

  // props
  const { handleFilterProduct } = props

  // theme
  const theme = useTheme()

  const listProductReview = FILTER_REVIEW_PRODUCT()

  const onChangeFilterReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterProduct(e.target.value)
  }

  return (
    <StyledFilterProduct sx={{ width: '100%' }}>
      <FormControl>
        <FormLabel id='radio-group-review' sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
          {t('Review')}
        </FormLabel>
        <RadioGroup aria-labelledby='radio-group-review' name='radio-buttons-group' onChange={onChangeFilterReview}>
          {listProductReview.map(review => {
            return <FormControlLabel key={review.value} value={review.value} control={<Radio />} label={review.label} />
          })}
        </RadioGroup>
      </FormControl>
    </StyledFilterProduct>
  )
}

export default ProductFilter
