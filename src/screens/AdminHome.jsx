import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, Pressable, Text, ScrollView} from 'react-native';
import { doc, getDoc } from "firebase/firestore";
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
    console.log(JSON.stringify(fileholder));
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
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
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
          '2022-09-28': {
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
      <Text style={{marginTop: '5%', fontSize: '20vw', fontWeight: 'bold'}}>Workers</Text>
      <ScrollView style={{marginTop: '5%'}}>
        {fileholder && function() {
          console.log("render amount");
          for (const key in fileholder[dayHolder]) { 
            console.log("outerkey: " + key)
            let nestedlooparr = [];
            for (let i=0; i<((Object.keys(fileholder[dayHolder][key]).length * 2) - 1); i+=2) {
              console.log("i is " + i);
              const tomilliseconds = (hrs,min) => (hrs*60*60+min*60)*1000;
              let startmillisecondholder = tomilliseconds(parseInt(fileholder[dayHolder][key][i]["starttime"].split(":")[0]), 
                parseInt(fileholder[dayHolder][key][i]["starttime"].split(":")[1]));
              let endmillisecondholder = tomilliseconds(parseInt(fileholder[dayHolder][key][i]["starttime"].split(":")[0]), 
                parseInt(fileholder[dayHolder][key][i]["starttime"].split(":")[1]));
              function msToHMS( ms ) {
                // 1- Convert to seconds:
                var seconds = ms / 1000;
                // 2- Extract hours:
                var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
                seconds = seconds % 3600; // seconds remaining after extracting hours
                // 3- Extract minutes:
                var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
                // 4- Keep only seconds not extracted to minutes:
                seconds = seconds % 60;
                return (hours+" hours and "+minutes + " minutes");
              }
              let millisub = Math.abs(new Date(endmillisecondholder) - new Date(startmillisecondholder));
              nestedlooparr.push(
                <View style={{marginVertical: 20}} key={i}>
                  <Text>
                    Worker: {key} {'\n'}
                    Starting Time of Shift: {fileholder[dayHolder][key][i]["starttime"]}{'\n'}
                    Starting Location: {fileholder[dayHolder][key][i]["startlocation"]} {'\n'}
                    Ending Time of Shift: {fileholder[dayHolder][key][i]["finishtime"]}{'\n'}
                    Ending Location: {fileholder[dayHolder][key][i]["finishlocation"]} {'\n'}
                    Shift Length: {msToHMS(millisub)}
                  </Text>
                </View>
              )
            }
            return nestedlooparr;
          }
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

