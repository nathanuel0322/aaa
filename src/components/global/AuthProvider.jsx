/* eslint-disable react/prop-types */
import React, { createContext, useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { Alert } from 'react-native'
import { auth } from '../../../firebase'
import GlobalFunctions from '../../GlobalFunctions'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
              Alert.alert('Signed in!', '', [
                { text: 'OK' }
              ])
              GlobalFunctions.storeString('name', auth.currentUser.displayName)
            })
            .catch(error => {
              if (error.code === 'auth/invalid-email') {
                Alert.alert('That email address is invalid!', '', [
                  { text: 'OK' }
                ])
              }
              if (error.code === 'auth/user-not-found') {
                Alert.alert('There is no user account linked to this email!', '', [
                  { text: 'OK' }
                ])
              }
              if (error.code === 'auth/wrong-password') {
                Alert.alert('Incorrect password! Please try again.', '', [
                  { text: 'OK' }
                ])
              }
              if (error.code === 'auth/user-disabled') {
                Alert.alert('This user is currently disabled.', '', [
                  { text: 'OK' }
                ])
              }
              console.error(error)
            })
        },
        register: async (name, email, password) => {
          await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
              Alert.alert('Signed in!', '', [
                { text: 'OK' }
              ])
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                Alert.alert('That email address is already in use!', '', [
                  { text: 'OK' }
                ])
              }
            })
          await updateProfile(auth.currentUser, { displayName: name })
        },
        logout: async () => {
          await signOut(auth)
            .then(() => {
              GlobalFunctions.removeItemValue('name')
              setUser(false)
            })
            .catch(error => {
              console.error(error)
            })
        }
      }}>
      {children}
    </AuthContext.Provider>
  )
}
