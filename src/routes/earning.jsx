import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import Earning from '../app/earning/index';
import PayoutReview from '../app/earning/payoutReview';
import Processing from '../app/earning/processing';
import RequestPayout from '../app/earning/requestPayout';


export default class RoutesEarning extends Component {

	render(){
		const EarningStack = createStackNavigator()

		const headerNavBar = {
			title : null,
			headerShown : false,
		}
		return(
			<EarningStack.Navigator>

				<EarningStack.Screen
					name="EarningIndex"
					component={Earning}
					options={headerNavBar}/>
				<EarningStack.Screen
					name="PayoutReview"
					component={PayoutReview}
					options={headerNavBar}/>
				<EarningStack.Screen
					name="Processing"
					component={Processing}
					options={headerNavBar}/>
				<EarningStack.Screen
					name="RequestPayout"
					component={RequestPayout}
					options={headerNavBar}/>

			</EarningStack.Navigator>
		)
	}
}