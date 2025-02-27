// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

// Tanstack react query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// ** Store Imports
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Contexts
import { AuthProvider } from 'src/contexts/AuthContext'

// ** Global css styles
import 'src/styles/globals.scss'
import 'react-multi-carousel/lib/styles.css'

import { store } from 'src/stores'
import GuestGuard from 'src/components/auth/GuestGuard'
import AuthGuard from 'src/components/auth/AuthGuard'
import FallbackSpinner from 'src/components/fall-back'
import { SettingsConsumer, SettingsProvider } from 'src/contexts/SettingsContext'
import AclGuard from 'src/components/auth/AclGuard'
import ReactHotToast from 'src/components/react-hot-toast'
import { useSettings } from 'src/hooks/useSettings'
import ThemeComponent from 'src/theme/ThemeComponent'
import { UserLayout } from 'src/views/layouts/UserLayout'
import { AxiosInterceptor } from 'src/helpers/axios'
import NoGuard from 'src/components/auth/NoGuard'
import { useTheme } from '@mui/material'

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <NoGuard fallBack={<FallbackSpinner />}>{children}</NoGuard>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}

export default function App(props: ExtendedAppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps }
  } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { settings } = useSettings()

  // hooks
  const theme = useTheme()
  const router = useRouter()

  // get product title from route
  const slugProduct = (router?.query?.productId as string)?.replaceAll('-', ' ')

  // Create a client
  const [queryClient] = useState(() => new QueryClient())

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj
  const permission = Component.permission ?? []

  // meta tags for SEO
  const title = slugProduct
    ? slugProduct
    : (Component.title ?? `${themeConfig.templateName} - Lập trình NextJS 14 để tạo shop bán hàng`)
  const description = Component.description ?? `Material Design, MUI, Admin Template, React Admin Template`
  const keywords = Component.keywords ?? `Material Design, MUI, Admin Template, React Admin Template, Yup, Redux`
  const urlImage = Component.urlImage ?? '/public/chip-chip-3-removebg.png'

  const toastOptions = {
    success: {
      className: 'react-hot-toast',
      style: {
        background: '#DDF6E8',
        color: theme.palette.text.primary
      }
    },
    error: {
      className: 'react-hot-toast',
      style: {
        background: '#FDE4D5',
        color: theme.palette.text.primary
      }
    }
  }

  return (
    <Provider store={store}>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <meta name='author' content='Phong cute' />
        <meta name='name' content='Shop bán hàng điện tử' />
        <meta name='image' content='/public/chip-chip-3-removebg.png' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        {/* custom meta for facebook */}
        <meta property='og:type' content='website' />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={urlImage} />
        {/* custom meta for twitter(X) */}
        <meta property='twitter:card' content='website' />
        <meta property='twitter:title' content={title} />
        <meta property='twitter:description' content={description} />
        <meta property='twitter:image' content={urlImage} />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
        <AuthProvider>
          <AxiosInterceptor>
            <SessionProvider session={session}>
              <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard
                            permission={permission}
                            aclAbilities={aclAbilities}
                            guestGuard={guestGuard}
                            authGuard={authGuard}
                          >
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </Guard>
                        <ReactHotToast>
                          <Toaster position={settings.toastPosition} toastOptions={toastOptions} />
                        </ReactHotToast>
                      </ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </SessionProvider>
          </AxiosInterceptor>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  )
}
