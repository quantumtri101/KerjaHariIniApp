import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import JobDetail from '../app/job-detail/[id]';
import Apply from '../app/job-detail/apply';
import ApplyReview from '../app/job-detail/applyReview';
import ApplySuccess from '../app/job-detail/applySuccess';
import InfoPekerjaan from '../app/job-detail/infoPekerjaan';
import Perusahaan from '../app/job-detail/perusahaan';
import VerifikasiPenerimaan from '../app/job-detail/verifikasiPenerimaan';


export default class RoutesJobDetail extends Component {

	render(){
		const JobDetailStack = createStackNavigator()

		const headerNavBar = {
			title : null,
			headerShown : false,
		}
		return(
			<JobDetailStack.Navigator>

				<JobDetailStack.Screen
					name="JobDetailIndex"
					component={JobDetail}
					options={headerNavBar}/>
				<JobDetailStack.Screen
					name="Apply"
					component={Apply}
					options={headerNavBar}/>
				<JobDetailStack.Screen
					name="ApplyReview"
					component={ApplyReview}
					options={headerNavBar}/>
				<JobDetailStack.Screen
					name="ApplySuccess"
					component={ApplySuccess}
					options={headerNavBar}/>
				<JobDetailStack.Screen
					name="InfoPekerjaan"
					component={InfoPekerjaan}
					options={headerNavBar}/>
				<JobDetailStack.Screen
					name="Perusahaan"
					component={Perusahaan}
					options={headerNavBar}/>
				<JobDetailStack.Screen
					name="VerifikasiPenerimaan"
					component={VerifikasiPenerimaan}
					options={headerNavBar}/>

			</JobDetailStack.Navigator>
		)
	}
}