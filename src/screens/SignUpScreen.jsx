import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import FormInput from '../components/global/FormInput';
import FormButton from '../components/global/FormButton';
import { AuthContext } from '../components/global/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase';
import { updateProfile } from 'firebase/auth';

import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import { StatusBar } from 'expo-status-bar';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const {register} = useContext(AuthContext);

  const storeName = async (name) => {
    try {
      await AsyncStorage.setItem('name', name)
    } catch (e) {
      console.log(e);
    }
  }

  // const storeNameFirebase = async (name) => {
  //   await updateProfile(auth.currentUser, {displayName: name}).then((result) => console.log(result));
  // }

  return(
    <View style={styles.container}>
      {/* <Image 
        source={require('../assets/images/mobulogowbackground.png')} 
        style={{marginBottom: 50, marginTop: 0}}
      /> */}
      <Text style={styles.text}>Create an Account</Text>

      <FormInput
        labelValue={name}
        onChangeText={(name) => setName(name)}
        placeholderText="Full Name"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      
      <FormInput
        labelValue={confirmPassword}
        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign Up"
        onPress={() => {
          if (password === confirmPassword){
            storeName(name);
            Globals.name = name;
            register(name, email, password);
            console.log(name + " is now registered");
          }
          else {
            Alert.alert("Your passwords don't match!");
          }
        }}
      />

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.navButtonText}>
          Have an account? Sign In
        </Text>
      </TouchableOpacity>
      <StatusBar style='light' />
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: -75,
    flex: 1,
    backgroundColor: GlobalStyles.colorSet.primary1,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    // fontFamily: 'Gilroy',
    fontSize: 28,
    marginBottom: 50,
    color: GlobalStyles.colorSet.white,
  },
  
  navButton: {
    marginTop: 15,
  },

  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: GlobalStyles.colorSet.accent1,
    // fontFamily: 'Gilroy',
  },
});