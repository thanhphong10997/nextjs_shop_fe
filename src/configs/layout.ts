import { ROUTE_CONFIG } from './route'

export const VerticalItems = [
  {
    title: 'Hệ thống',
    icon: 'eos-icons:file-system-outlined',
    children: [
      {
        title: 'Người dùng',
        icon: 'ph:users-bold',
        path: ROUTE_CONFIG.SYSTEM.USER
      },
      {
        title: 'Nhóm vai trò',
        icon: 'icon-park-outline:permissions',
        path: ROUTE_CONFIG.SYSTEM.ROLE
      }
    ]
  },
  {
    title: 'Quản trị sản phẩm',
    icon: 'fluent-mdl2:product',
    children: [
      {
        title: 'Danh sách sản phẩm',
        icon: 'fluent-mdl2:product-list',
        path: ROUTE_CONFIG.MANAGE_PRODUCT.PRODUCT
      },
      {
        title: 'Danh mục sản phẩm',
        icon: 'fluent-mdl2:product-variant',
        path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
      },

      {
        title: 'Danh sách đơn hàng',
        icon: 'lets-icons:order',
        path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_ORDER
      },
      {
        title: 'Danh sách đánh giá',
        icon: 'carbon:star-review',
        path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_REVIEW
      }
    ]
  },
  {
    title: 'Cài đặt',
    icon: 'uil:setting',
    children: [
      {
        title: 'Cài đặt thành phố',
        icon: 'mdi:city',
        path: ROUTE_CONFIG.SETTINGS.CITY
      },
      {
        title: 'Phương thức giao hàng',
        icon: 'iconamoon:delivery-bold',
        path: ROUTE_CONFIG.SETTINGS.DELIVERY_TYPE
      },
      {
        title: 'Phương thức thanh toán',
        icon: 'fluent:payment-16-regular',
        path: ROUTE_CONFIG.SETTINGS.PAYMENT_TYPE
      }
    ]
  }
]
