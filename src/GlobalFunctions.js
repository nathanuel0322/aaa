import * as Location from 'expo-location'
import Globals from './GlobalValues'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDoc, doc } from 'firebase/firestore'
import { firestore } from '../firebase'
import { Alert, Platform } from 'react-native'

export const _getLocationAsync = async () => {
  const AsyncAlert = async () => new Promise((resolve) => {
    Alert.alert(
      'Location Permissions',
      "We use your location for AAA Administrators to ensure that you're on site when you're on the clock.",
      [
        {
          text: 'Ok',
          onPress: () => {
            resolve('YES')
          }
        }
      ],
      { cancelable: false }
    )
  })
  if (Platform.OS === 'android') {
    await Location.getForegroundPermissionsAsync().then(async (ret) => {
      if (ret.granted !== true) {
        await AsyncAlert()
      }
    })
  }
  const { status } = await Location.requestForegroundPermissionsAsync()
  const currentlocation = await Location.getCurrentPositionAsync({})
  if (currentlocation) {
    Globals.location = currentlocation
  } else {
    if (status !== 'granted') {
      return false
    }
  }
  return true
}

const getObject = async (itemstring) => {
  const jsonvalue = await AsyncStorage.getItem(itemstring)
  return jsonvalue ? JSON.parse(jsonvalue) : null
}

const storeObject = async (itemstring, object) => {
  try { await AsyncStorage.setItem(itemstring, JSON.stringify(object)) } catch (e) { console.log(e) }
}

const storeString = async (itemstring, string) => {
  try { await AsyncStorage.setItem(itemstring, string) } catch (e) { console.log(e) }
}

const getString = async (itemstring) => {
  try {
    const value = await AsyncStorage.getItem(itemstring)
    return value
  } catch (e) { console.log('get ' + itemstring + ' error: ' + e) }
}

const removeItemValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (e) {
    console.log('error in removeitemvalue:', e)
    return false
  }
}

const getHoursDoc = async () => {
  await getDoc(doc(firestore, 'Data', 'HoursWorked')).then((result) => {
    return result.data()
  })
}

export default { _getLocationAsync, getObject, storeObject, storeString, getString, removeItemValue, getHoursDoc }
