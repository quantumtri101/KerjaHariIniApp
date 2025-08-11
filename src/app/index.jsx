import React, { useState, useEffect } from "react";

import { SplashScreen, Redirect, useRouter, Stack } from "expo-router";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import useFetch from "../hook/useFetch";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants";
// import notifee, { EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

export default function App() {
	const [isReady, setReady] = React.useState(false);

	// const [token, setToken] = useState(null)
	// const [redirect, setRedirect] = useState('')
	// const { getItem, setItem } = useAsyncStorage('token');

	const router = useRouter();

	init = async () => {
		// await AsyncStorage.removeItem('token')
		// var {token} = await getItem()
		// console.log('All Key', await AsyncStorage.getAllKeys())
		// console.log('tokenInit', t)
		// router.replace('/recruitScanQR')
		// router.replace('/home')
		// router.replace('/login')

		const token = await AsyncStorage.getItem("token");
		const isRequirementFinish = await AsyncStorage.getItem("isRequirementFinish");
		const lastRequirementPage = await AsyncStorage.getItem("lastRequirementPage");
		const notifRedirect = await AsyncStorage.getItem("notifRedirect");
		// await AsyncStorage.removeItem('notifRedirect')

		console.log("token", token);
		console.log("isRequirementFinish", isRequirementFinish);
		console.log("lastRequirementPage", lastRequirementPage);
		console.log("notifRedirect", notifRedirect);

		if (token == null) {
			router.replace("/login");
		} else {
			if (isRequirementFinish == null) {
				router.replace("/form-rekomendasi/start");
			} else if (isRequirementFinish == "false") {
				router.replace(lastRequirementPage);
			} else {
				// router.replace('/rekomendasi')
				if (notifRedirect != null) {
					// router.replace('/home')
					router.push("/" + notifRedirect);
					await AsyncStorage.removeItem("notifRedirect");
				} else {
					router.replace("/home");
				}
			}
		}
		// router.replace("resume/informasi_01");
		// console.log(notifRedirect);

		// token == null ? router.replace('/login') : router.replace('/home')
		// router.replace('/form-rekomendasi/start')
	};

	useEffect(() => {
		init();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "white",
			}}>
			<Stack.Screen
				options={{
					header: () => null,
				}}
			/>
			<ActivityIndicator size={"large"} color={COLORS.primary} />
		</View>
	);
}
