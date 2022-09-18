import * as Location from 'expo-location';
import Globals from './GlobalValues';

export default {
    _getLocationAsync: async (isknown) => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }
        let currentlocation;
        if (isknown){
            currentlocation = await Location.getLastKnownPositionAsync({});
            console.log('current location is known');
            Globals.location = currentlocation;
        }
        else {
            currentlocation = await Location.getCurrentPositionAsync({});
            Globals.location = currentlocation;
        }
    },
}