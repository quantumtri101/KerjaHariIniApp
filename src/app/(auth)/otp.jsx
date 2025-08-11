import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	ToastAndroid,
	ActivityIndicator,
	Alert,
	Image,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, FONTSTYLES, SIZES, FONTS } from "../../constants";
import { Button, Modals, RadioButton, Header, } from "../../components";
import svg_confirmed from "../../assets/svg/confirmed.svg";
import * as Utils from "../../utils";
import useFetch from "../../hook/useFetch";
import Base from "../../utils/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "@react-native-firebase/app";
// import auth from "@react-native-firebase/auth";
import moment from 'moment';
// import { FirebaseRecaptcha, FirebaseRecaptchaVerifier, FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
// import { firebaseConfig } from '../../firebaseConfig'
// import firebase from 'firebase/compat/app'

export default function OTPScreen(props) {
	var base = new Base()
	const getProfile = useFetch("GET", "auth/profile", {}, false);

	// ---- FIREBASE SECTION START ---- //
	const [phoneNumber, setPhoneNumber] = useState('');
	const [countdown, setCountdown] = useState(false);
	const [codeSent, setCodeSent] = useState(true);
	const [authStateLoading, setAuthStateLoading] = useState(false);
	const [prev, setPrev] = useState('');
	const [verificationId, setVerificationId] = useState(null);
	const recaptchaVerifier = useRef(null);

	// If null, no SMS has been sent
	const [confirm, setConfirm] = useState(null);

	// verification code (OTP - One-Time-Passcode)
	const [code, setCode] = useState("");

	// Handle login
	function onAuthStateChanged(user) {
		if (user) {
			try {
				setAuthStateLoading(true);
				// auth()
				// 	.signOut()
				// 	.then(() => confirmOtp.setRefetch({
				// 		phone: props.route.params.phone != null ? props.route.params.phone : phoneNumber,
				// 	}));
			} catch (error) {
				console.log("onAuthStateChanged Error", error);
			} finally {
				setAuthStateLoading(false);
			}
		}
	}

	const sendVerification = async () => {
		// try {
			setAuthStateLoading(true);
		// 	console.log(phoneNumber)
			// const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
			// setConfirm(confirmation);
			sendOTP.setRefetch()
			setCodeSent(true);
			
			setAuthStateLoading(false);
			setCountdown(true);
		// } catch (error) {
		// 	console.log("sendVerification Error", error);
		// } finally {
		// 	setAuthStateLoading(false);
		// 	setCountdown(true);
		// }
	};

	const confirmCode = async () => {
		var otpTemp = ''
		for(let otp of arrOtp)
			otpTemp += otp

		setAuthStateLoading(true);
		try {
			confirmOtp.setRefetch({
				phone: props.route.params.phone != null ? props.route.params.phone : phoneNumber,
				otp_code: otpTemp,
			})
		} catch (error) {
			setAuthStateLoading(false)
			if(error.code == 'auth/invalid-verification-code')
				base.alertSnackbar('Invalid Code')
			else
				console.log(error);
		}
	};
	// ---- FIREBASE SECTION END ---- //

	const [focus, setFocus] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const show = () => setModalVisible(true);
	const hide = () => setModalVisible(false);
	const confirmOtp = useFetch("POST", "auth/otp/confirm", {}, false);
	const sendOTP = useFetch("POST", "auth/otp/send", {}, false);

	// const router = useRouter();
	// const { prev, tmp_pass } = useLocalSearchParams();

	const OTP = [];
	const ti = [];

	const [arrOtp, setArrOtp] = useState(["", "", "", "", "", ""]);
	const [otpType, setOtpType] = useState("typed");
	const [isFilled, setIsFilled] = useState(false);
	const [ti_0, setTi_0] = useState("");
	const [ti_1, setTi_1] = useState("");
	const [ti_2, setTi_2] = useState("");
	const [ti_3, setTi_3] = useState("");
	const [ti_4, setTi_4] = useState("");
	const [ti_5, setTi_5] = useState("");

	const otpValue = ti_0 + ti_1 + ti_2 + ti_3 + ti_4 + ti_5;

	ti[0] = useRef();
	ti[1] = useRef();
	ti[2] = useRef();
	ti[3] = useRef();
	ti[4] = useRef();
	ti[5] = useRef();

	useEffect(() => {
		// getToken()
		if(props.route.params != null && props.route.params.phone != null)
			setPhoneNumber(props.route.params.phone)
		else
			getProfile.fetchData()

		if(props.route.params != null)
			setPrev(props.route.params.prev)
		AsyncStorage.setItem('lastAuthPage', 'OTPScreen')

		sendVerification()

		return () => {
			AsyncStorage.removeItem('lastAuthPage')
		}

		// const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		// return subscriber;
	}, []);

	// useEffect(() => {
	// 	if(phoneNumber != '')
	// 		sendVerification()
	// }, [phoneNumber, ])

	useEffect(() => {
		if(getProfile.data.status != null){
			if (getProfile.data.status == "success") {
				setPhoneNumber(getProfile.data.data?.phone);
			}
			else
				base.alertSnackbar(getProfile.data.message);
		}
	}, [getProfile.data]);

	useEffect(() => {
		onConfirmAction()
	}, [confirmOtp.data]);

	useEffect(() => {
		var index = -1
		var flag = true
		for(let x in arrOtp){
			if(arrOtp[x] == ''){
				index = x
				flag = false
				break
			}
		}
		setIsFilled(flag)

		if(index >= 0)
			ti[otpType == 'typed' ? index : (index > 0 ? index - 1 : 0)].current.focus()
		else
			ti[arrOtp.length - 1].current.blur()
	}, [arrOtp, otpType, ])

	async function onConfirmAction(){
		if(confirmOtp.data.status != null){
			setAuthStateLoading(false)
			if (confirmOtp.data.status == "success") {
				// await auth().signOut()

				var tempToken = await AsyncStorage.getItem('tempToken')
				if(tempToken != null){
					AsyncStorage.removeItem('tempToken')
					AsyncStorage.setItem('token', tempToken)
				}

				if (props.route.params.prev == "register")
					show();
				else if (props.route.params.prev == "login"){
					var arrNextPage = await AsyncStorage.getItem("arrNextPage")
					arrNextPage = arrNextPage != null ? JSON.parse(arrNextPage) : []
					var nextPage = {}
					var flag = false
					for(let page of arrNextPage){
						flag = true
						if(page.id >= 0){
							nextPage = page
							break
						}
					}
					if(!flag)
						AsyncStorage.removeItem("arrNextPage")

					props.navigation.replace(nextPage.id != null ? nextPage.route : 'Home', {screen : nextPage.id != null ? nextPage.screen : 'HomeTab', })
				}
				else if (props.route.params.prev == "forgotPass")
					props.navigation.replace('Auth', {screen : 'ChangePassword', params: {phone: props.route.params.phone, }, })
			}
			else
				base.alertSnackbar(confirmOtp.data.message);
		}
	}

	const focusNext = (text, index) => {
		var arr = JSON.parse(JSON.stringify(arrOtp))
		arr[index] = text
		setOtpType(text != '' ? 'typed' : 'backspace')
		setArrOtp(arr)
	};

	const focusPrev = (key, index) => {
		if (key === "Backspace"){
			var arr = JSON.parse(JSON.stringify(arrOtp))
			arr[index] = ''
			setOtpType('backspace')
			setArrOtp(arr)
		}
	};

	const modal_title = "Anda Terverifikasi!";
	const modal_desc = "Selamat, Nomor Handphone anda telah terverifikasi";
	const modal_btnTitle = "Lanjut";
	const modalButton = () => {
		setModalVisible(false);
		props.navigation.replace('FormRekomendasi', {screen : 'Start', params: {}, })
		// router.push("/form-rekomendasi/start");
	};

	const CountdownTimer = (props) => {
		const [time, setTime] = useState(180); // 3 menit dalam detik
		const [timeMoment, setTimeMoment] = useState(moment.duration());

		useEffect(() => {
			setTimeMoment(moment.duration(time, 's'))
			setTime(time - 1)
		}, [])

		useEffect(() => {
			props.updateTime(time)
			setTimeout(() => {
				if(time < 0)
					return
				setTimeMoment(moment.duration(time, 's'))
				setTime(time - 1)
			}, 1000)
		}, [time])

		return (
			<View>
				<Text style={styles.timer}>
					{(timeMoment.minutes() < 10 ? '0' + timeMoment.minutes() : timeMoment.minutes()) + ':' + (timeMoment.seconds() < 10 ? '0' + timeMoment.seconds() : timeMoment.seconds())}
				</Text>
			</View>
		);
	};

	const getToken = async () => {
		let a = await AsyncStorage.getItem("token");
		// return a
	};

	const getLastRequirementPage = async () => {
		const lastRequirementPage = await AsyncStorage.getItem("lastRequirementPage");
		// console.log(a);
		return lastRequirementPage;
	};

	const handleVerified = async () => {
		if (
			Object.is(ti_0, "") ||
			Object.is(ti_1, "") ||
			Object.is(ti_2, "") ||
			Object.is(ti_3, "") ||
			Object.is(ti_4, "") ||
			Object.is(ti_5, "")
		) {
			ToastAndroid.show("Can't be null", ToastAndroid.SHORT);
		} else {
			confirmOtp.refetch();
		}
	};
	function onUpdateTime(time){
		// console.log(time)
		setCountdown(time != -1)
	}

	return (
		<ScrollView>
			<Header />

			<View style={{
				paddingHorizontal: SIZES.xLarge,
				paddingVertical: SIZES.xSmall,
				backgroundColor: COLORS.white,
				flex: 1,
			}}>
				<View style={{ flex: 1 }}>
					{/* <CountdownTimer /> */}
					<Text style={FONTSTYLES.h1}>Verifikasi Kode</Text>
					{/* <CountdownTimer /> */}
					<Text style={FONTSTYLES.p}>
						Silahkan masukan kode OTP yang sudah dikirimkan ke email anda.
					</Text>
					{
						(codeSent && !authStateLoading) &&
						<View style={styles.otp_container}>
							{
								arrOtp.map((otp, index) =>
									<TextInput
										key={index}
										cursorColor={COLORS.primary}
										keyboardType="number-pad"
										maxLength={1}
										mode="flat"
										value={otp}
										onChangeText={(text) => focusNext(text, index)}
										onFocus={() => setFocus(ti[index])}
										onBlur={() => setFocus("")}
										onKeyPress={(e) => focusPrev(e.nativeEvent.key, index)}
										ref={ti[index]}
										returnKeyType="next"
										selectionColor={COLORS.primary}
										editable={codeSent}
										style={[styles.otp, focus == ti[index] && styles._focus, {color: COLORS.black_12, }]}/>
								)
							}
						</View>
					}
					{
						authStateLoading ?
							<ActivityIndicator
								size={"large"}
								style={{ marginTop: SIZES.large }}
								color={COLORS.primary}/>
						: codeSent &&
							<View>
								<Button
									title="Verifikasi"
									onPress={confirmCode}
									style={{ marginTop: 40 }}
									disable={!isFilled}/>

								<View>
									<Text style={styles.text01}>Tidak menerima kode?</Text>
									{
										countdown ?
											<CountdownTimer updateTime={(time) => onUpdateTime(time)}/>
										:
											<Button
												title="Kirim Kode OTP"
												onPress={sendVerification}
												style={{ marginTop: SIZES.medium }}/>
									}
								</View>
							</View>
					}
				</View>
			</View>
			<Modals
				svg={svg_confirmed}
				title={modal_title}
				desc={modal_desc}
				buttonTitle={modal_btnTitle}
				visible={modalVisible}
				onPress={modalButton}
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	otp_container: {
		marginTop: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		gap: SIZES.xSmall,
	},
	otp: {
		flex: 1,
		padding: SIZES.small / 2,
		borderColor: COLORS.gray,
		borderWidth: 1,
		borderRadius: SIZES.medium / 2,
		minHeight: 62,
		textAlign: "center",
		fontSize: SIZES.large,
		fontFamily: FONTS.bold,
	},
	_focus: {
		borderColor: COLORS.primary,
	},
	text01: {
		...FONTSTYLES.p_black_12,
		textAlign: "center",
		marginTop: SIZES.medium * 2,
	},
	timer: {
		fontFamily: FONTS.semibold,
		lineHeight: SIZES.xLarge,
		color: COLORS.black_12,
		textAlign: "center",
		marginTop: SIZES.xSmall,
	},
});
