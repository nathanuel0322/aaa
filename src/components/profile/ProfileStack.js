import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SettingsStack from './SettingsStack';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="SettingsStack">
      <Stack.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;