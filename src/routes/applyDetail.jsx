import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import ApplyDetail from '../app/apply-detail/[id]';
import Lamaran from '../app/apply-detail/lamaran';
import LokasiKerja from '../app/apply-detail/lokasiKerja';
import Pekerjaan from '../app/apply-detail/pekerjaan';
import PencairanGaji from '../app/apply-detail/pencairan-gaji';


export default class RoutesApplyDetail extends Component {

	render(){
		const ApplyDetailStack = createStackNavigator()

		const headerNavBar = {
			title : null,
			headerShown : false,
		}
		return(
			<ApplyDetailStack.Navigator>

				<ApplyDetailStack.Screen
					name="ApplyDetail"
					component={ApplyDetail}
					options={headerNavBar}/>
				<ApplyDetailStack.Screen
					name="Lamaran"
					component={Lamaran}
					options={headerNavBar}/>
				<ApplyDetailStack.Screen
					name="LokasiKerja"
					component={LokasiKerja}
					options={headerNavBar}/>
				<ApplyDetailStack.Screen
					name="Pekerjaan"
					component={Pekerjaan}
					options={headerNavBar}/>
				<ApplyDetailStack.Screen
					name="PencairanGaji"
					component={PencairanGaji}
					options={headerNavBar}/>

			</ApplyDetailStack.Navigator>
		)
	}
}