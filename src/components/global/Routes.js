import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {onAuthStateChanged } from 'firebase/auth';
import {AuthContext} from './AuthProvider';
import Theme from './theme';
import { SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Globals  from '../../GlobalValues';

import AuthStack from './AuthStack';

import {auth} from '../../../firebase';
import Home from '../../screens/Home';

export const Routes = () => {
    const {user, setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);
    if (auth.currentUser != null){
      Globals.currentUserId = auth.currentUser.uid;
    }
  
    onAuthStateChanged(auth, (user) => {
      Globals.name = user.displayName;
      setUser(user);
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
          <View style={styles.safearea}>
            <StatusBar barStyle="light-content" />
            <Home />
          </View>
        : 
          <AuthStack />
        }
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
