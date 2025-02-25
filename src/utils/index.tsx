import { EditorState, ContentState } from 'draft-js'
import { TItemOrderProduct } from 'src/types/order-product'

// fix window is not defined with html-to-draftjs
let htmlToDraft = null
if (typeof window === 'object') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  htmlToDraft = require('html-to-draftjs').default
}

export const toFullName = (lastName: string, middleName: string, firstName: string, language: string) => {
  if (language === 'vi') {
    return `${lastName ? lastName : ''} ${middleName ? middleName : ''} ${firstName ? firstName : ''}`.trim()
  }

  return `${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`.trim()
}

export const convertFileToBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const convertFullName = (fullName: string, language: string) => {
  const result = {
    firstName: '',
    middleName: '',
    lastName: ''
  }

  // Convert the fullname string to an array without spacing
  // filter(Boolean) -> remove extra spaces after split string
  const arrFullName = fullName.trim().split(' ').filter(Boolean)
  if (arrFullName.length === 1) {
    if (language === 'vi') {
      result.firstName = arrFullName[0]
    } else if (language === 'en') {
      result.lastName = arrFullName[0]
    }
  } else if (arrFullName.length === 2) {
    if (language === 'vi') {
      result.firstName = arrFullName[1]
      result.lastName = arrFullName[0]
    } else if (language === 'en') {
      result.firstName = arrFullName[0]
      result.lastName = arrFullName[1]
    }
  } else if (arrFullName.length >= 3) {
    if (language === 'vi') {
      result.firstName = arrFullName[arrFullName.length - 1]
      result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
      result.lastName = arrFullName[0]
    } else if (language === 'en') {
      result.firstName = arrFullName[0]
      result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
      result.lastName = arrFullName[arrFullName.length - 1]
    }
  }

  return result
}

export const getAllObjectValues = (object: any, arrExclude?: string[]) => {
  try {
    const values: any = []
    for (const key in object) {
      // If the key of the object is also a object
      if (typeof object[key] === 'object') {
        values.push(...getAllObjectValues(object[key], arrExclude))
      } else {
        if (!arrExclude?.includes(object[key])) values.push(object[key])
      }
    }

    return values
  } catch (err) {
    return []
  }
}

export const formatFilter = (filter: any) => {
  const result: Record<string, string> = {}
  Object.keys(filter)?.forEach((key: string) => {
    if (Array.isArray(filter[key]) && filter[key].length > 0) {
      result[key] = filter[key].join('|')
    } else if (filter[key]) {
      result[key] = filter[key]
    }
  })

  return result
}

export const stringToSlug = (str: string) => {
  // remove accents
  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i])
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')

  return str
}

export const convertHTMLToDraft = (html: string) => {
  const blocksFromHtml = htmlToDraft(html)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
  const editorState = EditorState.createWithContent(contentState)

  return editorState
}

export const formatNumberToLocal = (value: string | number) => {
  try {
    return Number(value).toLocaleString('vi-VN', {
      minimumFractionDigits: 0
    })
  } catch (e) {
    return value
  }
}

export const cloneDeep = (data: any) => {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return data
  }
}

export const convertUpdateProductToCart = (orderItems: TItemOrderProduct[], addItem: TItemOrderProduct) => {
  try {
    let result = []
    const cloneOrderItems = cloneDeep(orderItems)
    const findItems = cloneOrderItems.find((item: TItemOrderProduct) => item?.product?._id === addItem?.product?._id)
    console.log('findItems', { findItems })

    // Item is already in cart, so just increase the quantity
    if (findItems) {
      findItems.amount += addItem.amount
    } else {
      cloneOrderItems.push(addItem)
    }

    // Remove the item which have the quantity = 0
    result = cloneOrderItems.filter((item: TItemOrderProduct) => item.amount)

    return result
  } catch (e) {
    return orderItems
  }
}

export const convertUpdateMultipleCartProduct = (orderItems: TItemOrderProduct[], addItems: TItemOrderProduct[]) => {
  try {
    let result = []
    const cloneOrderItems = cloneDeep(orderItems)
    addItems.forEach((addItem: TItemOrderProduct) => {
      const findItems = cloneOrderItems.find((item: TItemOrderProduct) => item?.product?._id === addItem?.product?._id)
      console.log('findItems', { findItems })

      // Item is already in cart, so just increase the quantity
      if (findItems) {
        findItems.amount += addItem.amount
      } else {
        cloneOrderItems.push(addItem)
      }
    })

    // Remove the item which have the quantity = 0
    result = cloneOrderItems.filter((item: TItemOrderProduct) => item.amount)
    console.log('result', { result })

    return result
  } catch (e) {
    return orderItems
  }
}

export const isExpiry = (startDate: Date | null, endDate: Date | null) => {
  if (startDate && endDate) {
    const currentTime = new Date().getTime()
    const startDateTime = new Date(startDate).getTime()
    const endDateTime = new Date(endDate).getTime()

    return startDateTime <= currentTime && endDateTime > currentTime
  }

  return false
}

export const getTextFromHTML = (html: string) => {
  const newElement = document.createElement('div')
  newElement.innerHTML = html

  return newElement.textContent || newElement.innerText
}
