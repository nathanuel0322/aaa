import AsyncStorage from '@react-native-async-storage/async-storage';
import  React, { useState, useEffect, useRef }  from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import GlobalStyles from '../../GlobalStyles';

export default function Stopwatch({isClockedIn, passedDate, isNewDate}) {
    const getObject = async (itemstring) => {
        const jsonvalue = await AsyncStorage.getItem(itemstring);
        return jsonvalue ? JSON.parse(jsonvalue) : null;
    }
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    let appState = useRef(AppState.currentState)
    getObject('timeonsamedate').then((gottentime) => {
        if (!isNewDate){
            setTime(gottentime)
        }
    })

    const storeObject = async (itemstring, object) => {
        try {await AsyncStorage.setItem(itemstring, JSON.stringify(object))} catch (e) {console.log(e)}
    }

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {appState.current = nextAppState});
        let interval;
        if (running) {
            interval = setInterval(() => {
                if (appState.current === 'inactive') {clearInterval(interval)}
                setTime((prevTime) => {storeObject('timeonsamedate', prevTime+10) ; return prevTime + 10});
            }, 10)
        } else {
            clearInterval(interval);
        }
        return () => {clearInterval(interval); subscription.remove()};
    }, [running]);

    useEffect(() => {
        if (isClockedIn) {
            getObject('dateonpress').then((gottendate) => {
                console.log("dateonpress ran in isclockedin")
                let holdergottendate = new Date(gottendate);
                console.log("yk:", passedDate.getTime() > holdergottendate.getTime())
                if (passedDate.getTime() > holdergottendate.getTime()){setTime(passedDate.getTime() - holdergottendate.getTime())}
            })
            setRunning(!running);
        }
    }, [])
    
    return (
        <View style={{marginTop: 50}}>
            <View style={[styles.parent, {height: '150%', justifyContent: 'center', alignItems: 'center', width: '80%', elevation: 24, 
                paddingHorizontal: '5%', shadowOffset: {width: 0, height: 12}, backgroundColor: GlobalStyles.colorSet.primary1, shadowOpacity: 0.65, 
                shadowRadius: 16.0, paddingRight: '11%'
            }]}>
                <Text style={styles.child}>{("0" + Math.floor((time / 3600000) % 60)).slice(-2)+":"}</Text>
                <Text style={styles.child}>{("0" + Math.floor((time / 60000) % 60)).slice(-2)+":"}</Text>
                <Text style={styles.child}>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    parent: {
        display: "flex",
        flexDirection: "row",
        borderRadius: 80,
        backgroundColor: '#694966',
    },

    child: {
      fontSize: 36,
      color: "white",
      fontFamily: GlobalStyles.fontSet.font
    },
});