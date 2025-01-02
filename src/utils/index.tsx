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

export const formatDate = (
  value: Date | string,
  formatting: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value

  return new Intl.DateTimeFormat('vi-VN', formatting).format(new Date(value))
}
