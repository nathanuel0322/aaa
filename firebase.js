import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyArCt642jPRQzz8dI4CC0d2ONRUBh77TRs',
  authDomain: 'triplea-63044.firebaseapp.com',
  projectId: 'triplea-63044',
  storageBucket: 'triplea-63044.appspot.com',
  messagingSenderId: '558152443944',
  appId: '1:558152443944:web:afc575324e9e75e0de6d1d',
  measurementId: 'G-MQ8MNRQ13S'
}

export const Firebase = initializeApp(firebaseConfig)
export const auth = getAuth(Firebase)
export const firestore = getFirestore(Firebase)
