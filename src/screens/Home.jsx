import React, {useRef, useState} from 'react';
import {StyleSheet, View, Pressable, Text, TouchableOpacity} from 'react-native';
import { doc, setDoc, GeoPoint } from "firebase/firestore";
import BottomSheet from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { firestore } from '../../firebase';
import Globals from '../GlobalValues';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import SettingsBottomSheet from '../components/global/settingsbottomsheet';

export default function Home({name}) {
  const [currentTime, setCurrentTime] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockoutTime, setClockoutTime] = useState("");
  const [counter, setCounter] = useState(0);

  const bottomSheetRef = useRef(BottomSheet);

  const storeClockedIn = async (value) => {
    try {
      await AsyncStorage.setItem('isClockedin', JSON.stringify(value))
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={homestyles.container}>
      <Pressable style={{right: '8%', alignSelf: 'flex-end', position: 'absolute', top: '8%'}}
        onPress={() => bottomSheetRef.current.expand()}
      >
        <Feather name="settings" size={40} color="black" />
      </Pressable>
      <Text style={{textAlign: 'center', fontSize: '20vw', fontWeight: ''}}>
        Hello {name.split(" ")[0]}! Are you ready to clock in?
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
            setCurrentTime(time);
          }
          else {
            setClockoutTime(time);
          }

          if (counter % 2 != 0) {
            setDoc(doc(firestore, "Data", "HoursWorked"), {
              [currentDate.getFullYear() + "-" + String(currentDate.getMonth()+1).padStart(2, "0") + "-" + 
              String(currentDate.getDate()).padStart(2, "0")
            ]: {
                [Globals.name]: {
                  finishtime: time, 
                  finishlocation: new GeoPoint(Globals.location.coords.latitude, Globals.location.coords.longitude),
                }
              }
            }, {merge: true});  
          }
          else {
            setDoc(doc(firestore, "Data", "HoursWorked"), {
              [currentDate.getFullYear() + "-" + String(currentDate.getMonth()+1).padStart(2, "0") + "-" + 
                String(currentDate.getDate()).padStart(2, "0")
              ]: {
                [Globals.name]: {
                  starttime: time, 
                  startlocation: new GeoPoint(Globals.location.coords.latitude, Globals.location.coords.longitude),
                }
              }            
            }, {merge: true});  
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
        <Text>Clocked in at {currentTime}</Text>
      </View>
      <View style={{display: (!isClockedIn && (clockoutTime != "")) ? 'flex' : 'none', marginTop: 25}}>
        <Text>Clocked out at {clockoutTime}</Text>
      </View>
      <SettingsBottomSheet />
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

  bottomsheetpressables: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingVertical: 21,
    width: '100%',
  },

  bottomsheetpressablestext: {
    color: 'white', 
    fontSize: 20, 
    marginLeft: 13,
    fontWeight: 'bold',
  },
});

