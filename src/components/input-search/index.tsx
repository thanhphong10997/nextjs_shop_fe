// Import Mui
import { InputBase, styled } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'
import useDebounce from 'src/hooks/useDebounce'

type TInputSearch = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.customColors.borderColor}`,
  marginLeft: 0,
  width: '100%',
  height: '38px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    width: '100%',
    padding: theme.spacing(1, 1, 1, 0),

    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`

    // transition: theme.transitions.create('width')
  }
}))

const InputSearch = (props: TInputSearch) => {
  // translate
  const { t } = useTranslation()

  // props
  const { value, onChange, placeholder = t('search') } = props

  // state
  const [search, setSearch] = useState(value)

  // hooks
  const debounceSearch = useDebounce(search, 500)

  // useEffect(() => {
  //   onChange(debounceSearch)
  // }, [debounceSearch])

  useEffect(() => {
    setSearch(value)
  }, [value])

  return (
    <Search>
      <SearchIconWrapper>
        <Icon icon='ic:baseline-search' />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
        value={search}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          if (e.key === 'Enter' && (e as any).target.value) {
            onChange((e as any).target.value)
          }
        }}
        onChange={e => {
          setSearch(e.target.value)

          // set default empty string for search input when remove values of the input search
          if (!e.target.value) {
            onChange(e.target.value)
          }
        }}
      />
    </Search>
  )
}

export default InputSearch
