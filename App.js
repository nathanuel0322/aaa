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
  const [dateonRerender, setDateonRerender] = useState(new Date())
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

  const getObject = async (itemstring) => {
    try{
      const jsonvalue = await AsyncStorage.getItem(itemstring);
      return jsonvalue != null ? JSON.parse(jsonvalue) : null
    }catch(e){console.log(e)}
  }

  const AnimatedSplashScreen = ({ children, image }) => {
    const animation = useMemo(() => new Animated.Value(1), []);
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
      const subscription = AppState.addEventListener("change", nextAppState => {
        console.log("appstate is:", nextAppState)
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
          let timeatfore = new Date();
          console.log("App has come to the foreground!");
          getDate().then((date) => {
            if (new Date(date) > timeatfore){
              setAppReady(false);
              Alert.alert("Change time back to correct time to regain access!");
            } 
            else {
              // Pass time on reopen over all the way to stopwatch, causing a rerender
              setDateonRerender(new Date());
              console.log("dateonrerender set to:", new Date())
              console.log("appready SUPPOSED TO be set back to true")
              if(!isAppReady){
                console.log("appready set back to true");
                setAppReady(true);
              }
            }
          })
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
        await SplashScreen.preventAutoHideAsync();
        // Load stuff;
        let currentDate = new Date();
        await GlobalFunctions._getLocationAsync(true);
        await loadAsync({ Oswald_400Regular, Oswald_600SemiBold, Oswald_700Bold, });    
        await getDate().then((result) => {
          if (result != null) {
            if (currentDate < new Date(result)) {
              throw "Date Earlier";
            }
          }
          else {
            storeDate(currentDate);
          }
        })
        setAppReady(true);
      } catch (e) {
        console.log(e);
        if (e === "Date Earlier") {
          Alert.alert("Change time back to correct time to regain access.!");
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
  
  const AnimatedAppLoader = ({ children, image }) => {
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
  return (
    <AnimatedAppLoader image={{ uri: Constants.manifest.splash.image }}>
      <StatusBar style='dark' />
      <Providers passedDate={dateonRerender} />
    </AnimatedAppLoader>
  );
}




