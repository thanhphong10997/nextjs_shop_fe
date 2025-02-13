import { useTranslation } from 'react-i18next'
import { ROUTE_CONFIG } from './route'
import { PERMISSIONS } from './permission'

export type TVertical = {
  title: string
  icon: string
  path?: string
  permission?: string
  children?: {
    title: string
    icon: string
    path?: string
    permission?: string
  }[]
}
export const VerticalItems = () => {
  const { t } = useTranslation()

  return [
    {
      title: t('Dashboard'),
      icon: 'material-symbols:dashboard-outline',
      path: ROUTE_CONFIG.DASHBOARD,
      permission: PERMISSIONS.DASHBOARD
    },
    {
      title: t('System'),
      icon: 'eos-icons:file-system-outlined',
      children: [
        {
          title: t('User'),
          icon: 'ph:users-bold',
          path: ROUTE_CONFIG.SYSTEM.USER,
          permission: PERMISSIONS.SYSTEM.USER.VIEW
        },
        {
          title: t('Role'),
          icon: 'icon-park-outline:permissions',
          path: ROUTE_CONFIG.SYSTEM.ROLE,
          permission: PERMISSIONS.SYSTEM.ROLE.VIEW
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
          path: ROUTE_CONFIG.MANAGE_PRODUCT.PRODUCT,
          permission: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW
        },
        {
          title: t('Type_product'),
          icon: 'fluent-mdl2:product-variant',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
        },
        {
          title: t('Comment'),
          icon: 'material-symbols-light:comment',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.COMMENT
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
          path: ROUTE_CONFIG.MANAGE_ORDER.ORDER,
          permission: PERMISSIONS.MANAGE_ORDER.ORDER.VIEW
        },
        {
          title: t('List_review'),
          icon: 'carbon:star-review',
          path: ROUTE_CONFIG.MANAGE_ORDER.MANAGE_REVIEW
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
