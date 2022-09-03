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
  const [adminUser, isAdminUser] = useState(false);
  const [isNameAdmin, setNameAdmin] = useState(-1);
  const [userStats, setUserStats] = useState({user: false, adminUser: false})

  if (auth.currentUser != null){
    Globals.currentUserId = auth.currentUser.uid;
  }
  async function getAdminDoc(name) {
    await getDoc(doc(firestore, "Data", "AdminUsers")).then((result) => setNameAdmin(JSON.stringify(result.data()).search(name)));
  }
  
  

  onAuthStateChanged(auth, (user) => {
    setUser(user);
    getAdminDoc(user.displayName);
    console.log("isNameAdmin is " + isNameAdmin);
    if (isNameAdmin != -1) {
      // setUserStats({user: user, adminUser: true})
      // console.log()
      // setUser(user);
      isAdminUser(true);
    }
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
        <View style={styles.safearea}>
          {adminUser ? <AdminHome /> : <Home name={user.displayName} />}
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
