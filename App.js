/* eslint-disable no-throw-literal */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import Providers from './src/components/global/index.js'
import { Animated, StyleSheet, View, Alert, AppState } from 'react-native'
import { loadAsync } from 'expo-font'
import Constants from 'expo-constants'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { Oswald_400Regular, Oswald_600SemiBold, Oswald_700Bold } from '@expo-google-fonts/oswald'
import GlobalFunctions from './src/GlobalFunctions'

export default function App () {
  const [dateonRerender, setDateonRerender] = useState(new Date())

  async function getTimezoneApi () {
    try {
      const response = await fetch('http://worldtimeapi.org/api/timezone/America/New_York')
      const responseJson = await response.json()
      return responseJson
    } catch (error) {
      console.error(error)
    }
  }

  const AnimatedSplashScreen = ({ children, image }) => {
    const animation = useMemo(() => new Animated.Value(1), [])
    const [isAppReady, setAppReady] = useState(false)
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false)
    const appState = useRef(AppState.currentState)

    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          getTimezoneApi().then((returnedobj) => {
            if (Math.abs(new Date().getTime() - new Date(returnedobj.datetime).getTime()) > 1000) {
              setAppReady(false)
              Alert.alert('Change time back to correct time to regain access!')
            } else {
              setDateonRerender(new Date())
              if (!isAppReady) {
                setAppReady(true)
              }
            }
          })
        }
        appState.current = nextAppState
      })

      return () => {
        subscription.remove()
      }
    }, [])

    useEffect(() => {
      if (isAppReady) {
        (async function () {
          await SplashScreen.hideAsync()
        })()
        Animated.timing(animation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true
        }).start(() => setAnimationComplete(true))
      }
    }, [isAppReady])

    const onImageLoaded = useCallback(async () => {
      await SplashScreen.preventAutoHideAsync()
      // Load stuff;
      await loadAsync({ Oswald_400Regular, Oswald_600SemiBold, Oswald_700Bold })
      getTimezoneApi()
        .then(async (returnedobj) => {
          if (Math.abs(new Date().getTime() - new Date(returnedobj.datetime).getTime()) > 1000) {
            // eslint-disable-next-line no-throw-literal
            throw 'Date Earlier'
          }
          await GlobalFunctions._getLocationAsync(true).then((returnedbool) => {
            if (!returnedbool) { throw 'Location Blocked' }
          })
          setAppReady(true)
        })
        .catch((e) => {
          console.log(e)
          if (e === 'Date Earlier') {
            Alert.alert('Change time back to correct time to regain access!')
          }
          if (e === 'Location Blocked') {
            Alert.alert('You need to enable location permissions in order to use this app.')
          }
        })
      await SplashScreen.hideAsync()
    }, [])

    return (
      <View style={{ flex: 1 }}>
        {isAppReady && children}
        {!isSplashAnimationComplete && (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: Constants.manifest.splash.backgroundColor, opacity: animation }]}
          >
            <Animated.Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: Constants.manifest.splash.resizeMode || 'contain',
                transform: [{ scale: animation }]
              }}
              source={{ uri: './src/assets/icons/splash.png' }}
              onLoadEnd={onImageLoaded}
              fadeDuration={0}
            />
          </Animated.View>
        )}
      </View>
    )
  }

  return (
    <AnimatedSplashScreen>
      <StatusBar style='dark' />
      <Providers passedDate={dateonRerender} />
    </AnimatedSplashScreen>
  )
}
