/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native'
import { doc, onSnapshot } from 'firebase/firestore'
import BottomSheet from '@gorhom/bottom-sheet'
import { Feather } from '@expo/vector-icons'
import { firestore } from '../../firebase'
import Globals from '../GlobalValues'
import GlobalStyles from '../GlobalStyles'
import { StatusBar } from 'expo-status-bar'
import { Calendar } from 'react-native-calendars'
import SettingsBottomSheet from '../components/global/settingsbottomsheet'
import GlobalFunctions from '../GlobalFunctions'

export default function AdminHome ({ setter }) {
  const [settingscounter, setSettingsCounter] = useState(0)
  const [dayHolder, setDayHolder] = useState('')
  const [fileholder, setFileHolder] = useState()
  const bottomSheetRef = useRef(BottomSheet)

  useEffect(() => {
    GlobalFunctions.getHoursDoc().then((returneddoc) => {
      setFileHolder(returneddoc)
    })
    const unsubscribe = onSnapshot(doc(firestore, 'Data', 'HoursWorked'), (snap) => {
      if (snap) { setFileHolder(snap.data()) }
    })
    return () => unsubscribe()
  }, [])

  return (
    <View style={homestyles.container}>
      <TouchableOpacity style={{ right: '8%', alignSelf: 'flex-end', position: 'absolute', top: '8%', zIndex: 999 }}
        onPress={() => { if (settingscounter % 2 === 0) { bottomSheetRef.current.expand() } else { bottomSheetRef.current.close() }; setSettingsCounter(settingscounter + 1) }}
      >
        <Feather name="settings" size={40} color="black" />
      </TouchableOpacity>
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
          textDayFontSize: 13,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
          textMonthFontFamily: GlobalStyles.fontSet.font
        }}
        style={{
          width: Globals.globalDimensions.width,
          marginTop: '30%',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: GlobalStyles.colorSet.primary1
        }}
        firstDay={1}
        enableSwipeMonths={true}
        onDayPress={(date) => {
          setDayHolder(date.dateString)
        }}
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
      <Text style={{ marginTop: '5%', fontSize: '25vw', fontWeight: 'bold', fontFamily: GlobalStyles.fontSet.font }}>Workers</Text>
      <ScrollView style={{ marginTop: '5%' }} showsVerticalScrollIndicator={false}>
        {fileholder && (function () {
          const nestedlooparr = []
          const reorder = dayHolder.split('-')
          if (new Date(`${reorder[1]}/${reorder[2]}/${reorder[0]}`).getDay() === 0) {
            const workerandhours = []
            for (let i = 6; i > -1; i--) {
              const p = new Date()
              p.setDate(new Date(`${reorder[1]}/${reorder[2]}/${reorder[0]}`).getDate() - i)
              // Loop through every name on given day
              for (const key in fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')]) {
                let namekeystorage = 0
                let nameinarray = false
                // This loop created
                for (let p = 0; p < workerandhours.length + 1; p++) {
                  if (typeof workerandhours[p] !== 'undefined') {
                    if (workerandhours[p][0] === key) {
                      // if name is in array, then what?
                      namekeystorage = p
                      nameinarray = true
                    }
                  }
                }
                if (!nameinarray) {
                  namekeystorage = workerandhours.length
                  workerandhours.push([key, 0])
                }
                // Loop through different shifts on given day
                for (let n = parseInt(Object.entries(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key])[0][0]); n < (parseInt(Object.entries(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key])[0][0]) + (Object.keys(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key]).length * 2) - 1); n += 2) {
                  const tomillisecondsstart = (hrs, min) => {
                    if (fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key][n].startampm === 'PM') {
                      return ((hrs + 12) * 60 * 60 + min * 60) * 1000
                    } else {
                      return (hrs * 60 * 60 + min * 60) * 1000
                    }
                  }
                  const tomillisecondsfinish = (hrs, min) => {
                    if (fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key][n].finishampm === 'PM') {
                      return ((hrs + 12) * 60 * 60 + min * 60) * 1000
                    } else { return (hrs * 60 * 60 + min * 60) * 1000 }
                  }
                  const startmillisecondholder = tomillisecondsstart(parseInt(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key][n].starttime.split(':')[0]),
                    parseInt(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key][n].starttime.split(':')[1]))
                  const endmillisecondholder = tomillisecondsfinish(parseInt(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key][n].finishtime.split(':')[0]),
                    parseInt(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][key][n].finishtime.split(':')[1]))
                  const millisub = Math.abs(new Date(endmillisecondholder) - new Date(startmillisecondholder))
                  workerandhours[namekeystorage][1] = workerandhours[namekeystorage][1] + (millisub / 60000)
                }
              }
            }
            for (let h = 0; h < workerandhours.length; h++) {
              nestedlooparr.push(
                <View style={{
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                  marginTop: 20,
                  paddingVertical: 15,
                  backgroundColor: '#1273de',
                  paddingHorizontal: 10,
                  borderBottomLeftRadius: 25,
                  borderBottomRightRadius: 25
                }} key={h}>
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '19vw', color: 'white' }}>
                    {workerandhours[h][0]} {'\n'}
                  </Text>
                  <Text style={{ textAlign: 'center', fontSize: '17vw', color: '#fcc400', fontFamily: GlobalStyles.fontSet.font }}>
                    Total Work Time for the Week: {Math.floor(workerandhours[h][1] / 60)} hours and {workerandhours[h][1] % 60} minutes
                  </Text>
                </View>
              )
            }
          }
          let counter = 0
          for (const key in fileholder[dayHolder]) {
            nestedlooparr.push(
              <View style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: 20, paddingTop: 10, backgroundColor: '#1273de' }} key={key}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '17vw', color: 'white' }} key={counter}>
                  {key} {'\n'}
                </Text>
              </View>
            )
            let hourssum = 0
            let minutessum = 0
            for (let i = parseInt(Object.entries(fileholder[dayHolder][key])[0][0]); i < (parseInt(Object.entries(fileholder[dayHolder][key])[0][0]) + (Object.keys(fileholder[dayHolder][key]).length * 2) - 1); i += 2) {
              const tomillisecondsstart = (hrs, min) => {
                if (fileholder[dayHolder][key][i].startampm === 'PM') { return ((hrs + 12) * 60 * 60 + min * 60) * 1000 } else { return (hrs * 60 * 60 + min * 60) * 1000 }
              }
              const tomillisecondsfinish = (hrs, min) => {
                if (fileholder[dayHolder][key][i].finishampm === 'PM') { return ((hrs + 12) * 60 * 60 + min * 60) * 1000 } else { return (hrs * 60 * 60 + min * 60) * 1000 }
              }
              const startmillisecondholder = tomillisecondsstart(parseInt(fileholder[dayHolder][key][i].starttime.split(':')[0]),
                parseInt(fileholder[dayHolder][key][i].starttime.split(':')[1])
              )
              const endmillisecondholder = tomillisecondsfinish(parseInt(fileholder[dayHolder][key][i].finishtime.split(':')[0]), parseInt(fileholder[dayHolder][key][i].finishtime.split(':')[1]))
              function msToHMS (ms) {
                let seconds = ms / 1000
                const hours = parseInt(seconds / 3600)
                seconds = seconds % 3600
                const minutes = parseInt(seconds / 60)
                hourssum += hours
                minutessum += minutes
                if (minutessum >= 60) {
                  hourssum += Math.floor(minutessum / 60)
                  minutessum = minutessum % 60
                }
                return (hours + ' hours and ' + minutes + ' minutes')
              }
              const millisub = Math.abs(new Date(endmillisecondholder) - new Date(startmillisecondholder))
              nestedlooparr.push(
                <View style={{
                  marginBottom: (i === (parseInt(Object.entries(fileholder[dayHolder][key])[0][0]) + (Object.keys(fileholder[dayHolder][key]).length * 2) - 2) && 20),
                  backgroundColor: '#1273de',
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                  borderBottomLeftRadius: (i === (parseInt(Object.entries(fileholder[dayHolder][key])[0][0]) + (Object.keys(fileholder[dayHolder][key]).length * 2) - 2) && 25),
                  borderBottomRightRadius: (i === (parseInt(Object.entries(fileholder[dayHolder][key])[0][0]) + (Object.keys(fileholder[dayHolder][key]).length * 2) - 2) && 25)
                }} key={nestedlooparr.length}>
                  <Text style={{ color: 'white', fontFamily: GlobalStyles.fontSet.font, fontSize: '16vw' }}>
                    Starting Time of Shift: {fileholder[dayHolder][key][i].starttime + ' ' + fileholder[dayHolder][key][i].startampm}{'\n'}
                    Starting Location: {fileholder[dayHolder][key][i].startlocation} {'\n'}
                    Ending Time of Shift: {fileholder[dayHolder][key][i].finishtime + ' ' + fileholder[dayHolder][key][i].finishampm}{'\n'}
                    Ending Location: {fileholder[dayHolder][key][i].finishlocation} {'\n'}
                    Shift Length: {msToHMS(millisub)}
                  </Text>
                  {i === (parseInt(Object.entries(fileholder[dayHolder][key])[0][0]) + (Object.keys(fileholder[dayHolder][key]).length * 2) - 2) &&
                    <Text style={{ color: '#fcc400', fontFamily: GlobalStyles.fontSet.font, fontSize: '18vw', textAlign: 'center', marginTop: 20 }}>
                      Total Work Time: {hourssum} hours and {minutessum} minutes
                    </Text>
                  }
                </View>
              )
            }
            counter++
          }
          return nestedlooparr
        }())}
      </ScrollView>
      <SettingsBottomSheet bottomSheetRef={bottomSheetRef} setter={setter}/>
      <StatusBar style='dark' />
    </View>
  )
}

const homestyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    alignItems: 'center'
  }
})
