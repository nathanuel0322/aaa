import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { doc, setDoc, GeoPoint} from "firebase/firestore";
import BottomSheet from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { firestore } from '../../firebase';
import Globals from '../GlobalValues';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import SettingsBottomSheet from '../components/global/settingsbottomsheet';
import { reverseGeocodeAsync } from 'expo-location';

export default function Home({name}) {
  const [settingscounter, setSettingsCounter] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockoutTime, setClockoutTime] = useState("");
  const [counter, setCounter] = useState(0);
  const [starttextampm, setStartTextAmpm] = useState("");
  const [finishtextampm, setFinishTextAmpm] = useState("");
  const bottomSheetRef = useRef(BottomSheet);

  useEffect(() => {
    getObject('isClockedin').then(async (clockedin) => {
      setIsClockedIn(clockedin);
      await getObject('counter').then((gottencounter) => {
        console.log("counter set to: " + gottencounter)
        setCounter(gottencounter);
      })
      await getString('currentTime').then(async (storedcurrentime) => {
        setCurrentTime(storedcurrentime);
      })
      await getString('startTextAmpm').then((getresult) => {
        setStartTextAmpm(getresult);
      })
      await getString('clockouttime').then((gottenclockouttime) => {
        setClockoutTime(gottenclockouttime);
      })
      await getString('finishTextAmpm').then((getfinishtext) => {
        setFinishTextAmpm(getfinishtext);
      })
    })
  }, [])

  const storeObject = async (itemstring, object) => {
    try {await AsyncStorage.setItem(itemstring, JSON.stringify(object))} catch (e) {console.log(e)}
  }
  const getObject = async (itemstring) => {
    try{
      const jsonvalue = await AsyncStorage.getItem(itemstring);
      return jsonvalue != null ? JSON.parse(jsonvalue) : null
    }catch(e){console.log(e)}
  }
  const storeString = async (itemstring, string) => {
    try {await AsyncStorage.setItem(itemstring, string)} catch (e) {console.log(e)}
  }
  const getString = async (itemstring) => {
    try {
      const value = await AsyncStorage.getItem(itemstring)
      if(value !== null) {return value}
    } catch(e) {console.log("get "+itemstring+" error: " + e)}
  }

  async function geocodelocation(coords) {
    let holder;
    await reverseGeocodeAsync({latitude: coords.latitude, longitude: coords.longitude}).then((result) => {
      holder = result[0].name + ", " + result[0].city + ", " + result[0].region + " " + result[0].postalCode;
    });
    return holder;
  }

  return (
    <View style={homestyles.container}>
      <TouchableOpacity style={{right: '8%', alignSelf: 'flex-end', position: 'absolute', top: '8%'}}
        onPress={() => {if(settingscounter % 2 === 0) {bottomSheetRef.current.expand()} else{bottomSheetRef.current.close()}; setSettingsCounter(settingscounter+1)}}
      >
        <Feather name="settings" size={40} color="black" />
      </TouchableOpacity>
      <Text style={{textAlign: 'center', fontSize: '20vw', fontFamily: GlobalStyles.fontSet.fontsemibold}}>
        Hello {name.split(" ")[0]}! Are you ready to clock in?
      </Text>
      <TouchableOpacity style={{marginTop: 50, borderRadius: 25, marginVertical: 50, display: 'flex', elevation: 24, shadowOffset: {width: 0,height: 12,},
        backgroundColor: GlobalStyles.colorSet.primary1,shadowOpacity: 0.65, shadowRadius: 16.0,}}
        onPress={() => {
          console.log("counter is currently " + counter);
          setIsClockedIn(!isClockedIn);
          storeObject('isClockedin', !isClockedIn)
          const currentDate = new Date();
          let nomilitarytime;
          let ampm = "AM"; 
          if (currentDate.getHours() > 12) {
            nomilitarytime = currentDate.getHours() - 12;
            ampm = "PM";
          }
          else if (currentDate.getHours() === 0){
            nomilitarytime = 12;
          }
          let time = nomilitarytime + ":" + String(currentDate.getMinutes()).padStart(2, "0");
          
          if (!isClockedIn){setCurrentTime(time); storeString('currentTime', time); setStartTextAmpm(ampm); storeString('startTextAmpm', ampm)}
          else {setClockoutTime(time); storeString('clockouttime', time); setFinishTextAmpm(ampm); storeString('finishTextAmpm', ampm)}

          if (counter % 2 != 0) {
            geocodelocation(new GeoPoint(Globals.location.coords.latitude, Globals.location.coords.longitude))
              .then(result => {
                setDoc(doc(firestore, "Data", "HoursWorked"), {
                  [currentDate.getFullYear() + "-" + String(currentDate.getMonth()+1).padStart(2, "0") + "-" + 
                    String(currentDate.getDate()).padStart(2, "0")
                  ]: {
                    [name]: {
                      [(counter-1)]: {
                        finishtime: time, 
                        finishlocation: result,
                        finishampm: ampm,
                      }
                    }
                  }
                }, {merge: true});  
              });
          }
          else {
            geocodelocation(new GeoPoint(Globals.location.coords.latitude, Globals.location.coords.longitude))
              .then(result => {
                setDoc(doc(firestore, "Data", "HoursWorked"), {
                  [currentDate.getFullYear() + "-" + String(currentDate.getMonth()+1).padStart(2, "0") + "-" + 
                    String(currentDate.getDate()).padStart(2, "0")
                  ]: {
                    [name]: {
                      [(counter)]: {
                        starttime: time, 
                        startlocation: result,
                        startampm: ampm,
                      }
                    }
                  }            
                }, {merge: true}); 
              });
          }
          let newcounter = counter + 1;
          setCounter(newcounter);
          storeObject('counter', newcounter); 
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
        <Text style={homestyles.clocktext}>Clocked in at {currentTime} {starttextampm}</Text>
      </View>
      <View style={{display: (!isClockedIn && (clockoutTime != "")) ? 'flex' : 'none', marginTop: 25}}>
        <Text style={homestyles.clocktext}>Clocked out at {clockoutTime} {finishtextampm}</Text>
      </View>
      <SettingsBottomSheet bottomSheetRef={bottomSheetRef}/>
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

  clocktext: {
    fontFamily: GlobalStyles.fontSet.font,
    fontSize: '23vw',
  }
});

