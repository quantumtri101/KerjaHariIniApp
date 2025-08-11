import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import Login from '../app/(auth)/login';
import Register from '../app/(auth)/register';
import OTPScreen from '../app/(auth)/otp';
import ForgotPassword from '../app/(auth)/forgotPass';
import ChangePassword from '../app/(auth)/changePass';


export default class RoutesAuth extends Component {

	render(){
		const AuthStack = createStackNavigator()

		const headerNavBar = {
			title : null,
			headerStyle : null,
			headerShown : false,
		}
		return(
			<AuthStack.Navigator>

				<AuthStack.Screen
					name="Login"
					component={Login}
					options={headerNavBar}/>
				<AuthStack.Screen
					name="Register"
					component={Register}
					options={headerNavBar}/>
				<AuthStack.Screen
					name="OTPScreen"
					component={OTPScreen}
					options={{title : null, headerShown: false, }}/>
				<AuthStack.Screen
					name="ForgotPassword"
					component={ForgotPassword}
					options={{title : null, headerShown: false, }}/>
				<AuthStack.Screen
					name="ChangePassword"
					component={ChangePassword}
					options={{title : null, headerShown: false, }}/>

			</AuthStack.Navigator>
		)
	}
}