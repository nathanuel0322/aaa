/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, AppState } from 'react-native'
import GlobalStyles from '../../GlobalStyles'
import GlobalFunctions from '../../GlobalFunctions'

export default function Stopwatch ({ isClockedIn, passedDate }) {
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => { appState.current = nextAppState })
    let interval
    if (running) {
      interval = setInterval(() => {
        if (appState.current === 'inactive') { clearInterval(interval) }
        setTime((prevTime) => {
          setHours(Math.floor(prevTime / 3600))
          setMinutes(Math.floor(prevTime % 3600 / 60))
          setSeconds(Math.floor(prevTime % 60))
          return prevTime + 1
        })
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => { clearInterval(interval); subscription.remove() }
  }, [running])

  useEffect(() => {
    if (isClockedIn) {
      GlobalFunctions.getObject('dateonpress').then((gottendate) => {
        const holdergottendate = new Date(gottendate)
        if (passedDate.getTime() > holdergottendate.getTime()) {
          setTime((passedDate.getTime() - holdergottendate.getTime()) / 1000)
        }
      })
      setRunning(!running)
    }
  }, [])

  return (
    <View style={{ marginTop: 50 }}>
      <View style={[styles.parent, {
        height: '150%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        elevation: 24,
        paddingHorizontal: '5%',
        shadowOffset: { width: 0, height: 12 },
        backgroundColor: GlobalStyles.colorSet.primary1,
        shadowOpacity: 0.65,
        shadowRadius: 16.0,
        paddingRight: '11%'
      }]}>
        <Text style={styles.child}>{('0' + hours).slice(-2) + ':'}</Text>
        <Text style={styles.child}>{('0' + minutes).slice(-2) + ':'}</Text>
        <Text style={styles.child}>{('0' + seconds).slice(-2)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 80,
    backgroundColor: '#694966'
  },

  child: {
    fontSize: 36,
    color: 'white',
    fontFamily: GlobalStyles.fontSet.font
  }
})
