import React, {useEffect} from 'react';
import {AsyncStorage, BackHandler, DeviceEventEmitter} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView, } from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import RNCallKeep from 'react-native-callkeep';

import RoutesAuth from './src/routes/auth';
import RoutesApplyDetail from './src/routes/applyDetail';
import RoutesEarning from './src/routes/earning';
import RoutesFormRekomendasi from './src/routes/formRekomendasi';
import RoutesHome from './src/routes/home';
import RoutesJobDetail from './src/routes/jobDetail';
import RoutesProfile from './src/routes/profile';
import RoutesQuiz from './src/routes/quiz';
import RoutesResume from './src/routes/resume';

import SplashScreen from './src/app/splashScreen';
import Notification from './src/app/notification';
import Maps from './src/app/maps';
import ScanQR from './src/app/scanQR';
import Base from './src/utils/base';

import messaging from '@react-native-firebase/messaging'
import TextEncodingPolyfill from 'text-encoding'

Object.assign(global, {
	TextEncoder: TextEncodingPolyfill.TextEncoder,
	TextDecoder: TextEncodingPolyfill.TextDecoder,
});
const Stack = createStackNavigator();
export default class App extends Base {

	render(){
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>
			<SafeAreaProvider>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						gestureEnabled : true,
						gestureDirection : 'horizontal',
						...TransitionPresets.SlideFromRightIOS,
						headerMode: 'float',
					}}

					animation='fade'
				>

					<Stack.Screen
						name="SplashScreen"
						component={SplashScreen}
						options={{
							headerShown : false
						}}/>

					<Stack.Screen
						name="Notification"
						component={Notification}
						options={{
							headerShown : false
						}}/>

					<Stack.Screen
						name="Maps"
						component={Maps}
						options={{
							headerShown : false
						}}/>

					<Stack.Screen
						name="ScanQR"
						component={ScanQR}
						options={{
							headerShown : false
						}}/>

					<Stack.Screen
						name="Auth"
						component={RoutesAuth}
						options={{headerShown : false}}/>

					<Stack.Screen
						name="FormRekomendasi"
						component={RoutesFormRekomendasi}
						options={{headerShown : false}}/>

					<Stack.Screen
						name="Resume"
						component={RoutesResume}
						options={{headerShown : false}}/>

					<Stack.Screen
						name="Quiz"
						component={RoutesQuiz}
						options={{headerShown : false}}/>

					<Stack.Screen
						name="Home"
						component={RoutesHome}
						options={{headerShown : false}}/>

					<Stack.Screen
						name="Profile"
						component={RoutesProfile}
						options={{headerShown : false}}/>

					<Stack.Screen
						name="Earning"
						component={RoutesEarning}
						options={{headerShown : false}}/>

					<Stack.Screen
						name="JobDetail"
						component={RoutesJobDetail}
						options={{headerShown : false}}/>

					<Stack.Screen
						name="ApplyDetail"
						component={RoutesApplyDetail}
						options={{headerShown : false}}/>

				</Stack.Navigator>
			</NavigationContainer>
			</SafeAreaProvider>
			</SafeAreaView>
		)
	}
}