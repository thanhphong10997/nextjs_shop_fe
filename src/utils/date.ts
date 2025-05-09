export const getPastTime = (date: Date, t: any): string => {
  const currentDate: Date = new Date()
  const millisecondsInDay = 1000 * 60 * 60 * 24

  const pastTimeInMilliseconds: number = currentDate.getTime() - date.getTime()
  const pastTimeDate: number = pastTimeInMilliseconds / millisecondsInDay
  if (pastTimeDate < 30) {
    if (pastTimeDate < 1) {
      return t('recently')
    }

    return `${Math.floor(pastTimeDate)} ${t('days')}`
  } else if (pastTimeDate < 365) {
    const month: number = Math.floor(pastTimeDate / 30)

    return `${month} ${t('month')}`
  } else {
    const year: number = Math.floor(pastTimeDate / 365)

    return `${year} ${t('year')}`
  }
}

export const formatDate = (
  value: Date | string,
  formatting: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value

  return new Intl.DateTimeFormat('vi-VN', formatting).format(new Date(value))
}
