import { useTranslation } from 'react-i18next'

export const PAYMENT_TYPES = () => {
  const { t } = useTranslation()

  return {
    PAYMENT_LATER: {
      label: t('payment_later_type'),
      value: 'PAYMENT_LATER'
    },
    VN_PAYMENT: {
      label: t('vn_payment_type'),
      value: 'VN_PAYMENT'
    },
    PAYPAL: {
      label: t('paypal_type'),
      value: 'PAYPAL'
    }
  }
}
