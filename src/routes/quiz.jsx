import React, {Component} from 'react';
import { Text, View, TouchableWithoutFeedback, BackHandler } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';

import Quiz from '../app/quiz/[id]';
import Finish from '../app/quiz/finish';
import Start from '../app/quiz/start';


export default class RoutesQuiz extends Component {

	render(){
		const QuizStack = createStackNavigator()

		const headerNavBar = {
			title : null,
			headerShown : false,
		}
		return(
			<QuizStack.Navigator>

				<QuizStack.Screen
					name="QuizPage"
					component={Quiz}
					options={headerNavBar}/>
				<QuizStack.Screen
					name="QuizFinish"
					component={Finish}
					options={headerNavBar}/>
				<QuizStack.Screen
					name="QuizStart"
					component={Start}
					options={headerNavBar}/>

			</QuizStack.Navigator>
		)
	}
}