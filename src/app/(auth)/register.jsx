import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Image,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import messaging from "@react-native-firebase/messaging";

// import { Stack, useRouter } from "expo-router";
import Header from "../../components/common/header/header";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
import styles from "../../styles/auth/register.style";
import { RadioButton, TextField, Alert, Button, Modals } from "../../components/common/";
import * as Utils from "../../utils";
import useFetch from "../../hook/useFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import svg_confirmed from "../../assets/svg/confirmed.svg";

export default function RegisterScreen(props) {
	// const router = useRouter();

	const genderList = [{ value: "Pria" }, { value: "Wanita" }];
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("+62");
	const [gender, setGender] = useState(-1);
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");
	const [fcmToken, setFcmToken] = useState('');
	const [fetchErrorMessage, setFetchErrorMessage] = useState("");
	const [showFetchErrorMessage, setShowFetchErrorMessage] = useState(false);

	const [isNameError, setIsNameError] = useState(false);
	const [isPhoneError, setIsPhoneError] = useState(false);
	const [isGenderError, setIsGenderError] = useState(false);
	const [isEmailError, setIsEmailError] = useState(false);
	const [isPassError, setIsPassError] = useState(false);

	const [isNameErrorMessage, setIsNameErrorMessage] = useState(false);
	const [isPhoneErrorMessage, setIsPhoneErrorMessage] = useState(false);
	const [isGenderErrorMessage, setIsGenderErrorMessage] = useState(false);
	const [isEmailErrorMessage, setIsEmailErrorMessage] = useState(false);
	const [isPassErrorMessage, setIsPassErrorMessage] = useState(false);

	const [modalVisible, setModalVisible] = useState(false);

	const nameRef = useRef();
	const phoneRef = useRef();
	const genderRef = useRef();
	const emailRef = useRef();
	const passRef = useRef();

	const postRegister = useFetch(
		"POST",
		"auth/register",
		{
			name: name,
			phone: phone,
			gender: gender,
			email: email,
			password: pass,
			token: fcmToken,
		},
		false
	);

	useEffect(() => {
		initToken()
	}, [])

	async function initToken(){
		const token = await messaging().getToken();
		setFcmToken(token);
	}

	const handleOption = (v) => {
		setGender(v == "Pria" ? 1 : 0);
	};

	const checkName = () => {
		let nameCheck = Utils.Check_TextField_Name(name);
		setIsNameError(nameCheck != null)
		if(nameCheck != null)
			setIsNameErrorMessage(nameCheck)
		return nameCheck == null
	};

	const checkPhone = () => {
		let phoneCheck = Utils.Check_TextField_Phone(phone);
		setIsPhoneError(phoneCheck != null)
		if(phoneCheck != null)
			setIsPhoneErrorMessage(phoneCheck)
		return phoneCheck == null;
	};

	const checkGender = () => {
		setIsGenderError(gender == -1)
		if (gender == -1)
			setIsGenderErrorMessage("Gender can't be empty");
		return gender != -1
	};

	const checkEmail = () => {
		let emailCheck = Utils.Check_TextField_Email(email);
		setIsEmailError(emailCheck != null)
		if(emailCheck != null)
			setIsEmailErrorMessage(emailCheck)
		return emailCheck == null
	};

	const checkPass = () => {
		let passCheck = Utils.Check_TextField_Pass(pass);
		setIsPassError(passCheck != null)
		if(passCheck != null)
			setIsPassErrorMessage(passCheck)
		return passCheck == null
	};

	const setTempToken = async (tempToken) => {
		// console.log("tokk", token);
		return await AsyncStorage.setItem("tempToken", tempToken);
	};

	const handleRegister = () => {
		setShowFetchErrorMessage(false);
		if ((checkName(), checkPhone(), checkGender(), checkEmail(), checkPass())) {
			postRegister.refetch();
		} else {
			console.log("fail");
		}
	};

	onChangeText = (text) => {
		// Check if the text is equal to or starts with the default value
		if (text.length < 3) {
			setPhone("+62"); // Update the state with the new text
		} else {
			setPhone(text); // Update the state with the new text
		}
	};

	useEffect(() => {
		if (postRegister.data.status == "success") {
			setShowFetchErrorMessage(false);
			// setModalVisible(true);
			AsyncStorage.setItem('token', postRegister.data.token)
			// setToken(postRegister.data.token);
			props.navigation.replace('Auth', {screen : 'OTPScreen', params: {prev: 'register', }, })
			// router.push("/otp?prev=register");
		} else if (postRegister.data.status == "error") {
			if (postRegister.data.message == "User already exist") {
				setFetchErrorMessage("No. Handphone telah terdaftar");
			} else {
				setFetchErrorMessage(postRegister.data.message);
			}
			setShowFetchErrorMessage(true);
			// console.log('Fetch Error :', data.message)
		}
	}, [postRegister.data]);


	return (
		<ScrollView style={styles.scrollView}>
			{/* <Stack.Screen
				options={{
					header: () => <Header />,
				}}
			/> */}
			<Header />

			<View style={[styles.container, { marginTop: 0, }]}>
				<Text style={FONTSTYLES.h1}>Selamat Datang</Text>
				<Text style={FONTSTYLES.p}>Lakukan Pengisian Data anda</Text>
				{showFetchErrorMessage == true ? <Alert.Error text={fetchErrorMessage} /> : null}
				<TextField
					ref={nameRef}
					containerStyle={{ marginTop: 44 }}
					label={"Nama"}
					placeholder={"Nama Anda"}
					required
					error={isNameError}
					errorMessage={isNameErrorMessage}
					onChangeText={(value) => setName(value)}
					onBlur={() => checkName()}
					onSubmitEditing={() => checkName() || phoneRef.current.focus()}
				/>
				<TextField
					ref={phoneRef}
					label={"No. Handphone"}
					placeholder={"+62"}
					defaultValue={"+62"}
					keyboardType="phone-pad"
					required
					value={phone}
					error={isPhoneError}
					errorMessage={isPhoneErrorMessage}
					onChangeText={(value) => onChangeText(value)}
					onBlur={() => checkPhone()}
					onSubmitEditing={() => checkPhone() || emailRef.current.focus()}
				/>
				<RadioButton
					label={"Jenis Kelamin"}
					data={genderList}
					required
					error={isGenderError}
					errorMessage={isGenderErrorMessage}
					onChange={handleOption}
				/>
				<TextField
					ref={emailRef}
					label={"Email"}
					required
					placeholder={"email@email.com"}
					keyboardType="email-address"
					error={isEmailError}
					errorMessage={isEmailErrorMessage}
					onChangeText={(value) => setEmail(value)}
					onBlur={() => checkEmail()}
					onSubmitEditing={() => checkEmail() || passRef.current.focus()}
				/>
				<TextField
					ref={passRef}
					label={"Password"}
					placeholder={"********"}
					secureTextEntry
					required
					returnKeyType={"done"}
					error={isPassError}
					errorMessage={isPassErrorMessage}
					onBlur={() => checkPass()}
					onChangeText={(value) => setPass(value)}
					onSubmitEditing={() => checkPass()}
				/>
				{postRegister.isLoading ? (
					<ActivityIndicator
						size={"large"}
						style={{ marginTop: SIZES.large }}
						color={COLORS.primary}
					/>
				) : (
					<Button
						title="Registrasi"
						onPress={() => handleRegister()}
						style={{ marginTop: SIZES.large }}
						disable={gender == -1 || name == "" || pass == "" || phone == "+62" ? true : false}
					/>
				)}
				<View
					style={{
						marginTop: 68,
						marginBottom: SIZES.xLarge,
						flexDirection: "row",
						justifyContent: "center",
						gap: SIZES.small,
					}}>
					<Text style={FONTSTYLES.p}>Sudah ada akun?</Text>
					<TouchableOpacity
						onPress={() => {
							props.navigation.replace('Auth', {screen : 'Login', })
							// router.push("/login");
						}}>
						<Text style={[FONTSTYLES.p, { color: COLORS.primary, fontFamily: FONTS.bold }]}>
							Masuk
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			{/* <Modals
				svg={svg_confirmed}
				title={"Akun telah terdaftar !"}
				desc={"Silahkan login dengan akun anda."}
				buttonTitle={"Login"}
				visible={modalVisible}
				onPress={() => router.replace("/login")}
			/> */}
		</ScrollView>
	);
}
