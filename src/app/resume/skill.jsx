import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableNativeFeedback,
	ToastAndroid,
	ActivityIndicator,
	KeyboardAvoidingView,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/common/header/header";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";
import { Button, TextField, HeaderResume, } from "../../components";
// import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetch from "../../hook/useFetch";
import ModalPreloader from "../../components/common/PleaseWaitModal";
import Base from "../../utils/base";
import { element } from "prop-types";

export default function ResumeSkill(props) {
	var base = new Base()
	const [addSkill, setAddSkill] = useState(false);
	const [postResumeQuery, setPostResumeQuery] = useState({});

	const getSkill = useFetch("GET", "skill", {}, false);
	const getResume = useFetch("GET", "resume", {}, false);
	const postResume = useFetch("POST", "resume/edit", postResumeQuery, false);

	const [title, setTitle] = useState("");
	const [isModal, setIsModal] = useState(false);
	const [fromSystem, setFromSystem] = useState(false);
	const [arr, setArr] = useState([]);
	const [resumeData, setResumeData] = useState({});

	useEffect(() => {
		getSkill.fetchData()

		if (props.route.params.reviewResume)
			handleEdit()
		else if(props.route.params.resumeData == null){
			AsyncStorage.setItem('lastResumePage', 'Skill')
			handleEdit()
		}
		

		if(props.route.params.resumeData != null)
			setResumeData(props.route.params.resumeData)
	}, []);

	useEffect(() => {
		// if(props.route.params.editResume && resumeData.id == null)
		// 	getResume.fetchData();
		// else{
			setIsModal(false)
			if(fromSystem){
				setFromSystem(false)
				return
			}

			
			var arr_temp = JSON.parse(JSON.stringify(arr))
			for(let temp of arr_temp){
				if(resumeData.skill != null){
					for(let skill of resumeData.skill){
						if(temp.id == skill.skill.id){
							temp.checked = true
							break
						}
					}
				}
			}

			setFromSystem(true)
			setArr(arr_temp)
		// }
	}, [arr, resumeData, ])

	useEffect(() => {
		if (getSkill.data.status != null) {
			if(getSkill.data.status == "success"){
				var arr = []
				for(let skill of getSkill.data.data){
					skill.checked = false
					arr.push(skill)
				}
				setArr(arr)
			}
			else
				base.alertSnackbar(getSkill.data.message)
		}
	}, [getSkill.data]);

	const Item = (props) => {
		return (
			<View style={{ borderRadius: 8, overflow: "hidden" }}>
				<TouchableNativeFeedback onPress={() => onSkillCheckChanged(props.index)}>
					<View style={[ styles.itemContainer, { flexDirection: "row", alignItems: "stretch", gap: SIZES.xSmall }, ]}>
						<MaterialIcons
							name={props.data.checked ? "check-box" : "check-box-outline-blank"}
							size={20}
							color={COLORS.primary}/>
						<Text style={[FONTSTYLES.p, { flex: 1, color: COLORS.gray_22 }]}>{props.data.name}</Text>
					</View>
				</TouchableNativeFeedback>
			</View>
		)
	}

	const handleNext = async () => {
		var arr1 = [];
		for (let skill of arr) {
			if (skill.checked)
				arr1.push(skill);
		}

		if(arr1.length == 0)
			base.alertSnackbar('Skill is Empty')
		else{
			
			if (props.route.params.reviewResume){
				await AsyncStorage.setItem("arr_skill", JSON.stringify(arr1));
				props.route.params.onRefresh()
				props.navigation.goBack()
			}
			else if (props.route.params.editResume) {
				var arr_putResume = [];
				var obj = JSON.parse(JSON.stringify(resumeData))
				for(let data of arr1){
					var flag = false
					var temp = {}
					for(let skill of resumeData.skill){
						if(skill.skill.id == data.id){
							flag = true
							temp = skill
						}
					}
					arr_putResume.push(flag ? temp : {
						skill: data,
					})	
				}
				obj.arr_skill = arr_putResume

				postResume.setRefetch(obj)
			}
			else{
				await AsyncStorage.setItem("arr_skill", JSON.stringify(arr1));
				props.navigation.navigate('Resume', {screen : 'KTP', params: {}, })
			}
		}
	};

	const handleEdit = async () => {
		var arr_skill = await AsyncStorage.getItem("arr_skill")
		if(arr_skill != null){
			arr_skill = JSON.parse(arr_skill)
			for(let data of arr_skill){
				data.resume = null
				data.skill = {
					id: data.id,
				}
			}
			
			setResumeData({
				skill: arr_skill,
			})
		}
	}

	function onSkillCheckChanged(index){
		var arr_temp = arr.map((x) => x)
		arr_temp[index].checked = !arr_temp[index].checked
		setFromSystem(true)
		setArr(arr_temp)
	}

	function onCustomSkillSaveClicked(){
		var arr_temp = JSON.parse(JSON.stringify(arr))
		var counter = 0
		for(let temp of arr_temp){
			if(temp.name.match(new RegExp(title, 'g'))){
				temp.checked = true
				break
			}
			counter++
		}

		if(counter == arr_temp.length)
			arr_temp.push({
				name: title,
				checked: true,
			})
		setArr(arr_temp)
		setTitle('')
		setAddSkill(false)
	}

	// useEffect(() => {
	// 	setIsModal(false)
	// 	if(getResume.data.status != null){
	// 		if(getResume.data.status == "success"){
	// 			setResumeData(getResume.data.data)
	// 		}
	// 		else
	// 			base.alertSnackbar(getResume.data.message)
	// 	}
	// }, [getResume.data]);

	useEffect(() => {
		if(postResume.data.status != null){
			if(postResume.data.status == "success"){
				props.navigation.goBack()
				props.route.params.onRefresh()
			}
			else
				base.alertSnackbar(postResume.data.message)
		}
	}, [postResume.data]);

	return (
		<View style={{ flex: 1, }}>
			{/* <Stack.Screen
				options={{
					header: () => null,
				}}
			/> */}
			<View style={{ backgroundColor: "white" }}>
				<Header backButton title={"Pengisian Resume"} navigation={props.navigation}/>
			</View>
			<HeaderResume numText='4' title="Skill"/>

			<View style={{ flex: 1, }}>
				{
					getSkill.isLoading ?
						<View style={{ flex: 1, alignItems: "center", backgroundColor: COLORS.white }}>
							<ActivityIndicator size={"large"} color={COLORS.primary} />
						</View>
					:
						<FlatList
							data={arr}
							ItemSeparatorComponent={<View style={{ height: 16 }} />}
							renderItem={({ item, index }) => <Item data={item} index={index} />}
							keyExtractor={(item, index) => String(index)}
							ListFooterComponent={
								!addSkill &&
								<View style={styles.footerItemContainer}>
									<TouchableNativeFeedback onPress={() => setAddSkill(true)}>
										<View style={styles.footerItemContainerInside}>
											<MaterialCommunityIcons name={"plus-circle"} size={28} color={COLORS.primary} />
											<Text style={styles.footerItemText}>Tambahkan skill</Text>
										</View>
									</TouchableNativeFeedback>
								</View>
							}
							style={{ backgroundColor: "white", paddingHorizontal: SIZES.xLarge }}
						/>
				}
			</View>

			<View style={{ padding: 16, backgroundColor: COLORS.white }}>
				{/* <Button title={reviewResume ? 'Simpan' : 'Lanjut'} style={{ height: 30 }} onPress={() => reviewResume ? router.back() : router.push('/resume/ktp')} /> */}
				{
					addSkill ?
					<View style={{  }}>
						<TextField
							containerStyle={{ marginBottom: SIZES.medium + 4, }}
							label={"Tambahkan skill"}
							onChangeText={(text) => setTitle(text)} />

						<View style={{ flexDirection: "row",  }}>
							<Button
								outline
								title={"batalkan"}
								style={{ flex: 1, height: 30, marginRight: SIZES.small / 2, }}
								onPress={() => setAddSkill(false)}
							/>
							<Button
								title={"simpan"}
								style={{ flex: 1, height: 30, marginLeft: SIZES.small / 2, }}
								onPress={() => onCustomSkillSaveClicked()}
							/>
						</View>
					</View>
					:
					<Button
						title={(props.route.params.reviewResume, props.route.params.editResume) ? "Simpan" : "Lanjut"}
						style={{ height: 30 }}
						onPress={() => handleNext()}
					/>
				}
			</View>

			<ModalPreloader isModal={isModal}/>
		</View>
	);
}

const styles = StyleSheet.create({
	numBox: {
		...FONTSTYLES.sBold16_secondary,
		width: 35,
		height: 35,
		textAlign: "center",
		textAlignVertical: "center",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.gray,
	},
	itemContainer: {
		padding: SIZES.medium,
		borderRadius: SIZES.medium / 2,
		backgroundColor: COLORS.lightWhite2,
		gap: SIZES.xSmall / 2,
	},
	footerItemContainer: {
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.primary,
		borderStyle: "dashed",
		overflow: "hidden",
		marginTop: SIZES.xLarge,
	},
	footerItemContainerInside: {
		padding: SIZES.medium,
		flexDirection: "row",
		gap: SIZES.small,
		alignItems: "center",
	},
	footerItemText: {
		...FONTSTYLES.p_12,
		color: COLORS.primary,
	},
});
