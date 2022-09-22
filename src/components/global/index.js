import 'react-native-gesture-handler';
import React from 'react';
import { AuthProvider } from './AuthProvider';
import {Routes} from './Routes';
import { LogBox } from "react-native";
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]);

const Providers = ({passedDate}) => {
  console.log('Passed date to providers is:', passedDate)
  return (
    <AuthProvider>
      <Routes passedDate={passedDate} />
    </AuthProvider>
  );
}

export default Providers;