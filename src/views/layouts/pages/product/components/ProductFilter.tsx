// react
import * as React from 'react'

// mui
import { styled, useTheme } from '@mui/material/styles'
import {
  Box,
  BoxProps,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip
} from '@mui/material'

// translate
import { useTranslation } from 'react-i18next'

// configs
import { FILTER_REVIEW_PRODUCT } from 'src/configs/product'
import { Icon } from '@iconify/react/dist/iconify.js'

type TProductFilter = {
  handleFilterProduct: (value: string, type: string) => void
  citiesOption: { label: string; value: string }[]
  reviewSelected: string
  locationSelected: string
  handleReset: () => void
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
  const { t } = useTranslation()

  // props
  const { handleFilterProduct, citiesOption, locationSelected, reviewSelected, handleReset } = props

  // theme
  const theme = useTheme()

  const listProductReview = FILTER_REVIEW_PRODUCT()

  const onChangeFilter = (value: string, type: string) => {
    handleFilterProduct(value, type)
  }

  // handle
  const handleResetFilter = () => {
    handleReset()
  }

  return (
    <StyledFilterProduct sx={{ width: '100%', padding: 4 }}>
      {Boolean(locationSelected || reviewSelected) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Tooltip title={t('delete_filter')}>
            <IconButton onClick={handleResetFilter}>
              <Icon icon='ic:outline-delete' />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box>
        <FormControl>
          <FormLabel id='radio-group-review' sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            {t('Review')}
          </FormLabel>
          <RadioGroup
            aria-labelledby='radio-group-review'
            name='radio-buttons-group'
            onChange={e => onChangeFilter(e.target.value, 'review')}
          >
            {listProductReview.map(review => {
              return (
                <FormControlLabel
                  key={review.value}
                  value={review.value}
                  control={<Radio checked={reviewSelected === review.value} />}
                  label={review.label}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box sx={{ mt: 2 }}>
        <FormControl>
          <FormLabel id='radio-group-location' sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            {t('location')}
          </FormLabel>
          <RadioGroup
            aria-labelledby='radio-group-location'
            name='radio-buttons-group'
            onChange={e => onChangeFilter(e.target.value, 'location')}
          >
            {citiesOption.map(city => {
              return (
                <FormControlLabel
                  key={city.value}
                  value={city.value}
                  control={<Radio checked={locationSelected === city.value} />}
                  label={city.label}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Box>
    </StyledFilterProduct>
  )
}

export default ProductFilter
