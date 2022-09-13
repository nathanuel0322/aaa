import  React, { useState, useEffect }  from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import GlobalStyles from '../../GlobalStyles';

export default function Stopwatch({isClockedIn}) {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10)
        } else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    useEffect(() => {
        if (isClockedIn) {
            setRunning(!running);
        }
        else{
            setTime(0);
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