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
import GlobalStyles from '../../GlobalStyles';

export const Routes = ({passedDate}) => {
  const {user, setUser} = useContext(AuthContext);
  const [adminUser, isAdminUser] = useState(null);
  const [docholder, setDocHolder] = useState("");
  const [actind, setActInd] = useState(true);

  function handleChange() {
    console.log("handleChange has been run")
    isAdminUser(false);
    console.log("after handlechange, isadmin is " + adminUser);
  }

  async function getAdminDoc(name) {
    console.log("search result is " + docholder.search(name))
    if (docholder.search(name) != "-1") {
      isAdminUser(true);
      setActInd(false)
      console.log("Adminuser set to TRUE before actind false")
    } 
    else {
      isAdminUser(false); 
      // setActInd(false)
      console.log("Adminuser set to FALSE before actind false")
    }
    // setActInd(false)
  }

  useEffect(() => {
    console.log("Adminuser has been altered to", adminUser);
    // setActInd(true);
    // if (adminUser) {
    //   setActInd(false);
    // }
  }, [adminUser])

  onAuthStateChanged(auth, async (gottenuser) => {
    if (gottenuser && !user) {
      await getAdminDoc(gottenuser.displayName);
      if (adminUser != null) {
        console.log("admin user in auth:", adminUser)
        // setActInd(false);
      }
    }
      setUser(gottenuser);
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
        <View style={[styles.safearea, {backgroundColor: '#ecf0f1'}]}>
          {actind ? 
            <View style={{alignItems: 'center', top: '50%', justifyContent: 'center'}}>
              <ActivityIndicator size={'large'} animating={true} color={GlobalStyles.colorSet.primary1} style={{zIndex: 999, left: '1%'}}/>
            </View>
          :
            adminUser ? 
              <AdminHome setter={handleChange} /> 
            : 
              <Home name={user.displayName} passedDate={passedDate} />
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
