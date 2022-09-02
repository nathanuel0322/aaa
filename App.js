import React from 'react';
import Providers from './src/components/global/index.js';
import { useWindowDimensions, Animated, Platform, StyleSheet, View, Alert} from "react-native";
import { useFonts } from 'expo-font';
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { reverseGeocodeAsync } from 'expo-location';

import Globals from './src/GlobalValues';
import GlobalFunctions from './src/GlobalFunctions';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
  Globals.platform = Platform.OS;
  Globals.globalDimensions = useWindowDimensions();
  console.log('globals set' + Globals.globalDimensions.height + " " + Globals.globalDimensions.width);

  return (
    <AnimatedAppLoader image={{ uri: Constants.manifest.splash.image }}>
      <StatusBar style='dark' />
      <Providers />
    </AnimatedAppLoader>
  );
}

const getName = async () => {
  try {
    const value = await AsyncStorage.getItem('name')
    if(value !== null) {return value}
  } catch(e) {console.log(e);}
}

const getDate = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('date')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {console.log(e);}
}

const storeDate = async (date) => {
  try {
    const jsonValue = JSON.stringify(date)
    await AsyncStorage.setItem("date", jsonValue)
  } catch(e) {console.log(e);}
}

function AnimatedAppLoader({ children, image }) {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.fromURI(image.uri).downloadAsync();
      setSplashReady(true);
    }
    prepare();
  }, [image]);

  if (!isSplashReady) {
    return null;
  }

  return (
    <AnimatedSplashScreen image={image}>
      {children}
    </AnimatedSplashScreen>
  )
}

function AnimatedSplashScreen({ children, image }) {
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await GlobalFunctions._getLocationAsync(true);
      // Gets Address from Location
      await reverseGeocodeAsync(Globals.location.coords).then((result) => console.log(result[0].name + ", " + result[0].city + ", " + result[0].region + " " + 
        result[0].postalCode));
      let currentDate = Date.now();
      let dateholder;
      await getDate().then((result) => dateholder = result)
      if (dateholder != null) {
        if (currentDate < dateholder) {
          throw "Date Earlier";
        }
      }
      else {
        storeDate(currentDate);
      }
      await Promise.all([]);
      await getName().then((name) => Globals.name = name);
      console.log(Globals.name);
      setAppReady(true);
    } catch (e) {
      console.log(e);
      if (e === "Date Earlier") {
        Alert.alert("Change your phone's time to the proper time!");
      }
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest.splash.backgroundColor,
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest.splash.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}