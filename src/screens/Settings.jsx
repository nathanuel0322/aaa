import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalStyles from '../GlobalStyles';
import Globals from '../GlobalValues';
import SettingsStackHeader from '../components/settings/SettingsStackHeader';

import WalletIcon from '../assets/icons/walleticon.svg'; 
import LanguageIcon from '../assets/icons/languageicon.svg';
import CountryIcon from '../assets/icons/countryicon.svg';
import SocialMediaIcon from '../assets/icons/socialmediaicon.svg';
import PrivacyIcon from '../assets/icons/privacyicon.svg';
import AccountIcon from '../assets/icons/accountdetailicon.svg';
import Sepline from '../assets/icons/sepline.svg';
import AboutIcon from '../assets/icons/info-transparent.svg';

export default function Settings({navigation}) {
  return (
    <View>
        <SettingsStackHeader navigation={navigation} currentPage={'Settings'} navtoPage={'ProfileMain'} hideRightButton={true} />
        <View style={{left: 0}}>
            <TouchableOpacity style={settingsstyles.settingspressables}>
                <AccountIcon />
                <Text style={settingsstyles.settingspressablestext}>Account Details</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const settingsstyles = StyleSheet.create({
  settingspressables: {
    flexDirection: 'row', 
    marginLeft: 24,
    alignItems: 'center',
    paddingVertical: 32,
  },
  
  settingspressablestext: {
    color: 'white', 
    fontFamily: GlobalStyles.fontSet.fontsemibold, 
    fontSize: 18, 
    marginLeft: 9,
  },
})
