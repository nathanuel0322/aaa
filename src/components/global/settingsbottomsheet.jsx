import React, {useRef, useMemo, useContext} from "react";
import BottomSheet from '@gorhom/bottom-sheet';
import { Pressable, View, Text, StyleSheet } from "react-native";
import GlobalValues from "../../GlobalValues";
import Sepline from '../../assets/icons/sepline.svg';
import { AuthContext } from "./AuthProvider";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function SettingsBottomSheet({bottomSheetRef}) {
    const snapPoints = useMemo(() => [0.1, '20%'], []);
    const {logout} = useContext(AuthContext);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{backgroundColor: 'white', width: GlobalValues.globalDimensions.width * .133333333,}}
            backgroundStyle={{backgroundColor: GlobalStyles.colorSet.neutral11}}
        >
            <View style={{flex: 1, alignItems: 'flex-start', marginLeft: 27}}>
            <Pressable style={sbsstyles.bottomsheetpressables}>
                <MaterialIcons name="account-circle" size={24} color="white" />
                <Text style={sbsstyles.bottomsheetpressablestext}>Account Details</Text>
            </Pressable>
            <View style={{left: 0, marginLeft: -27,}}>
                <Sepline width={GlobalValues.globalDimensions.width} height={1} preserveAspectRatio="none" />
            </View>
            <Pressable style={sbsstyles.bottomsheetpressables} onPress={() => {logout()}}>
                <Entypo name="log-out" size={24} color={GlobalStyles.colorSet.red7} />
                <Text style={[sbsstyles.bottomsheetpressablestext, {color: GlobalStyles.colorSet.red7}]}>Log Out</Text>
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
        width: '100%',
    },
    
    bottomsheetpressablestext: {
        color: 'white', 
        fontSize: 20, 
        marginLeft: 13,
        fontWeight: 'bold',
    },
})