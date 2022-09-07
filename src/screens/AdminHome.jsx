import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, Pressable, Text, ScrollView} from 'react-native';
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import BottomSheet from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { firestore } from '../../firebase';
import Globals from '../GlobalValues';
import GlobalStyles from '../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { Calendar } from 'react-native-calendars';
import SettingsBottomSheet from '../components/global/settingsbottomsheet';

export default function AdminHome({setter}) {
  const [dayHolder, setDayHolder] = useState("");
  const [fileholder, setFileHolder] = useState();
  const bottomSheetRef = useRef(BottomSheet);

  useEffect(() => {
    getHoursDoc();
    const unsubscribe = onSnapshot(doc(firestore, "Data", "HoursWorked"), (snap) => {
      if (snap){
        setFileHolder(snap.data())
      }
    });
    return () => unsubscribe()
  }, [])

  async function getHoursDoc() {
    console.log("getHoursDoc is run");
    await getDoc(doc(firestore, "Data", "HoursWorked")).then((result) => {
      setFileHolder(result.data());
    });
  }

  return (
    <View style={homestyles.container}>
      <Pressable style={{right: '8%', alignSelf: 'flex-end', position: 'absolute', top: '8%', zIndex: 999}}
        onPress={() => {bottomSheetRef.current.expand(); console.log("Settings Pressed")}}
      >
        <Feather name="settings" size={40} color="black" />
      </Pressable>
      <Calendar 
        theme={{
          calendarBackground: GlobalStyles.colorSet.primary1,
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#ffffff',
          textDisabledColor: '#2d4150',
          dotColor: 'black',
          selectedDotColor: 'black',
          arrowColor: 'orange',
          monthTextColor: 'white',
          indicatorColor: 'blue',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
          textMonthFontFamily: GlobalStyles.fontSet.font
        }}
        style={{
          width: Globals.globalDimensions.width, marginTop: '30%', borderTopLeftRadius: 15, 
          borderTopRightRadius: 15, 
          backgroundColor: GlobalStyles.colorSet.primary1
        }}
        firstDay={1}
        enableSwipeMonths={true}
        onDayPress={(date) => {setDayHolder(date.dateString);}}
        onMonthChange={(month) => console.log(month)}
        markingType={'custom'}
        markedDates={{
          [dayHolder]: {
            customStyles: {
              container: {
                backgroundColor: 'green'
              },
              text: {
                color: 'black',
                fontWeight: 'bold'
              }
            }
          }
        }}
      />
      <Text style={{marginTop: '5%', fontSize: '25vw', fontWeight: 'bold', fontFamily: GlobalStyles.fontSet.font,}}>Workers</Text>
      <ScrollView style={{marginTop: '5%'}}>
        {fileholder && function() {
          console.log("render amount");
          let nestedlooparr = [];
          for (let key in fileholder[dayHolder]) { 
            console.log("outerkey: " + key)
            nestedlooparr.push(
              <View style={{borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: 20, paddingTop: 10, backgroundColor: '#1273de'}} key={key}>
                <Text style={{textAlign: 'center', fontWeight:'bold', fontSize: '17vw', color: 'white',}}>
                  {key} {'\n'}
                </Text>
              </View>
            )
            for (let i=0; i<((Object.keys(fileholder[dayHolder][key]).length * 2) - 1); i+=2) {
              console.log("i is " + i);
              const tomilliseconds = (hrs,min) => (hrs*60*60+min*60)*1000;
              let startmillisecondholder = tomilliseconds(parseInt(fileholder[dayHolder][key][i]["starttime"].split(":")[0]), parseInt(fileholder[dayHolder][key][i]["starttime"].split(":")[1]));
              let endmillisecondholder = tomilliseconds(parseInt(fileholder[dayHolder][key][i]["starttime"].split(":")[0]), parseInt(fileholder[dayHolder][key][i]["starttime"].split(":")[1]));
              function msToHMS( ms ) {
                var seconds = ms / 1000;
                var hours = parseInt( seconds / 3600 );
                seconds = seconds % 3600;
                var minutes = parseInt( seconds / 60 );
                seconds = seconds % 60;
                return (hours + " hours and " + minutes + " minutes");
              }
              let millisub = Math.abs(new Date(endmillisecondholder) - new Date(startmillisecondholder));
              nestedlooparr.push(
                <View style={{marginBottom: (i === ((Object.keys(fileholder[dayHolder][key]).length * 2) - 2) && 20), backgroundColor: '#1273de', paddingHorizontal: 20, 
                  paddingBottom: 10, borderBottomLeftRadius: (i === ((Object.keys(fileholder[dayHolder][key]).length * 2) - 2) && 25), 
                  borderBottomRightRadius: (i === ((Object.keys(fileholder[dayHolder][key]).length * 2) - 2) && 25)}}
                >
                  <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.font}}>
                    Starting Time of Shift: {fileholder[dayHolder][key][i]["starttime"]}{'\n'}
                    Starting Location: {fileholder[dayHolder][key][i]["startlocation"]} {'\n'}
                    Ending Time of Shift: {fileholder[dayHolder][key][i]["finishtime"]}{'\n'}
                    Ending Location: {fileholder[dayHolder][key][i]["finishlocation"]} {'\n'}
                    Shift Length: {msToHMS(millisub)}
                  </Text>
                </View>
              )
              console.log("nestedarrlength: "+ nestedlooparr.length);
            }
          }
          return nestedlooparr;
        }()}
      </ScrollView>
      <SettingsBottomSheet bottomSheetRef={bottomSheetRef} setter={setter}/>
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
    alignItems: 'center',
  },
});

