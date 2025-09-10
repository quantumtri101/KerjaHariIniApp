import React, {useEffect, useState} from 'react';
import {
	View,
		Text,
		Image,
		ScrollView,
		ImageBackground,
		DeviceEventEmitter,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Camera, } from 'react-native-vision-camera';

import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import useFetch from "../hook/useFetch";
import { COLORS } from "../constants";
import Base from "../utils/base";
// import notifee, { EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

export default function SplashScreen(props) {
	var base = new Base()
	const getProfile = useFetch("GET", "auth/profile", {}, false);
	const [userData, setUserData] = useState({})

	useEffect(() => {
		initialize()
	}, [])

	useEffect(() => {
		
		if(getProfile.data.status != null){
			
			if(getProfile.data.status == 'success'){
				setUserData(getProfile.data.data)
			}
			else{
				base.alertSnackbar(getProfile.data.message)
				redirect_login()				
			}
		}
	}, [getProfile.data, ])

	useEffect(() => {
		if(userData.id != null)
			onNextAction()
	}, [userData, ])

	async function initialize(){
		await Camera.requestCameraPermission()
		Geolocation.requestAuthorization()

		const token = await AsyncStorage.getItem("token");
		const tempToken = await AsyncStorage.getItem("tempToken");

		
		if(tempToken != null || token != null)
			getProfile.setRefetch()
		else
			onNextAction()
	}

	async function redirect_login() {
		await AsyncStorage.removeItem("token")
		await AsyncStorage.removeItem("tempToken")
		props.navigation.replace('Auth', {screen : 'Login', })
	}

	function onNextAction(){
		setTimeout(async () => {
			// await AsyncStorage.removeItem("lastRequirementPage")
			// await AsyncStorage.removeItem("lastResumePage")
			// await AsyncStorage.removeItem("arr_skill")
			// AsyncStorage.setItem('lastResumePage', 'KTP')

			const token = await AsyncStorage.getItem("token");
			const tempToken = await AsyncStorage.getItem("tempToken");
			const isRequirementFinish = await AsyncStorage.getItem("isRequirementFinish");
			const lastAuthPage = await AsyncStorage.getItem("lastAuthPage");
			const lastRequirementPage = await AsyncStorage.getItem("lastRequirementPage");
			const lastResumePage = await AsyncStorage.getItem("lastResumePage");
			const lastQuizPage = await AsyncStorage.getItem("lastQuizPage");
			const notifRedirect = await AsyncStorage.getItem("notifRedirect")

			var arrNextPage = []
			if(userData.id != null){
				if(userData.jobs_recommendation.length == 0)
					arrNextPage.push({
						id: 1,
						route: 'FormRekomendasi',
						screen: 'Start',
					})
				if(userData.resume.length == 0)
					arrNextPage.push({
						id: 2,
						route: 'Resume',
						screen: 'Start',
					})
				if(userData.general_quiz_result.length == 0)
					arrNextPage.push({
						id: 3,
						route: 'Quiz',
						screen: 'QuizStart',
					})
				if(arrNextPage.length > 0)
					await AsyncStorage.setItem("arrNextPage", JSON.stringify(arrNextPage))
			}

			if (tempToken != null || (userData.id != null && userData.phone_verified_at == null))
				props.navigation.replace('Auth', {screen : 'OTPScreen', params: {prev: 'login', phone: userData.phone, }, })
			else if (token == null)
				props.navigation.replace('Auth', {screen : 'Login', })
			else if (arrNextPage.length > 0)
				props.navigation.replace(arrNextPage[0].route, {screen : arrNextPage[0].screen, })
			else if (lastAuthPage != null)
				props.navigation.replace('Auth', {screen : lastAuthPage, })
			else if (lastRequirementPage != null)
				props.navigation.replace('FormRekomendasi', {screen : lastRequirementPage, })
			else if (lastResumePage != null)
				props.navigation.replace('Resume', {screen : lastResumePage, params: {reviewResume: false, editResume: false,} })
			else if (lastQuizPage != null)
				props.navigation.navigate('Quiz', {screen : lastQuizPage, })
			else if (notifRedirect != null) {
				props.navigation.replace('Home', {screen : notifRedirect, })
				await AsyncStorage.removeItem("notifRedirect");
			}
			else
				props.navigation.replace('Home', {screen : 'HomeTab'})
		}, 3000)
	}

	return (
		<View>
			<View style={{height : '100%', backgroundColor: 'white', }}>
				<ImageBackground source={{}} resizeMode='cover' style={{width : '100%'}}>
					<View style={{alignItems : 'center', justifyContent : 'center', height : '100%'}}>
						<Image source={require('../assets/png/logo.png')} style={{height : 'auto', width : '80%', aspectRatio : 1, resizeMode : 'contain'}} />
					</View>
				</ImageBackground>
			</View>
		</View>
	)
}
