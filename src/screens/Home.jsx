/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { doc, setDoc, GeoPoint, onSnapshot } from 'firebase/firestore'
import BottomSheet from '@gorhom/bottom-sheet'
import { Feather } from '@expo/vector-icons'
import { auth, firestore } from '../../firebase'
import Globals from '../GlobalValues'
import GlobalStyles from '../GlobalStyles'
import { StatusBar } from 'expo-status-bar'
import SettingsBottomSheet from '../components/global/settingsbottomsheet'
import { reverseGeocodeAsync } from 'expo-location'
import Stopwatch from '../components/home/stopwatch'
import GlobalFunctions from '../GlobalFunctions'

export default function Home ({ passedDate }) {
  const [settingscounter, setSettingsCounter] = useState(0)
  const [currentTime, setCurrentTime] = useState('')
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockoutTime, setClockoutTime] = useState('')
  const [counter, setCounter] = useState(0)
  const [starttextampm, setStartTextAmpm] = useState('')
  const [finishtextampm, setFinishTextAmpm] = useState('')
  const [isNewDate, setNewDate] = useState(false)
  const bottomSheetRef = useRef(BottomSheet)
  const [fileholder, setFileHolder] = useState()
  const [name, setName] = useState('name here')

  useEffect(() => {
    GlobalFunctions.getString('name').then((gottenname) => {
      if (gottenname) {
        setName(gottenname)
      } else {
        setName(auth.currentUser.displayName)
      }
    })
    GlobalFunctions.getHoursDoc().then((returneddoc) => {
      setFileHolder(returneddoc)
    })
    const unsubscribe = onSnapshot(doc(firestore, 'Data', 'HoursWorked'), (snap) => {
      if (snap) { setFileHolder(snap.data()) }
    })
    GlobalFunctions.getObject('isClockedin').then(async (clockedin) => {
      setIsClockedIn(clockedin)
      await GlobalFunctions.getObject('counter').then((gottencounter) => {
        if (gottencounter) {
          setCounter(gottencounter)
        }
      })
      await GlobalFunctions.getString('currentTime').then(async (storedcurrentime) => {
        setCurrentTime(storedcurrentime)
      })
      await GlobalFunctions.getString('startTextAmpm').then((getresult) => {
        setStartTextAmpm(getresult)
      })
      await GlobalFunctions.getString('clockouttime').then((gottenclockouttime) => {
        setClockoutTime(gottenclockouttime)
      })
      await GlobalFunctions.getString('finishTextAmpm').then((getfinishtext) => {
        setFinishTextAmpm(getfinishtext)
      })
    })
    return () => unsubscribe()
  }, [])

  async function geocodelocation (coords) {
    let holder
    await reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude }).then((result) => {
      holder = result[0].name + ', ' + result[0].city + ', ' + result[0].region + ' ' + result[0].postalCode
    })
    return holder
  }

  return (
    <View style={homestyles.container}>
      <TouchableOpacity style={{ right: '8%', alignSelf: 'flex-end', position: 'absolute', top: '8%' }}
        onPress={() => { if (settingscounter % 2 === 0) { bottomSheetRef.current.expand() } else { bottomSheetRef.current.close() }; setSettingsCounter(settingscounter + 1) }}
      >
        <Feather name="settings" size={40} color="black" />
      </TouchableOpacity>
      <Text style={{ textAlign: 'center', fontSize: 23, fontFamily: GlobalStyles.fontSet.fontsemibold }}>
        {isClockedIn
          ? `You're now on the clock, ${name.split(' ')[0]}!`
          : `Hello ${name.split(' ')[0]}! Are you ready to clock in?`
        }
      </Text>
      <TouchableOpacity style={{
        marginTop: 50,
        borderRadius: 25,
        marginVertical: 50,
        display: 'flex',
        elevation: 24,
        shadowOffset: { width: 0, height: 12 },
        backgroundColor: GlobalStyles.colorSet.primary1,
        shadowOpacity: 0.65,
        shadowRadius: 16.0
      }}
        onPress={() => {
          setIsClockedIn(!isClockedIn)
          GlobalFunctions.storeObject('isClockedin', !isClockedIn)
          const currentDate = new Date()
          GlobalFunctions.getObject('dateonpress').then((gottendateonpress) => {
            const dateformholder = new Date(gottendateonpress)
            if (dateformholder.getDay() < currentDate.getDay()) {
              setNewDate(true)
              if (counter % 2 !== 0) {
                setCounter(1)
              } else {
                setCounter(0)
              }
            } else {
              if (isNewDate) {
                setNewDate(false)
              }
            }
          })
          GlobalFunctions.storeObject('dateonpress', currentDate)
          // if dateonpress day is greater, >, than the last stored press, then set counter to 0 or 1
          let nomilitarytime = currentDate.getHours()
          let ampm = 'AM'
          if (currentDate.getHours() > 12) {
            nomilitarytime = currentDate.getHours() - 12
            ampm = 'PM'
          } else if (currentDate.getHours() === 0) {
            nomilitarytime = 12
          }
          const time = nomilitarytime + ':' + String(currentDate.getMinutes()).padStart(2, '0')

          if (!isClockedIn) { setCurrentTime(time); GlobalFunctions.storeString('currentTime', time); setStartTextAmpm(ampm); GlobalFunctions.storeString('startTextAmpm', ampm) } else { setClockoutTime(time); GlobalFunctions.storeString('clockouttime', time); setFinishTextAmpm(ampm); GlobalFunctions.storeString('finishTextAmpm', ampm) }
          if (counter % 2 !== 0) {
            geocodelocation(new GeoPoint(Globals.location.coords.latitude, Globals.location.coords.longitude))
              .then(result => {
                setDoc(doc(firestore, 'Data', 'HoursWorked'), {
                  [currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(currentDate.getDate()).padStart(2, '0')
                  ]: {
                    [name]: {
                      [(counter - 1)]: {
                        finishtime: time,
                        finishlocation: result,
                        finishampm: ampm
                      }
                    }
                  }
                }, { merge: true })
              })
          } else {
            geocodelocation(new GeoPoint(Globals.location.coords.latitude, Globals.location.coords.longitude))
              .then(result => {
                setDoc(doc(firestore, 'Data', 'HoursWorked'), {
                  [currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(currentDate.getDate()).padStart(2, '0')
                  ]: {
                    [name]: {
                      [counter]: {
                        starttime: time,
                        startlocation: result,
                        startampm: ampm
                      }
                    }
                  }
                }, { merge: true })
              })
          }
          const newcounter = counter + 1
          setCounter(newcounter)
          GlobalFunctions.storeObject('counter', newcounter)
        }}
      >
        {isClockedIn
          ? <Text style={{ color: 'white', paddingHorizontal: 100, paddingVertical: 20, fontWeight: 'bold' }}>
            Clock Out
          </Text>
          : <Text style={{ color: 'white', paddingHorizontal: 100, paddingVertical: 20, fontWeight: 'bold' }}>
            Clock In
          </Text>
        }
      </TouchableOpacity>
      <View style={{ display: 'flex', marginTop: '-5%' }}>
        <Text style={homestyles.clocktext}>Clocked in at {currentTime} {starttextampm}</Text>
      </View>
      <View style={{ display: (!isClockedIn && (clockoutTime !== '')) ? 'flex' : 'none', marginTop: 25 }}>
        <Text style={homestyles.clocktext}>Clocked out at {clockoutTime} {finishtextampm}</Text>
      </View>
      {isClockedIn &&
        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: '65%', marginTop: 50 }}>
          <Stopwatch isClockedIn={isClockedIn} passedDate={passedDate} isNewDate={isNewDate}/>
        </View>
      }
      {fileholder &&
        (function () {
          let workerhours = 0
          console.log(new Date().getDay())
          for (let i = new Date().getDay(); i > -1; i--) {
            const p = new Date()
            p.setDate(p.getDate() - i)
            // Loop through different shifts on given day
            console.log(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')[name]])
            if (fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')[name]]) {
              for (let n = parseInt(Object.entries(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][name])[0][0]); n < (parseInt(Object.entries(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][name])[0][0]) + (Object.keys(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][name]).length * 2) - 1); n += 2) {
                const tomillisecondsstart = (hrs, min) => {
                  if (fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][name][n].startampm === 'PM') {
                    return ((hrs + 12) * 60 * 60 + min * 60) * 1000
                  } else {
                    return (hrs * 60 * 60 + min * 60) * 1000
                  }
                }
                const tomillisecondsfinish = (hrs, min) => {
                  if (fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][name][n].finishampm === 'PM') {
                    return ((hrs + 12) * 60 * 60 + min * 60) * 1000
                  } else { return (hrs * 60 * 60 + min * 60) * 1000 }
                }
                const startmillisecondholder = tomillisecondsstart(parseInt(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' +
                  String(p.getDate()).padStart(2, '0')][name][n].starttime.split(':')[0]), parseInt(fileholder[p.getFullYear() + '-' +
                  String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][name][n].starttime.split(':')[1]))
                const endmillisecondholder = tomillisecondsfinish(parseInt(fileholder[p.getFullYear() + '-' + String(p.getMonth() + 1).padStart(2, '0') + '-' +
                  String(p.getDate()).padStart(2, '0')][name][n].finishtime.split(':')[0]), parseInt(fileholder[p.getFullYear() + '-' +
                  String(p.getMonth() + 1).padStart(2, '0') + '-' + String(p.getDate()).padStart(2, '0')][name][n].finishtime.split(':')[1]))
                const millisub = Math.abs(new Date(endmillisecondholder) - new Date(startmillisecondholder))
                workerhours += (millisub / 60000)
              }
            }
          }
          return (
            <View style={{
              borderRadius: 25,
              marginTop: 60,
              display: 'flex',
              elevation: 24,
              shadowOffset: { width: 0, height: 12 },
              backgroundColor: GlobalStyles.colorSet.primary1,
              shadowOpacity: 0.65,
              shadowRadius: 16.0
            }}
            >
              <Text style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'white',
                fontFamily: GlobalStyles.fontSet.font,
                paddingHorizontal: 20,
                paddingVertical: 10,
                textDecorationLine: 'underline'
              }}>
                Total Work Time for the Week (Excluding Today)
              </Text>
              <Text style={{
                textAlign: 'center',
                fontSize: 20,
                color: 'white',
                fontFamily: GlobalStyles.fontSet.font,
                paddingHorizontal: 20,
                paddingVertical: 10
              }}>
                {Math.floor(workerhours / 60)} hours and {workerhours % 60} minutes
              </Text>
            </View>
          )
        }())
      }
      <SettingsBottomSheet bottomSheetRef={bottomSheetRef}/>
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
    width: '100%'
  },

  bottomsheetpressablestext: {
    color: 'white',
    fontSize: 20,
    marginLeft: 13,
    fontWeight: 'bold'
  },

  clocktext: {
    fontFamily: GlobalStyles.fontSet.font,
    fontSize: 25
  }
})
