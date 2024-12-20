import { useTranslation } from 'react-i18next'
import { ROUTE_CONFIG } from './route'

export type TVertical = {
  title: string
  icon: string
  path?: string
  children?: {
    title: string
    icon: string
    path?: string
  }[]
}
export const VerticalItems = () => {
  const { t } = useTranslation()

  return [
    {
      title: t('System'),
      icon: 'eos-icons:file-system-outlined',
      children: [
        {
          title: t('User'),
          icon: 'ph:users-bold',
          path: ROUTE_CONFIG.SYSTEM.USER
        },
        {
          title: t('Role'),
          icon: 'icon-park-outline:permissions',
          path: ROUTE_CONFIG.SYSTEM.ROLE
        }
      ]
    },
    {
      title: t('Manage_product'),
      icon: 'fluent-mdl2:product',
      children: [
        {
          title: t('List_product'),
          icon: 'fluent-mdl2:product-list',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.PRODUCT
        },
        {
          title: t('Type_product'),
          icon: 'fluent-mdl2:product-variant',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
        }
      ]
    },
    {
      title: t('Manage_order'),
      icon: 'icon-park-solid:transaction-order',
      children: [
        {
          title: t('List_order'),
          icon: 'lets-icons:order',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_ORDER
        },
        {
          title: t('List_review'),
          icon: 'carbon:star-review',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_REVIEW
        }
      ]
    },
    {
      title: t('Setting'),
      icon: 'uil:setting',
      children: [
        {
          title: t('City'),
          icon: 'mdi:city',
          path: ROUTE_CONFIG.SETTINGS.CITY
        },
        {
          title: t('Delivery_method'),
          icon: 'iconamoon:delivery-bold',
          path: ROUTE_CONFIG.SETTINGS.DELIVERY_TYPE
        },
        {
          title: t('Payment_method'),
          icon: 'fluent:payment-16-regular',
          path: ROUTE_CONFIG.SETTINGS.PAYMENT_TYPE
        }
      ]
    }
  ]
}
