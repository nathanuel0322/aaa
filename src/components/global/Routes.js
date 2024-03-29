/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { onAuthStateChanged } from 'firebase/auth'
import { AuthContext } from './AuthProvider'
import Theme from './theme'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { doc, getDoc } from 'firebase/firestore'
import { auth, firestore } from '../../../firebase'
import AdminHome from '../../screens/AdminHome'
import AuthStack from './AuthStack'
import Home from '../../screens/Home'
import GlobalStyles from '../../GlobalStyles'

export const Routes = ({ passedDate }) => {
  const { user, setUser } = useContext(AuthContext)
  const [adminUser, isAdminUser] = useState(null)
  const [docholder, setDocHolder] = useState(null)
  const [actind, setActInd] = useState(true)
  const [running, setRunning] = useState(false)
  const [userwaited, setUserWaited] = useState(false)

  function handleChange () {
    isAdminUser(false)
  }

  async function getAdminDoc (name) {
    for (let i = 0; i < Object.keys(docholder).length; i++) {
      if (docholder[name]) { isAdminUser(true) } else { isAdminUser(false) }
    }
  }

  onAuthStateChanged(auth, async (gottenuser) => {
    if (docholder !== null) {
      await getAdminDoc(gottenuser?.displayName)
    }
    setUser(gottenuser)
  })

  useEffect(() => {
    let timeout
    if (running) {
      setUserWaited(true)
      timeout = setTimeout(() => {
        setActInd(false)
      }, 2500)
    } else {
      clearTimeout(timeout)
    }
    return () => { clearTimeout(timeout) }
  }, [running])

  useEffect(() => {
    setRunning(true)
  }, [user])

  useEffect(() => {
    async function personalGetDoc () {
      await getDoc(doc(firestore, 'Data', 'AdminUsers')).then((result) => {
        setDocHolder(result.data())
      })
    };
    personalGetDoc()
  }, [])

  return (
    <NavigationContainer theme={Theme}>
      {user
        ? userwaited &&
          <View style={[styles.safearea, { backgroundColor: '#ecf0f1' }]}>
            {actind
              ? <View style={{ alignItems: 'center', top: '50%', justifyContent: 'center', zIndex: 999 }}>
                  <ActivityIndicator size={'large'} animating={true} color={GlobalStyles.colorSet.primary1} style={{ zIndex: 999, left: '1%' }}/>
                </View>
              : adminUser
                ? <AdminHome setter={handleChange} />
                : <Home passedDate={passedDate} />
            }
          </View>
        : <AuthStack />
      }
      <StatusBar style='light' />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  safearea: {
    width: '100%',
    height: '100%'
  }
})
