import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableNativeFeedback,
	ToastAndroid,
	BackHandler,
	Alert,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useReducer, useState } from "react";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/common/header/header";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
import { Button, TextField, HeaderResume, } from "../../components";
// import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import useFetch from "../../hook/useFetch";
import Base from "../../utils/base";
import PengalamanKerjaAction from "./pengalamanKerjaAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	AutocompleteDropdown,
	AutocompleteDropdownContextProvider,
} from "react-native-autocomplete-dropdown";

export default function PengalamanKerja(props) {
	var base = new Base()
	const getResume = useFetch("GET", "resume", {}, false);

	//===ItemListStart===//
	const ItemList = ({ item, index }) => {
		// const a = getCity.data.data?.filter(i => i.id == ((editResume, !flag_afterInitRecord) ? item?.city_id : (editResume, flag_afterInitRecord) && item.city?.id))
		const getCityList = useFetch("GET", "city?id=" + item.city.id, {});

		return (
			<View style={{ borderRadius: 8, overflow: "hidden" }} key={index}>
				<TouchableNativeFeedback onPress={() => onEditClicked(index)}>
					<View style={styles.itemContainer}>
						<Text style={FONTSTYLES.sBold14_secondary}>
							{"#"}
							{index + 1} {item.name}
						</Text>
						<View
							style={{
								flexDirection: "row",
								alignItems: "stretch",
								gap: SIZES.xSmall,
							}}>
							<View style={{ flex: 1, flexDirection: 'row', }}>
								<MaterialCommunityIcons name="calendar-month" size={16} color={COLORS.gray} />
								<Text style={[FONTSTYLES.p_12, { marginLeft: 8, }]}>
									{item.start_year}-{item.end_year}
								</Text>
							</View>
							<View style={{ flex: 1, flexDirection: 'row', }}>
								<MaterialCommunityIcons name="map-marker" size={16} color={COLORS.gray} />
								<Text style={[FONTSTYLES.p_12, { marginLeft: 8, }]}>{getCityList.data.data?.name}</Text>
							</View>
						</View>
						<Text style={[FONTSTYLES.p_12]}>{item.corporation}</Text>
					</View>
				</TouchableNativeFeedback>
			</View>
		);
	};
	//===ItemListEnd===//

	// const router = useRouter();
	// const { reviewResume, editResume } = useLocalSearchParams();

	const [view, setView] = useState("list");
	const [selectedData, setSelectedData] = useState({})
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [record, setRecord] = useState([]);
	const [resumeData, setResumeData] = useState([]);

	const postResume = useFetch(
		"POST",
		"resume/edit",
		{},
		false
	);

	const handleNext = async () => {
		if (props.route.params.reviewResume){
			await AsyncStorage.setItem("arr_experience", JSON.stringify(record));
			props.route.params.onRefresh()
			props.navigation.goBack()
		}
		else if (props.route.params.editResume)
			postResume.setRefetch({
				id: resumeData.id,
				arr_experience: record,
			});
		else{
			await AsyncStorage.setItem("arr_experience", JSON.stringify(record));
			props.navigation.navigate('Resume', {screen : 'Skill', params: {}, })
		}
	};

	const handleHeaderBackButton = () => {
		view == "form" ? setView('list') : props.navigation.goBack();
	};

	useEffect(() => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			handleHeaderBackButton()
			return true;
		});

		return () => backHandler;
	}, [view]);

	useEffect(() => {
		if(props.route.params.reviewResume){
			handleEdit()
		}
		else if(props.route.params.resumeData == null){
			AsyncStorage.setItem('lastResumePage', 'PengalamanKerja')
		}
		
		if(props.route.params.resumeData != null)
			setResumeData(props.route.params.resumeData)
	}, []);

	useEffect(() => {
		if(resumeData.experience != null){
			let arrExp = []
			resumeData.experience.forEach((e) => {
				arrExp.push({
					id: e.id,
					city: e.city,
					name: e.name,
					start_year: e.start_year,
					end_year: e.end_year,
					corporation: e.corporation,
					description: e.description,
				});
			});
			setRecord(arrExp)
		}
	}, [resumeData, ]);

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

	const handleEdit = async () => {
		var arr_experience = await AsyncStorage.getItem("arr_experience")
		if(arr_experience != null)
			setRecord(JSON.parse(arr_experience))
	}

	function onAddExperience(){
		setSelectedData({})
		setSelectedIndex(-1)
		setView('form')
	}

	function onEditClicked(index){
		setSelectedData(record[index])
		setSelectedIndex(index)
		setView('form')
	}

	function onAction(data){
		var arr = JSON.parse(JSON.stringify(record))
		if(selectedIndex < 0)
			arr.push(data)
		else{
			for(let x in data)
				arr[selectedIndex][x] = data[x]
		}
		setRecord(arr)
		setView('list')
	}

	function onRemoveRecord(){
		var arr = JSON.parse(JSON.stringify(record))
		arr.splice(selectedIndex, 1)
		setRecord(arr)
		setView('list')
	}

	return (
		<AutocompleteDropdownContextProvider>
			{/* <Stack.Screen
				options={{
					header: () => null,
				}}
			/> */}
			<View style={{ backgroundColor: "white" }}>
				<Header
					backButton
					title={"Pengisian Resume"}
					onBackPress={() => handleHeaderBackButton()}
					navigation={props.navigation}/>
			</View>

			<HeaderResume numText='3' title="Pengalaman Kerja"/>

			{
				view == 'list' ?
				<View style={{ flex: 1, }}>
					{
						(getResume.isLoading) ?
							<View
								style={{
									flex: 1,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "white",
								}}>
								<ActivityIndicator size={"large"} color={COLORS.primary} />
							</View>
						:
							<FlatList
								data={record}
								ItemSeparatorComponent={<View style={{ height: 16 }} />}
								renderItem={({ item, index }) => <ItemList item={item} index={index} />}
								keyExtractor={(item, index) => String(index)}
								ListFooterComponent={
									<View
										style={[
											styles.footerItemContainer,
											{ marginTop: record.length == 0 ? null : SIZES.xLarge },
										]}>
										<TouchableNativeFeedback onPress={() => onAddExperience()}>
											<View style={styles.footerItemContainerInside}>
												<MaterialCommunityIcons name={"plus-circle"} size={28} color={COLORS.primary}/>
												<Text style={styles.footerItemText}>Tambah Pengalaman Kerja</Text>
											</View>
										</TouchableNativeFeedback>
									</View>
								}
								style={{
									flex: 1,
									backgroundColor: "white",
									paddingTop: 8,
									paddingHorizontal: SIZES.xLarge,
								}}
							/>
					}
					<View style={{ padding: 16, backgroundColor: COLORS.white }}>
						{
							postResume.isLoading ?
								<ActivityIndicator size={"large"} color={COLORS.primary} />
							:
								<Button
									title={(props.route.params.reviewResume, props.route.params.editResume) ? "Simpan" : "Lanjut"}
									style={{ height: 30 }}
									onPress={() => (view == "form" ? setView("list") : handleNext())}
								/>
						}
					</View>
				</View>
				: view == 'form' &&
				<PengalamanKerjaAction data={selectedData}
					index={selectedIndex}
					arr={record}
					onCancelClicked={() => setView('list')}
					onRemoveRecord={() => onRemoveRecord()}
					onAction={(data) => onAction(data)}/>
			}

		</AutocompleteDropdownContextProvider>
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
