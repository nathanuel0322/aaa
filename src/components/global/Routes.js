import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {onAuthStateChanged } from 'firebase/auth';
import {AuthContext} from './AuthProvider';
import Theme from './theme';
import { StyleSheet, View} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Globals  from '../../GlobalValues';
import { doc, getDoc } from "firebase/firestore";
import {auth, firestore} from '../../../firebase';
import AdminHome from '../../screens/AdminHome';
import AuthStack from './AuthStack';
import Home from '../../screens/Home';

export const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const [adminUser, isAdminUser] = useState(false);
  const [isNameAdmin, setNameAdmin] = useState(false);

  if (auth.currentUser != null){
    Globals.currentUserId = auth.currentUser.uid;
  }
  async function getAdminDoc() {
    await getDoc(doc(firestore, "Data", "AdminUsers")).then((result) => setNameAdmin(JSON.stringify(result.data()).search("N P")));
  }
  getAdminDoc();
  console.log(isNameAdmin);

  onAuthStateChanged(auth, (user) => {
    Globals.name = user.displayName;
    setUser(user);
    if (isNameAdmin != -1) {
      isAdminUser(true);
    }
    if (initializing) setInitializing(false);
  });

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, setUser); 
      return () => {
        unsubscribe(); 
      }; 
    }, [])

  return (
    <NavigationContainer theme={Theme}>
      {user ? 
        adminUser ?
          <View style={styles.safearea}>
            <AdminHome />
          </View>
        :
        <View style={styles.safearea}>
          <Home />
        </View>
      : 
        <AuthStack />
      }
      <StatusBar style='light' />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    safearea: {
      width: '100%',
      height: '100%',
      backgroundColor: '#0A0B14',
    }, 
  });
