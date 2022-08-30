import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import { BlurView } from 'expo-blur';
import GlobalStyles from '../../GlobalStyles';
import Globals from '../../GlobalValues';

import ArrowLeftIcon from '../../assets/icons/arrowlefticon.svg';
import AddIcon from '../../assets/icons/addicon.svg';

export default function SettingsStackHeader({navigation, currentPage, navtoPage, hideRightButton, passfunc}) {
  return (
    <View style={{backgroundColor: GlobalStyles.colorSet.neutral12, flexDirection: 'row',
        width: '100%', height: Globals.globalDimensions.height * .184729064, alignItems: 'center', justifyContent: 'space-around'}}
    >
        <TouchableOpacity style={{overflow: 'hidden', width: Globals.globalDimensions.width * .133333333, 
                height: Globals.globalDimensions.width * .133333333, borderRadius: 46, top: 10}}
            onPress={() => {navigation.goBack()}}
        >
            <BlurView intensity={5} 
                style={{backgroundColor: GlobalStyles.colorSet.neutral11, borderRadius: 46, 
                    width: Globals.globalDimensions.width * .133333333, height: Globals.globalDimensions.width * .133333333, 
                    alignItems: 'center',justifyContent: 'center',}}
            >
                <ArrowLeftIcon />
            </BlurView>
        </TouchableOpacity>
        <Text style={{color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold, fontSize: 20, 
            top: 10,}}
        >
            {currentPage}
        </Text>
        <TouchableOpacity style={{opacity: hideRightButton && 0, overflow: 'hidden', width: Globals.globalDimensions.width * .133333333, 
                height: Globals.globalDimensions.width * .133333333, borderRadius: 46, top: 10,}}
        >
            <BlurView intensity={5} 
                style={{backgroundColor: GlobalStyles.colorSet.cyan6, borderRadius: 46, 
                    width: Globals.globalDimensions.width * .133333333, height: Globals.globalDimensions.width * .133333333, 
                    alignItems: 'center',justifyContent: 'center',
                }}
            >
                <AddIcon />
            </BlurView> 
        </TouchableOpacity>
    </View>
  )
}