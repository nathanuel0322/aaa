import React from 'react';
import Providers from './src/components/global/index.js';
import { useWindowDimensions, Animated, StyleSheet, View, Alert, AppState} from "react-native";
import { loadAsync } from 'expo-font';
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { StatusBar } from 'expo-status-bar';
import {
  Oswald_200ExtraLight,
  Oswald_300Light,
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_700Bold,
} from '@expo-google-fonts/oswald';

import Globals from './src/GlobalValues';
import GlobalFunctions from './src/GlobalFunctions';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
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
    console.log("jsonval is " + jsonValue)
    return jsonValue != null ? jsonValue : null;
  } catch(e) {console.log(e);}
}

const storeDate = async (date) => {
  try {
    // const jsonValue = JSON.stringify(date)
    await AsyncStorage.setItem("date", date)
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
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
        let timeatfore = new Date();
        console.log("timeatfore: " + timeatfore.getTime())
        getDate().then((date) => {console.log("date after open: " + date + "date is " + (date>timeatfore)+ " than " + timeatfore.getTime()); if (date > timeatfore){setAppReady(false)} else{if(!isAppReady){setAppReady(true)}}})
      }
      else{
        console.log("App is now in background")
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
      console.log("appvisible is" + appStateVisible);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isAppReady) {
      (async function(){
        await SplashScreen.hideAsync();
      })();
      Animated.timing(animation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.preventAutoHideAsync().catch((e) => {
        console.log("error in preventautohide: " + e)
      });
      // Load stuff
      await GlobalFunctions._getLocationAsync(true);
      await loadAsync({ Oswald_400Regular, Oswald_600SemiBold, Oswald_700Bold, });     
      console.log("Oswald successfully loaded!");                                                                                              
      let currentDate = new Date();
      let dateholder;
      await getDate().then((result) => dateholder = result)
      console.log("dateholder is " + dateholder);
      if (dateholder != null) {
        if (currentDate < dateholder) {
          throw "Date Earlier";
        }
      }
      else {
        storeDate(currentDate.toDateString());
      }
      await Promise.all([]);
      await getName().then((name) => Globals.name = name);
      console.log("Global name is " + Globals.name);
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
          style={[StyleSheet.absoluteFill,{backgroundColor: Constants.manifest.splash.backgroundColor, opacity: animation,},]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest.splash.resizeMode || "contain",
              transform: [{scale: animation,},],
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