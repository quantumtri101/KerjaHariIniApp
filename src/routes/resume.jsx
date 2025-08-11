import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import FaceRecognition from '../app/resume/faceRecognition';
import Finish from '../app/resume/finish';
import Informasi01 from '../app/resume/informasi_01';
import Informasi02 from '../app/resume/informasi_02';
import KtpCamera from '../app/resume/ktp-camera';
import Ktp from '../app/resume/ktp';
import PengalamanKerja from '../app/resume/pengalamanKerja';
import Review from '../app/resume/review';
import SelfieKtp from '../app/resume/selfieKtp';
import Skill from '../app/resume/skill';
import Start from '../app/resume/start';


export default class RoutesResume extends Component {

	render(){
		const ResumeStack = createStackNavigator()

		const headerNavBar = {
			title : null,
			headerShown : false,
		}
		return(
			<ResumeStack.Navigator>

				<ResumeStack.Screen
					name="FaceRecognition"
					component={FaceRecognition}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="Finish"
					component={Finish}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="Informasi01"
					component={Informasi01}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="Informasi02"
					component={Informasi02}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="KtpCamera"
					component={KtpCamera}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="KTP"
					component={Ktp}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="PengalamanKerja"
					component={PengalamanKerja}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="Review"
					component={Review}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="SelfieKtp"
					component={SelfieKtp}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="Skill"
					component={Skill}
					options={headerNavBar}/>
				<ResumeStack.Screen
					name="Start"
					component={Start}
					options={headerNavBar}/>

			</ResumeStack.Navigator>
		)
	}
}