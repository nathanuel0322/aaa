import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import FormInput from '../components/global/FormInput';
import FormButton from '../components/global/FormButton';
import { AuthContext } from '../components/global/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from "firebase/firestore";
import { firestore } from '../../firebase';

import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';

const AdminSignUpScreen = ({navigation}) => {
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

  return(
    <View style={styles.container}>
      <Text>AAA Maintenance</Text>
      <Text style={styles.text}>Create an Admin Account</Text>

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
            setDoc(doc(firestore, "Data", "AdminUsers"), {
              [name]: true
            }, {merge: true}); 
            register(name, email, password);
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
    </View>
  );
};

export default AdminSignUpScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: -75,
    flex: 1,
    backgroundColor: GlobalStyles.colorSet.primary1,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
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
  },
});