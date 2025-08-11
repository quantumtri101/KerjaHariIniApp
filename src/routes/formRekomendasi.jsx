import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import Category from '../app/form-rekomendasi/category';
import Finish from '../app/form-rekomendasi/finish';
import Location from '../app/form-rekomendasi/location';
import Position from '../app/form-rekomendasi/position';
import Rate from '../app/form-rekomendasi/rate';
import Start from '../app/form-rekomendasi/start';


export default class RoutesFormRekomendasi extends Component {

	render(){
		const FormRekomendasiStack = createStackNavigator()

		const headerNavBar = {
			title : null,
			headerShown : false,
		}
		return(
			<FormRekomendasiStack.Navigator>

				<FormRekomendasiStack.Screen
					name="Category"
					component={Category}
					options={headerNavBar}/>
				<FormRekomendasiStack.Screen
					name="Finish"
					component={Finish}
					options={headerNavBar}/>
				<FormRekomendasiStack.Screen
					name="Location"
					component={Location}
					options={headerNavBar}/>
				<FormRekomendasiStack.Screen
					name="Position"
					component={Position}
					options={headerNavBar}/>
				<FormRekomendasiStack.Screen
					name="Rate"
					component={Rate}
					options={headerNavBar}/>
				<FormRekomendasiStack.Screen
					name="Start"
					component={Start}
					options={headerNavBar}/>

			</FormRekomendasiStack.Navigator>
		)
	}
}