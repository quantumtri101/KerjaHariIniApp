import React, { Component } from 'react';
import {Alert, BackHandler, DeviceEventEmitter} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment'
import dotenv from 'dotenv'
import Snackbar from 'react-native-snackbar'
import messaging from '@react-native-firebase/messaging'
// import I18n from './i18n'
import NetInfo from "@react-native-community/netinfo";

export default class Base extends Component {

	host = 'https://kerjahariini.id'
	// host = 'https://casual-admin.quantumtri.com'
	url = this.host + '/api';
	url_image = this.host + '/image';
	url_socket = this.host + ':6006';
	def_lang = 'id'
	// i18n = I18n

	priceFormatIDR = 'id-ID'
	loadingTimeout = 750
	axiosTimeout = 600000
	searchWaitTimeout = 1500

	arrPriceFormat = {
		'en': {
			format: 'en-US',
			thousandSeparator: ',',
			decimalSeparator: '.',
		},
		'id': {
			format: 'id-ID',
			thousandSeparator: '.',
			decimalSeparator: ',',
		},
		'ja': {
			format: 'ja-JP',
			thousandSeparator: ',',
			decimalSeparator: '.',
		},
		'zh': {
			format: 'zh-CN',
			thousandSeparator: ',',
			decimalSeparator: '.',
		},
	}

	axios = axios;
	moment = moment;

	imagePickerOption = {
		noData : false,
		quality : 0.8,
		allowsEditing: false,
	}

	constructor(props){
		super(props)
		axios.defaults.headers.common['Content-Type'] = 'application/json'
		axios.defaults.headers.common['Accept'] = 'application/json'
		axios.defaults.timeout = this.axiosTimeout
		var context = this
	}

	async toRefund(props, consultation_id){
		props.navigation.navigate('Order', {screen : 'Refund', params : {id : consultation_id, navFrom : 'home'}})
		}

	async setLang(lang){
		// this.i18n.locale = (lang != null ? lang : 'id-ID')
	}

	async checkConnection(){
		var is_connect = true
		NetInfo.fetch().then(state => {
			is_connect = state.isConnected
		});
		return is_connect
	}

	async request(url, method = "get", data = {}, onUploadProgress = response => {}){
		var is_connect = await this.checkConnection()
		var context = this

		if(is_connect){

			var header = {
				"Content-Type": "application/json",
				"Accept": "application/json",
			}

			var token = await AsyncStorage.getItem('token')
			if(token != null){
				axios.defaults.headers.common['Authorization'] = token
				header['Authorization'] = token
			}

			try{
				var response
				if(method === 'get'){
					for(let x in data)
						url += (url.includes('?') ? '&' : '?') + x + "=" + (Array.isArray(data[x]) ? JSON.stringify(data[x]) : data[x])

					response = await axios.get(url, {
						headers: header,
					})
					.catch(function (error) {
						if (error.response.code != 200) {
							console.log(error.response.data)
						}
					})
				}
				else if(method === 'post'){
					response = await axios.post(url, data, {
						headers: header,
						onUploadProgress
					})
					.catch(function (error) {
						console.log(error)
						if (error.response.code != 200) {
							console.log(error.response.data)
						}
					})
				}
				else if(method === 'put'){
					response = await axios.put(url, data, {
						headers: header,
						onUploadProgress
					})
					.catch(function (error) {
						if (error.response.code != 200) {
							console.log(error.response.data)
						}
					})
				}
				else if(method === 'delete'){
					response = await axios.delete(url, {
						headers: header,
						data: data,
					})
					.catch(function (error) {
						if (error.response.code != 200) {
							console.log(error.response.data)
						}
					})
				}

				return response.data
			} catch (e) {
				return null
				// alertSnackbar()
				// setTimeout(() => {
				// console.log(e)
				// }, 500)
			}
		}
		else{
			var button_arr = [
				{
					text: 'ok',
					onPress: () => BackHandler.exitApp()
				},
			]
			this.alertReact('Warning', 'Check Connection', button_arr)
		}
	}

	url_photo(type, file_name){
		var image_url = {uri : file_name != null ? this.url_image + '/' + type + '?file_name=' + file_name + '&random=' + new Date().getTime() : this.no_profile_picture}
		return image_url
	}

	alertSnackbar(message){
		setTimeout(() => {
			Snackbar.show({
				text: message,
				duration: Snackbar.LENGTH_SHORT,
			});
		}, 500);
	}

	alertReact (title, message, button_arr, is_cancelable=false){
		Alert.alert(
						title, message, button_arr,
						{cancelable: is_cancelable},
				);
	}

	async requestUserPermission() {
		const authorizationStatus = await messaging().requestPermission();

		if (authorizationStatus) {
			// await messaging().setBackgroundMessageHandler(async remoteMessage => {
			// console.log('Message handled in the background!', remoteMessage);
			// });

			console.log('Permission status:', authorizationStatus);
		}
	}

	async check_firebase_token(navigation) {
		var token = await AsyncStorage.getItem('token')
		var userType = await AsyncStorage.getItem('userType')

		if(token != null){
			try {
			var response = await this.axios.get(this.url + '/auth/firebase-token/check', {
				headers: {
				'Content-Type': 'application/json',
				Authorization: token,
				},
			});
			// console.log(navigation.state)
			if (response.data.status == 'success') {
					if(response.data.force_login){
						var lang = await AsyncStorage.getItem('lang')
					await AsyncStorage.clear()
					if(lang != null){
						await AsyncStorage.setItem('lang', lang)
					}
					Alert.alert(
						'Warning',
						'Need Relogin',
						[
							{
							text: 'OK',
							onPress: () => navigation.replace('Auth', {screen : 'IndexAuth', params : {userType : userType}, navFrom : 'home'})
							},
						],
						{cancelable: false},
					)
				}
			}
			} catch (e) {
				await this.alertSnackbar(e.message)
			}
		}
	}

	phone_validation(data, max_length = 12){
		data = String(this.str_to_double(data, ''))
		if(isNaN(data))
			data = '0'
		if(data.charAt(0) === '0')
			data = data.slice(1)
		if(max_length > 0 && data.length > max_length)
			data = data.substring(0, max_length)
		return data
	}

	async to_currency_format(data, max_number = 100000000, max_comma_length = 2){
		var value = data
		var lang = await AsyncStorage.getItem('lang')
		if(lang == null)
			lang = 'en'

		if(value[value.length - 1] !== this.arrPriceFormat[lang].decimalSeparator){
			var is_include_comma = false
			var is_convert_double = true
			var index_comma = 0
			for(let x = 0; x < value.length; x++){
				if(value[x] === this.arrPriceFormat[lang].decimalSeparator){
					is_include_comma = true
					index_comma = x
				}
				else if(is_include_comma && x == value.length - 1 && value[x] === "0")
					is_convert_double = false
			}

			if(is_include_comma){
				is_convert_double = value.length - index_comma > max_comma_length && value[value.length - 2] !== "0"
				value = value.substring(0, index_comma + 1 + max_comma_length)
			}


			if(is_convert_double){
				value = this.str_to_double(value, '0', lang)
				if(isNaN(value))
					value = 0
				if(value > max_number)
					value = max_number
			}

		}

		return value.toLocaleString(lang != null ? this.arrPriceFormat[lang].format : this.priceFormatIDR, {minimumFractionDigits: 0})
	}

	validate_email(email){
		return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	}

	check_phone_format(data){
		return data.length > 0 && data[data.length - 1].match(/^[\d\s]+$/g) == null ? data.substring(0, data.length - 1) : data
	}

	str_to_double(data, default_value = '0', lang = 'id'){
		var value
		if(data != ''){
			// var thousandRegex = new RegExp(this.arrPriceFormat[lang].thousandSeparator, "g")
			// var decimalRegex = new RegExp(this.arrPriceFormat[lang].decimalSeparator, "g")

			if(this.arrPriceFormat[lang].thousandSeparator == ',')
				value = parseFloat(data.replace(/,/g,'').replace(/\.g/,'.'))
			else if(this.arrPriceFormat[lang].thousandSeparator == '.')
				value = parseFloat(data.replace(/\./g,'').replace(/,g/,'.'))

		}
		else
			value = default_value

		return value
	}

	async toDataURLPromise(url) {
		return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
				var reader = new FileReader();
				reader.onloadend = function() {
					resolve(reader.result);
				}
				reader.readAsDataURL(xhr.response);
			};
			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
		})
	}

	// logo = require('../assets/images/png/ic_sportina_logotext1.png');
	// competition_example = require('../assets/images/png/competition.jpg');
// 	no_profile_picture = require('../assets/png/no_profile_picture.png');
// 	no_image = require('../assets/jpg/no_image_available.jpeg');
//
// 	img_splash_screen_bg = require('../assets/png/splash_screen_bg.png')
//
// 	img_logo1 = require('../assets/png/Logo-HaloBos-1.png')
// 	img_logo2 = require('../assets/png/Logo-HaloBos-2.png')
// 	img_logo3 = require('../assets/png/Logo-HaloBos-3.png')
// 	img_logo4 = require('../assets/png/Logo-HaloBos-4.png')
// 	img_logo5 = require('../assets/png/Logo-HaloBos-5.png')
// 	img_logo6 = require('../assets/png/Logo-HaloBos-6.png')
//
// 	img_banner = require('../assets/png/banner.png')
//
// 	// img_logo = require('../assets/png/Logo.png');
// 	img_welcome = require('../assets/png/Welcome.png');
// 	preloader = require('../assets/loading.gif');
//
// 	onBoard_1 = require('../assets/onBoard/onBoard_1.jpg');
// 	onBoard_2 = require('../assets/onBoard/onBoard_2.png');
// 	onBoard_3 = require('../assets/onBoard/onBoard_3.jpg');
// 	onBoard_4 = require('../assets/onBoard/onBoard_4.jpg');
// 	permission_1 = require('../assets/onBoard/permission_1.jpg');
// 	permission_2 = require('../assets/onBoard/permission_2.jpg');
// 	permission_3 = require('../assets/onBoard/permission_3.jpg');
// 	samsung_permission_1 = require('../assets/onBoard/samsung_permission1.png');
}
