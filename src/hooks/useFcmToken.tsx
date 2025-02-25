import { useEffect, useState } from 'react'
import { getMessaging, getToken } from 'firebase/messaging'
import fireBaseApp from 'src/configs/firebase'
import { clearLocalDeviceToken, getLocalDeviceToken, setLocalDeviceToken } from 'src/helpers/storage'

const useFcmToken = () => {
  const [token, setToken] = useState('')

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const messaging = getMessaging(fireBaseApp)

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission()

          // Check if permission is granted before retrieving the token
          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.FIREBASE_KEY_PAIR
            })
            if (currentToken) {
              setToken(currentToken)
            } else {
              console.log('No registration token available. Request permission to generate one.')
            }
          }
        }
      } catch (error) {
        console.log('An error occurred while retrieving token:', error)
      }
    }

    retrieveToken()
  }, [])

  // set the token to the local storage after the token has value
  if (token && token !== getLocalDeviceToken()) {
    clearLocalDeviceToken()
    setLocalDeviceToken(token)
  }

  return { fcmToken: token }
}

export default useFcmToken
