import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {onAuthStateChanged } from 'firebase/auth';
import {AuthContext} from './AuthProvider';
import Theme from './theme';
import { StyleSheet, View, ActivityIndicator} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc } from "firebase/firestore";
import {auth, firestore} from '../../../firebase';
import AdminHome from '../../screens/AdminHome';
import AuthStack from './AuthStack';
import Home from '../../screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../GlobalStyles';

export const Routes = ({passedDate}) => {
  const {user, setUser} = useContext(AuthContext);
  const [adminUser, isAdminUser] = useState(false);
  const [docholder, setDocHolder] = useState("");
  const [name, setName] = useState("");
  const [actind, setActInd] = useState(true);

  function handleChange() {
    console.log("handleChange has been run")
    isAdminUser(false);
    console.log("after handlechange, isadmin is " + adminUser);
  }

  async function getAdminDoc(name) {
    console.log("search result is " + docholder.search(name))
    if (docholder.search(name) != "-1"){isAdminUser(true); setActInd(false)} else{isAdminUser(false); setActInd(false)}
  }

  const getName = async () => {
    try {
      const value = await AsyncStorage.getItem('name')
      if(value !== null) {return value} else{console.log("No name stored")}
    } catch(e) {console.log(e);}
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await getAdminDoc(user.displayName);
      getName().then((namegotten) => {
        setName(namegotten)
      })
      setUser(user);
    }
  })

  useEffect(() => {
    (async function(){
      await getDoc(doc(firestore, "Data", "AdminUsers")).then((result) => {
        setDocHolder(JSON.stringify(result.data()));
      });
    })()
  }, [])

  return (
    <NavigationContainer theme={Theme}>
      {user ?
        <View style={[styles.safearea, {backgroundColor: 'white'}]}>
          <ActivityIndicator size={'large'} animating={actind} color={GlobalStyles.colorSet.primary1} style={{alignSelf: 'center', top: '50%', zIndex: 999, justifyContent: 'center'}}/>
          {
          // !actind &&
            !actind && adminUser ? <AdminHome setter={handleChange} /> 
            : 
            !actind && <Home name={user.displayName} passedDate={passedDate} />
          }
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
    }, 
  });
