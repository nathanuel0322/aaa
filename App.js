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


export default function App() {
  Globals.globalDimensions = useWindowDimensions();
  console.log('globals set' + Globals.globalDimensions.height + " " + Globals.globalDimensions.width);
  const [dateonRerender, setDateonRerender] = useState(new Date())

  async function getTimezoneApi() {
    try {
      let response = await fetch('http://worldtimeapi.org/api/timezone/America/New_York');
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  const AnimatedSplashScreen = ({ children, image }) => {
    const animation = useMemo(() => new Animated.Value(1), []);
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
      const subscription = AppState.addEventListener("change", nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
          getTimezoneApi().then((returnedobj) => {
            if (Math.abs(new Date().getTime() - new Date(returnedobj.datetime).getTime()) > 1000) {
              setAppReady(false);
              Alert.alert("Change time back to correct time to regain access!");
            }
            else {
              setDateonRerender(new Date());
              if(!isAppReady){
                setAppReady(true);
              }
            }
          })
        }
        appState.current = nextAppState;
        console.log("AppState", appState.current);
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
      await SplashScreen.preventAutoHideAsync();
      // Load stuff;
      await GlobalFunctions._getLocationAsync(true);
      await loadAsync({ Oswald_400Regular, Oswald_600SemiBold, Oswald_700Bold, }); 
      getTimezoneApi()
        .then((returnedobj) => {
          if (Math.abs(new Date().getTime() - new Date(returnedobj.datetime).getTime()) > 1000) {
            throw "Date Earlier";
          }
          setAppReady(true);
        })
        .catch((e) => {
          console.log(e);
          if (e === "Date Earlier") {
            Alert.alert("Change time back to correct time to regain access!");
          }
        })   
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




