import { Icon } from '@iconify/react/dist/iconify.js'
import { Box, Button, Card, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Spinner from 'src/components/spinner'
import { ROUTE_CONFIG } from 'src/configs/route'
import { getVNPayIpnPaymentVNPay } from 'src/services/payment'
import { formatNumberToLocal } from 'src/utils'

const PaymentVNPay = () => {
  const { t } = useTranslation()

  // hooks
  const theme = useTheme()
  const router = useRouter()

  // get the query params from vnpay after payment
  const { vnp_SecureHash, vnp_ResponseCode, vnp_TxnRef, ...rests } = router?.query

  // state
  const [paymentData, setPaymentData] = useState({
    status: '',
    totalPrice: 0
  })

  // fetch API
  const fetchGetIpnVNPay = async (param: any) => {
    await getVNPayIpnPaymentVNPay({
      params: { ...param }
    }).then(res => {
      console.log('res', { res })
      const data = res?.data
      if (data) {
        setPaymentData({
          status: data?.RspCode,
          totalPrice: data?.totalPrice
        })
      }
    })
  }

  useEffect(() => {
    if (vnp_SecureHash && vnp_ResponseCode && vnp_TxnRef) {
      fetchGetIpnVNPay({ vnp_SecureHash, vnp_ResponseCode, orderId: vnp_TxnRef, vnp_TxnRef, ...rests })
    }
  }, [vnp_SecureHash, vnp_ResponseCode, vnp_TxnRef])

  return (
    <>
      {!paymentData.status && <Spinner />}
      <Card sx={{ padding: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 600, color: theme.palette.primary.main }}>
            {formatNumberToLocal(paymentData?.totalPrice)} VND
          </Typography>
        </Box>

        {/* fix case payment error will show the first time after reload pages  */}
        {paymentData.status && (
          <>
            {paymentData.status === '00' ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px'
                  }}
                >
                  <Icon icon='ooui:success' style={{ fontSize: '50px', color: theme.palette.success.main }} />
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{t('payment_success')}</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px'
                  }}
                >
                  <Icon
                    icon='fluent:warning-28-regular'
                    style={{ fontSize: '50px', color: theme.palette.warning.main }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{t('payment_error')}</Typography>
              </Box>
            )}
          </>
        )}

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mt: 4
          }}
        >
          <Button variant='contained' onClick={() => router.push(ROUTE_CONFIG.HOME)}>
            {t('return_home')}
          </Button>
        </Box>
      </Card>
    </>
  )
}

export default PaymentVNPay
