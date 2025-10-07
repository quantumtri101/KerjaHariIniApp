import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	ToastAndroid,
	Image,
	PermissionsAndroid,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/common/header/header";
// import { Link, Stack, useRouter } from "expo-router";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
import { Skeleton, TextField, Button } from "../../components";
import useFetch from "../../hook/useFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Utils from "../../utils";
import messaging from "@react-native-firebase/messaging";
import Base from "../../utils/base";

export default function LoginScreen(props) {
	var base = new Base()
	const [phoneNum, setPhoneNum] = useState('');
	const [password, setPassword] = useState('');
	const [fcmToken, setFcmToken] = useState('');
	const [isPhoneError, setIsPhoneError] = useState(false);
	const [isPhoneErrorMessage, setIsPhoneErrorMessage] = useState("");
	const [isPassError, setIsPassError] = useState(false);
	const [isPassErrorMessage, setIsPassErrorMessage] = useState(false);
	const passRef = useRef();
	const phoneRef = useRef();
	const { data, isLoading, error, refetch, fetchData } = useFetch("POST", "auth/login", {
		email: phoneNum,
		password: password,
		token: fcmToken,
		type: 'customer_oncall',
	}, false);

	const checkFieldPhone = () => {
		let phoneCheck = Utils.Check_TextField_Phone(phoneNum);
		phoneCheck != null
			? setIsPhoneError(true) & setIsPhoneErrorMessage(phoneCheck)
			: setIsPhoneError(false);
	};

	const handleLogin = () => {
		setIsPhoneError(false);
		setIsPassError(false);

		let passCheck = password;
		checkFieldPhone();
		if (passCheck == "") {
			setIsPassError(true);
			setIsPassErrorMessage("Password is required");
		} 
		else
			refetch()
	};

	const generateFCMDeviceToken = async () => {
		const token = await messaging().getToken();
		setFcmToken(token);
	};

	useEffect(() => {
		setPhoneNum(phoneNum.length < 3 ? "+62" : phoneNum)
	}, [phoneNum, ]);

	useEffect(() => {
		PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		generateFCMDeviceToken();
	}, []);

	useEffect(() => {
		if(data.status != null){
			if (data.status == "success") {
				var arrNextPage = manageNextPage()
				
				if (data.user.phone_verified_at == null) {
					AsyncStorage.setItem('tempToken', data.token)
					props.navigation.replace('Auth', {screen : 'OTPScreen', params: {prev: 'login', }, })
				} else if (arrNextPage.length > 0){
					AsyncStorage.setItem('token', data.token)
					props.navigation.replace(arrNextPage[0].route, {screen : arrNextPage[0].screen, })
				} else {
					AsyncStorage.setItem('token', data.token)
					props.navigation.replace('Home', {screen : 'home'})
				}
			} 
			else {	
				if (data.type == "email") {
					setIsPhoneError(true);
					setIsPhoneErrorMessage(data.message);
				} else if (data.type == "password") {
					setIsPassError(true);
					setIsPassErrorMessage(data.message);
				}
				else
					base.alertSnackbar(data.message)
			}
		}
	}, [data]);

	function manageNextPage(){
		var arrNextPage = []
		if(data.user.jobs_recommendation.length == 0)
			arrNextPage.push({
				id: 1,
				route: 'FormRekomendasi',
				screen: 'Start',
			})
		if(data.user.resume.length == 0)
			arrNextPage.push({
				id: 2,
				route: 'Resume',
				screen: 'Start',
			})
		if(data.user.general_quiz_result.length == 0)
			arrNextPage.push({
				id: 3,
				route: 'Quiz',
				screen: 'QuizStart',
			})
		if(arrNextPage.length > 0)
			AsyncStorage.setItem("arrNextPage", JSON.stringify(arrNextPage))
		
		return arrNextPage
	}

	return (
		<View style={{ flex: 1, }}>


			<ScrollView style={styles.scrollView}>
				<View style={{ flex: 1, }}>
					<Header/>

					<View style={styles.container}>
						<Text style={FONTSTYLES.h1}>Selamat Datang{"\n"}Kembali</Text>
						<Text style={FONTSTYLES.p}>Lakukan Pengisian Data Anda</Text>
						<TextField
							ref={phoneRef}
							containerStyle={{ marginTop: 40 }}
							label={"No. Handphone"}
							placeholder={"+62"}
							defaultValue={"+62"}
							keyboardType={"phone-pad"}
							value={phoneNum}
							required
							error={isPhoneError}
							errorMessage={isPhoneErrorMessage}
							onChangeText={(value) => setPhoneNum(value)}
							onSubmitEditing={() => checkFieldPhone() || passRef.current.focus()}
						/>
						<TextField
							ref={passRef}
							label={"Password"}
							placeholder={"********"}
							error={isPassError}
							errorMessage={isPassErrorMessage}
							onChangeText={(value) => setPassword(value)}
							onSubmitEditing={() => handleLogin()}
							secureTextEntry
							returnKeyType={"done"}
							required
						/>
						<Text
							onPress={() => {
								props.navigation.navigate('Auth', {screen : 'ForgotPassword', })
							}}
							style={[
								FONTSTYLES.p,
								{
									color: COLORS.primary,
									fontFamily: FONTS.bold,
									textAlign: "right",
								},
							]}>
							Lupa Password?
						</Text>
						{isLoading ? (
							<ActivityIndicator
								size={"large"}
								style={{ marginTop: SIZES.large }}
								color={COLORS.primary}
							/>
						) : (
							<Button title="Masuk" onPress={() => handleLogin()} style={{ marginTop: SIZES.large }} />
						)}
						<View
							style={{
								marginTop: 44,
								marginBottom: SIZES.xLarge,
								flexDirection: "row",
								justifyContent: "center",
								gap: SIZES.small,
							}}>
							<Text style={FONTSTYLES.p}>Belum ada akun?</Text>
							<TouchableOpacity
								onPress={() => {
									props.navigation.replace('Auth', {screen : 'Register', })
								}}>
								<Text style={[FONTSTYLES.p, { color: COLORS.primary, fontFamily: FONTS.bold }]}>
									Lakukan Registrasi
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: SIZES.xLarge,
		paddingVertical: SIZES.xSmall,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#fff",
	},
	space_1: {
		marginTop: 44,
		...FONTSTYLES.inputLabel,
	},
	test: {
		marginTop: 20,
	},
	textInput: {
		borderColor: COLORS.gray,
	},
});
