import React, { useState, useEffect } from "react";

import { SplashScreen, Redirect, useRouter, Stack } from "expo-router";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants";

export default function App() {
	const router = useRouter();

	init = async () => {
		const token = await AsyncStorage.getItem("token");
		const isRequirementFinish = await AsyncStorage.getItem("isRequirementFinish");
		const lastRequirementPage = await AsyncStorage.getItem("lastRequirementPage");
		const notifRedirect = await AsyncStorage.getItem("notifRedirect");

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
				if (notifRedirect != null) {
					router.push("/" + notifRedirect);
					await AsyncStorage.removeItem("notifRedirect");
				} else {
					router.replace("/home");
				}
			}
		}
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
