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
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	AutocompleteDropdown,
	AutocompleteDropdownContextProvider,
} from "react-native-autocomplete-dropdown";

export default function PengalamanKerjaAction(props) {
	const getCity = useFetch("GET", "city/all", {});
	const getResume = useFetch("GET", "resume", {}, false);

	const pengalaman = [];
	// const pengalamanLength = pengalaman.length + 1
	const year = [];
	for (let i = 1970; i <= moment().get("year"); i++) {
		year.push({ name: i.toString(), id: i });
	}
	const [arrEndYear, setArrEndYear] = useState([]);

	const [edit, setEdit] = useState(false);

	const [name, setName] = useState();
	const [start_year, setStart_year] = useState();
	const [end_year, setEnd_year] = useState();
	const [corporation, setCorporation] = useState();
	const [city, setCity] = useState();
	const [description, setDescription] = useState();
	const [selectedRecord, setSelectedRecord] = useState();

	const [nameError, setNameError] = useState(false);
	const [start_yearError, setStart_yearError] = useState(false);
	const [end_yearError, setEnd_yearError] = useState(false);
	const [corporationError, setCorporationError] = useState(false);
	const [cityError, setCityError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [recordError, setRecordError] = useState(false);
	const [flag_afterInitRecord, setflag_afterInitRecord] = useState(false);

	const [record, setRecord] = useState([]);

	const [cityLabel, setCityLabel] = useState();

	const [autoCompleteSuggestList, setAutoCompleteSuggestList] = useState([]);
	const [autoCompleteSelectedItem, setAutoCompleteSelectedItem] = useState({});

	const handleDelete = () => {
		Alert.alert(
			"Hapus Pengalaman Kerja",
			"Apakah anda yakin ingin menghapus pengalaman kerja ini?",
			[
				{
					text: "Cancel",
					onPress: () => null,
					style: "cancel",
				},
				{ text: "YES", onPress: () => props.onRemoveRecord() },
			]
		);
	};

	const resetState = () => {
		setName("");
		setStart_year(0);
		setEnd_year(0);
		setCorporation("");
		setCity("");
		setDescription("");
	};

	const handleError = (state, setErrorState) => {
		var flag = state == null || state == ""
		setErrorState(flag)
		return flag
	};

	const handleRecord = async () => {
		if ((
			!handleError(name, setNameError),
			!handleError(start_year, setStart_yearError),
			!handleError(end_year, setEnd_yearError),
			!handleError(corporation, setCorporationError)
		)) {
			props.onAction({
				city: {
					id: autoCompleteSelectedItem.id,
					label: autoCompleteSelectedItem.title,
				},
				name: name,
				start_year: start_year,
				end_year: end_year,
				corporation: corporation,
				description: description,
			})
			resetState();
		}
	};

	useEffect(() => {
		if(props.data.id != null){
			setName(props.data.name)
			setStart_year(props.data.start_year)
			setEnd_year(props.data.end_year)
			setCorporation(props.data.corporation)
			setDescription(props.data.description)

			if(props.data.city != null){
				var city = {
					id: props.data.city.id,
					title: props.data.city.name,
				}

				setCity(city.id)
				setAutoCompleteSelectedItem(city)
			}
		}
		setEdit(props.data.id != null)
	}, [props.data]);

	// useEffect(() => {
	// 	console.log(autoCompleteSuggestList)
	// }, [autoCompleteSuggestList, ])

	useEffect(() => {
		var arr = [];
		for (let x = start_year; x <= moment().get("year"); x++)
			arr.push({ name: x.toString(), id: x });
		setArrEndYear(arr);
	}, [start_year]);

	useEffect(() => {
		if(getCity.data.status != null){
			if(getCity.data.status == 'success'){
				const citySuggest = getCity.data.data?.map((item) => ({
					id: item.id,
					title: item.name,
				}));
				setAutoCompleteSuggestList(citySuggest);
			}
			else
				base.alertSnackbar(getCity.data.message)
		}

	}, [getCity.data]);

	function onCitySelected(item){
		console.log(item)
		if(item != null){
			setAutoCompleteSelectedItem(item)
			setCity(item.id)
		}
	}

	return (
		<View style={{ flex: 1, }}>
			{
				getCity.isLoading ?
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
					<ScrollView style={{ backgroundColor: "white", paddingHorizontal: SIZES.xLarge }}>
						<TextField
							required
							containerStyle={{ marginTop: 8 }}
							label={"Pengalaman Kerja #" + (props.index < 0 ? props.arr.length + 1 : props.index + 1)}
							placeholder={"(Posisi) di (Perusahaan)"}
							onChangeText={(v) => setName(v) || setNameError(v == "" ? true : false)}
							error={nameError}
							errorMessage={"Silahkan lengkapi judul pengalaman"}
							value={name}
						/>

						<View style={{ flexDirection: "row", gap: SIZES.medium }}>
							<TextField
								required
								picker
								pickerData={year}
								containerStyle={{ flex: 1 }}
								keyboardType={"numeric"}
								label={"Tahun Mulai"}
								placeholder={"Pilih tahun"}
								value={(v) => setStart_year(v) || setStart_yearError(v == "" ? true : false)}
								error={start_yearError}
								errorMessage={"Silahkan pilih Tahun Mulai"}
								preSelected={start_year}
								preSelectedLabel={start_year}
							/>
							<Text style={{ marginTop: 40, marginHorizontal: SIZES.medium, }}>/</Text>
							<TextField
								required
								picker
								pickerData={arrEndYear}
								containerStyle={{ flex: 1 }}
								keyboardType={"numeric"}
								label={"Tahun Berakhir"}
								placeholder={"Pilih tahun"}
								value={(v) => setEnd_year(v) || setEnd_yearError(v == "" ? true : false)}
								error={end_yearError}
								errorMessage={"Silahkan pilih Tahun Mulai"}
								preSelected={end_year}
								preSelectedLabel={end_year}
							/>
						</View>

						<TextField
							required
							label={"Perusahaan"}
							placeholder={"Nama Perusahaan"}
							onChangeText={(v) => setCorporation(v) || setCorporationError(v == "" ? true : false)}
							error={corporationError}
							errorMessage={"Silahkan lengkapi nama perusahaan"}
							value={corporation}
						/>

						<View style={{ paddingBottom: SIZES.small }}>
							<Text style={[FONTSTYLES.inputLabel, { marginBottom: SIZES.xSmall / 2 }]}>
								Lokasi Bekerja
								<Text style={FONTSTYLES.asterisk}>*</Text>
							</Text>
							<AutocompleteDropdown
								initialValue={autoCompleteSelectedItem}
								dataSet={autoCompleteSuggestList}
								onSelectItem={item => onCitySelected(item)}
								inputContainerStyle={{
									paddingVertical: SIZES.medium / 3,
									backgroundColor: "white",
									borderWidth: 1,
									borderRadius: SIZES.medium / 2,
									borderColor: COLORS.gray,
								}}
								textInputProps={{
									placeholder: "Pilih Kota / Kabupaten",
									placeholderTextColor: "#9e9e9e",
									style: {
										color: COLORS.gray_22,
										fontSize: 14,
										paddingStart: SIZES.medium,
									},
								}}
								emptyResultText="Kota / Kabupaten Tidak Ditemukan"
							/>
						</View>

						<TextField
							label={"Deskripsi Pekerjaan"}
							placeholder={"Deskripsi"}
							multiline
							numberOfLines={4}
							onChangeText={(v) => setDescription(v)}
							value={description}
						/>
					</ScrollView>
			}

			<View style={{ padding: 16, backgroundColor: COLORS.white }}>
				{
					<View>
						{
							props.data.id == null &&
							<Button
								title={"Batalkan"}
								outline
								style={{ height: 30, marginBottom: SIZES.medium }}
								onPress={() => props.onCancelClicked()}/>
						}
						<Button
							title={"Simpan"}
							style={{ height: 30, marginBottom: edit ? SIZES.medium : null }}
							onPress={() => handleRecord()}/>
						{
							props.data.id != null &&
							<Button
								title={"Hapus"}
								outline
								style={{ height: 30 }}
								onPress={() => handleDelete()}/>
						}
					</View>
				}
			</View>
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
