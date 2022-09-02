import React, {useRef, useMemo, useState, useContext} from 'react';
import {StyleSheet, View, Pressable, Text, TouchableOpacity, ScrollView} from 'react-native';
import { doc, setDoc, GeoPoint } from "firebase/firestore";
import BottomSheet from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { firestore } from '../../firebase';
import Globals from '../GlobalValues';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../GlobalStyles';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AuthContext } from '../components/global/AuthProvider';
import Sepline from '../assets/icons/sepline.svg';
import { Calendar } from 'react-native-calendars';

export default function AdminHome() {
  const {logout} = useContext(AuthContext);
  const [tempcounter, setTempCounter] = useState(0);

  const bottomSheetRef = useRef(BottomSheet);
  const snapPoints = useMemo(() => [0.1, '20%'], []);

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
                // selectedDayBackgroundColor: 'red',
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
            onDayPress={(date) => {console.log(date); setTempCounter(date.day); }}
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
        <ScrollView style={{marginTop: '5%'}}>
            <Text>Where all the {tempcounter} fetched worker hours will go</Text>
        </ScrollView>
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{backgroundColor: 'white', width: Globals.globalDimensions.width * .133333333,}}
            backgroundStyle={{backgroundColor: GlobalStyles.colorSet.neutral11}}
        > 
        <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 27}}>
          <Pressable style={homestyles.bottomsheetpressables}>
            <MaterialIcons name="account-circle" size={24} color="white" />
            <Text style={homestyles.bottomsheetpressablestext}>Account Details</Text>
          </Pressable>
          <View style={{left: 0, marginLeft: -27,}}>
            <Sepline width={Globals.globalDimensions.width} height={1} preserveAspectRatio="none" />
          </View>
          <Pressable style={homestyles.bottomsheetpressables} onPress={() => logout()}>
            <Entypo name="log-out" size={24} color={GlobalStyles.colorSet.red7} />
            <Text style={[homestyles.bottomsheetpressablestext, {color: GlobalStyles.colorSet.red7}]}>Log Out</Text>
          </Pressable>
        </View>
      </BottomSheet>
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

