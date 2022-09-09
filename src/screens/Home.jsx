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
    getClockedIn().then(async (clockedin) => {
      console.log("getClockedin returned: " + clockedin);
      setIsClockedIn(clockedin);
      await getCounter().then((gottencounter) => {
        console.log("counter set to: " + gottencounter)
        setCounter(gottencounter);
        // setCounter(0);
      })
      await getCurrentTime().then(async (storedcurrentime) => {
        setCurrentTime(storedcurrentime);
      })
      await getStartTextAmpm().then((getresult) => {
        console.log("getStartText returned: " + getresult);
        setStartTextAmpm(getresult);
      })
      await getClockoutTime().then((gottenclockouttime) => {
        setClockoutTime(gottenclockouttime);
      })
      await getFinishTextAmpm().then((getfinishtext) => {
        setFinishTextAmpm(getfinishtext);
      })
      console.log("isclockedin set to " + clockedin)
    })
  }, [])

  const storeCounter = async (counter) => {
    try {
      await AsyncStorage.setItem('counter', JSON.stringify(counter))
    } catch (e) {console.log(e)}
  }
  const getCounter = async () => {
    try{
      const jsonvalue = await AsyncStorage.getItem('counter');
      return jsonvalue != null ? JSON.parse(jsonvalue) : null
    }
    catch(e){console.log(e)}
  }
  
  const storeClockedIn = async (value) => {
    try {
      await AsyncStorage.setItem('isClockedin', JSON.stringify(value))
    } catch (e) {
      console.log(e);
    }
  }
  const getCurrentTime = async () => {
    try {
      const value = await AsyncStorage.getItem('currentTime')
      if(value !== null) {return value}
    } catch(e) {
      console.log("Error during getCurrentTime: " + e)
    }
  }
  const storeCurrentTime = async (time) => {
    try {
      await AsyncStorage.setItem('currentTime', time)
    } catch (e) {
      console.log(e);
    }
  }
  const getClockedIn = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('isClockedin')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log("Get clockedin error: " + e)
    }
  }
  const storeStartTextAmpm = async (startTextAmpm) => {
    try {
      await AsyncStorage.setItem('startTextAmpm', startTextAmpm)
    } catch (e) {
      console.log("Store StartTextAMPM error: " + e);
    }  
  }
  const getStartTextAmpm = async () => {
    try {
      const value = await AsyncStorage.getItem('startTextAmpm')
      if(value !== null) {return value;
      }
    } catch(e) {
      console.log("getStartTextAmpm error: " + e)
    }
  }
  const storeClockoutTime = async (clockouttime) => {
    try {
      await AsyncStorage.setItem('clockouttime', clockouttime)
    } catch (e) {
      console.log("Store ClockoutTime error: " + e);
    } 
  }
  const getClockoutTime = async () => {
    try {
      const value = await AsyncStorage.getItem('clockouttime')
      if(value !== null) {return value;
      }
    } catch(e) {console.log("getClockoutTime error: " + e)}
  }
  const storeFinishTextAmpm = async (finishtextampm) => {
    try {
      await AsyncStorage.setItem('finishTextAmpm', finishtextampm)
    } catch (e) {console.log("Store finishTextAmpm error: " + e);}  
  }
  const getFinishTextAmpm = async () => {
    try {
      const value = await AsyncStorage.getItem('finishTextAmpm')
      if(value !== null) {return value}
    } catch(e) {console.log("getFinishTextAmpm error: " + e)}
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
        backgroundColor: GlobalStyles.colorSet.primary1,shadowOpacity: 0.58, shadowRadius: 16.0,}}
        onPress={() => {
          setIsClockedIn(!isClockedIn);
          storeClockedIn(!isClockedIn);
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
          
          if (!isClockedIn){setCurrentTime(time); storeCurrentTime(time); setStartTextAmpm(ampm); storeStartTextAmpm(ampm)}
          else {setClockoutTime(time); storeClockoutTime(time) ; setFinishTextAmpm(ampm); storeFinishTextAmpm(ampm)}

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
          storeCounter(newcounter); 
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

