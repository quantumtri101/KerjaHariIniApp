import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import MyProfile from '../app/(profile)/myProfile';
import BypassRecruit from '../app/(profile)/bypassRecruit';
import ChangePassProfile from '../app/(profile)/changePassProfile';
import MyQR from '../app/(profile)/myQR';
import PrivacyPolicy from '../app/(profile)/privacyPolicy';
import RecruitScanQR from '../app/(profile)/recruitScanQR';
import TermCondition from '../app/(profile)/tnc';


export default class RoutesProfile extends Component {

	render(){
		const ProfileStack = createStackNavigator()

		const headerNavBar = {
			title : null,
			headerShown : false,
		}
		return(
			<ProfileStack.Navigator>

				<ProfileStack.Screen
					name="MyProfile"
					component={MyProfile}
					options={headerNavBar}/>
				<ProfileStack.Screen
					name="BypassRecruit"
					component={BypassRecruit}
					options={headerNavBar}/>
				<ProfileStack.Screen
					name="ChangePassProfile"
					component={ChangePassProfile}
					options={headerNavBar}/>
				<ProfileStack.Screen
					name="MyQR"
					component={MyQR}
					options={headerNavBar}/>
				<ProfileStack.Screen
					name="PrivacyPolicy"
					component={PrivacyPolicy}
					options={headerNavBar}/>
				<ProfileStack.Screen
					name="RecruitScanQR"
					component={RecruitScanQR}
					options={headerNavBar}/>
				<ProfileStack.Screen
					name="TermCondition"
					component={TermCondition}
					options={headerNavBar}/>

			</ProfileStack.Navigator>
		)
	}
}