/* eslint-disable react/prop-types */
import React, { useMemo, useContext } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import { Pressable, View, Text, StyleSheet, Alert } from 'react-native'
import { AuthContext } from './AuthProvider'
import { Entypo } from '@expo/vector-icons'
import GlobalStyles from '../../GlobalStyles'
import { windowWidth } from './Dimensions'

export default function SettingsBottomSheet ({ bottomSheetRef, setter }) {
  const snapPoints = useMemo(() => [0.1, '14%'], [])
  const { logout } = useContext(AuthContext)

  return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{ backgroundColor: 'white', width: windowWidth * 0.133333333 }}
            backgroundStyle={{ backgroundColor: GlobalStyles.colorSet.neutral11 }}
        >
            <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 27 }}>
                <Pressable style={sbsstyles.bottomsheetpressables} onPress={() => { logout(); Alert.alert('Signed Out!'); if (setter) { setter() } }}>
                    <Entypo name="log-out" size={24} color={GlobalStyles.colorSet.red7} />
                    <Text style={[sbsstyles.bottomsheetpressablestext, { color: GlobalStyles.colorSet.red7 }]}>Log Out</Text>
                </Pressable>
            </View>
        </BottomSheet>
  )
}

const sbsstyles = StyleSheet.create({
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
    fontWeight: 'bold',
    fontFamily: 'Oswald_400Regular'
  }
})
