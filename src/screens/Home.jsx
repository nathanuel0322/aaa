import React, {useRef, useMemo, useState, useCallback} from 'react';
import {StyleSheet, View, Pressable, Text, TouchableOpacity} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';

import Globals from '../GlobalValues';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GlobalStyles from '../GlobalStyles';
import { StatusBar } from 'expo-status-bar';

export default function Home({navigation}) {
  const [currentDate, setCurrentDate] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockoutTime, setClockoutTime] = useState("");
  const [counter, setCounter] = useState(0);
  const bottomSheetRef = useRef(BottomSheet);
  const snapPoints = useMemo(() => [0.1, '43.226601%'], []);

  const storeClockedIn = async (value) => {
    try {
      await AsyncStorage.setItem('isClockedin', JSON.stringify(value))
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={homestyles.container}>
      {/* <View style={homestyles.header}> */}
        {/* <View style={[styles.logo_section, {left: Globals.globalDimensions.width * 0.130841121}]}>
          <Image
            source={require('../../assets/images/mobulogowbackground.png')}
            style={{resizeMode: 'contain', width: 100, height: 50}}
          />
        </View> */}
      <Pressable style={{right: '8%', alignSelf: 'flex-end', position: 'absolute', top: '8%'}}
        onPress={() => bottomSheetRef.current.expand()}
      >
        <Feather name="settings" size={40} color="black" />
      </Pressable>
      {/* </View> */}
      <Text style={{textAlign: 'center'}}>
        Hello {Globals.name.split(" ")[0]}! Are you ready to clock in?
      </Text>
      <TouchableOpacity style={{
          marginTop: 50, 
          borderRadius: 25, 
          marginVertical: 50,
          display: 'flex',
          elevation: 24,
          backgroundColor: GlobalStyles.colorSet.primary1,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
        }}
        onPress={() => {
          setIsClockedIn(!isClockedIn);
          storeClockedIn(isClockedIn);
          setCounter(counter + 1);
          
          const month = ["January","February","March","April","May","June","July","August","September", "October", "November","December"];
          const currentDate = new Date();
          let nomilitarytime = currentDate.getHours();
          if (currentDate.getHours() > 12) {
            nomilitarytime = currentDate.getHours() - 12
          }
          else if (currentDate.getHours() === 0){
            nomilitarytime = 12;
          }
          let time = nomilitarytime + ":" + String(currentDate.getMinutes()).padStart(2, "0");
          
          if (!isClockedIn){
            setCurrentDate(month[currentDate.getMonth()] + " " + currentDate.getDate() + "," + " " + currentDate.getFullYear() + " " + time)
          }
          else {
            setClockoutTime(month[currentDate.getMonth()] + " " + currentDate.getDate() + "," + " " + currentDate.getFullYear() + " " + time)
          }
        }}
      >
        {isClockedIn ? 
          <Text style={{color: 'white', paddingHorizontal: 100, paddingVertical: 20, fontWeight: 'bold'}}>
            Clock Out
          </Text>
        : 
          <Text style={{color: 'white', paddingHorizontal: 100, paddingVertical: 20, fontWeight: 'bold'}}>
            Clock In
          </Text>
        }
      </TouchableOpacity>
      <View style={{display: (counter != 0) ? 'flex' : 'none'}}>
        <Text>Clocked in at {currentDate}</Text>
      </View>
      <View style={{display: (!isClockedIn && (clockoutTime != "")) ? 'flex' : 'none', marginTop: 25}}>
        <Text>Clocked out at {clockoutTime}</Text>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onAnimate={useCallback((fromIndex) => {
          if (fromIndex === 1) {
            navigation.setOptions({tabBarStyle: {display: 'flex',position: 'absolute',bottom: 25,left: 20,right: 20,elevation: 24,backgroundColor: GlobalStyles.colorSet.primary1,borderRadius: 25,height: 70,width: Globals.globalDimensions.width * 0.914666667,shadowOffset: {  width: 0,  height: 12,},shadowOpacity: 0.58,shadowRadius: 16.0,opacity: 1,},})
          }
          console.log("From index: ", fromIndex)
        })}
        handleIndicatorStyle={{backgroundColor: 'white', width: Globals.globalDimensions.width * .133333333,}}
        backgroundStyle={{backgroundColor: GlobalStyles.colorSet.neutral11}}
      >
        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'centerd'}}>
          <Pressable style={{flex: 1, flexDirection:'row', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'absolute', 
            bottom: 25,}}
            onPress={() => {bottomSheetRef.current.close();}}
          >
            <View style={{width: '92%', backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', 
              height: 60, alignItems: 'center', borderRadius: 20}}
            >
              <Text style={{fontFamily: GlobalStyles.fontSet.fontbold}}>Send</Text>
            </View>
          </Pressable>
          <Pressable>
          </Pressable>
        </View>
      </BottomSheet>
      <StatusBar style='dark' />
    </View>
  );
}

const homestyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    alignItems: 'center'
  },

  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    top: 50,
    position: 'absolute'
  },

  bottomsheetviews: {
    flexDirection: 'row', 
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: 'center',
    paddingTop: 17,
    width: '100%',
  },
    
  bottomsheetstext: {
    color: 'white', 
  },
});

