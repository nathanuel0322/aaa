import React, {createContext, useState} from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { Alert } from 'react-native';
import {auth} from '../../../firebase';
import GlobalValues from '../../GlobalValues';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const storeName = async (name) => {
    try {
      await AsyncStorage.setItem('name', name)
    } catch (e) {
      console.log(e);
    }
  }

  async function removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch(exception) {
      return false;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          await signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            Alert.alert('Signed in!', '', [
              { text: 'OK', onPress: () => console.log('User account signed in!')},
            ]);
            storeName(auth.currentUser.displayName);
            GlobalValues.name = auth.currentUser.displayName;
          })
          .catch(error => {
            if (error.code === 'auth/invalid-email') {
              Alert.alert('That email address is invalid!', '', [
                { text: 'OK', onPress: () => console.log('That email address is invalid!')},
              ]);
            }
            if (error.code === 'auth/user-not-found') {
              Alert.alert('There is no user account linked to this email!', '', [
                { text: 'OK', onPress: () => console.log('There is no user account linked to this email!')},
              ]);
            }
            if (error.code === 'auth/wrong-password') {
              Alert.alert('Incorrect password! Please try again.', '', [
                { text: 'OK', onPress: () => console.log('Incorrect password! Please try again.')},
              ]);
            }
            if (error.code === 'auth/user-disabled') {
              Alert.alert('This user is currently disabled.', '', [
                { text: 'OK', onPress: () => console.log('This user is currently disabled.')},
              ]);
            }
            console.error(error);
          });
          
        },
        register: async (name, email, password) => {
          await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
              console.log('Account created & signed in!')
              Alert.alert('Signed in!', '', [
                { text: 'OK', onPress: () => console.log('User account created & signed in!')},
              ]);
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                Alert.alert('That email address is already in use!', '', [
                  { text: 'OK', onPress: () => console.log('Email address is already in use')},
                ]);
              }
              if (error.code === 'auth/invalid-email') {
                console.log('This email is invalid');
              }
              if (error.code === 'auth/operation-not-allowed') {
                console.error(error);
              }
              if (error.code === 'auth/weak-password') {
                console.log('Please create a stronger password.');
              }
              console.error(error);
            });
          await updateProfile(auth.currentUser, {displayName: name}).then(() => console.log("updateprofile has been run with " + auth.currentUser.displayName)).catch((e) => {console.log(e)});
        },
        logout: async () => {
          await signOut(auth)
            .then(() => {
              GlobalValues.name = null;
              removeItemValue("name");
              console.log('Signed out!');
            })
            .catch(error => {
              console.error(error);
            });
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};