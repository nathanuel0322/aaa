/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import FormInput from '../components/global/FormInput'
import FormButton from '../components/global/FormButton'
import { AuthContext } from '../components/global/AuthProvider'
import GlobalStyles from '../GlobalStyles'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebase'
import { StatusBar } from 'expo-status-bar'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const { login } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/aaalogo.jpg')} style={{ resizeMode: 'contain', width: '70%', height: '20%', marginBottom: 30, borderRadius: 25 }} />
      <View style={[styles.inputView]}>
        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.inputView}>
        <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Password"
          secureTextEntry={true}
        />
      </View>
      <FormButton
        buttonTitle="Sign In"
        onPress={() => {
          login(email, password)
        }}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={
        async () => {
          if (!email) {
            Alert.alert('Please enter a valid email.', '', [
              { text: 'OK' }
            ])
          }
          await sendPasswordResetEmail(auth, email)
            .then(() => {
              if (email.includes('@') && email.includes('.com')) {
                Alert.alert('Your password reset has been sent to your email', '', [
                  { text: 'OK' }
                ])
              } else {
                Alert.alert('Please enter a valid email.', '', [
                  { text: 'OK' }
                ])
              }
            })
            .catch(e => {
              if (e.code === 'auth/invalid-email') {
                Alert.alert('Please enter a valid email.', '', [
                  { text: 'OK' }
                ])
              } else if (e.code === 'auth/user-not-found') {
                Alert.alert('There is no user with this email.', '', [
                  { text: 'OK' }
                ])
              }
            })
        }
      }>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={[styles.navButtonText, { color: GlobalStyles.colorSet.accent1 }]}>
          Don't have an account? Create here
        </Text>
      </TouchableOpacity>
      <StatusBar style='light' />
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0B14',
    alignItems: 'center',
    justifyContent: 'center'
  },

  inputView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center'
  },

  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f'
  },
  navButton: {
    marginTop: 15
  },
  forgotButton: {
    marginTop: 30
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Oswald_400Regular'
  }
})
