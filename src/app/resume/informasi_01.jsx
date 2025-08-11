import {
	ActivityIndicator,
	Keyboard,
	ScrollView,
	StyleSheet,
	Text,
	ToastAndroid,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/common/header/header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";
import { Button, TextField, HeaderResume } from "../../components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { isEighteenOrOlder } from "../../utils";
import useFetch from "../../hook/useFetch";
import Base from "../../utils/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import {
	AutocompleteDropdown,
	AutocompleteDropdownContextProvider,
} from "react-native-autocomplete-dropdown";

export default function Informasi01(props) {
	var base = new Base()
	// const router = useRouter();
	// const { reviewResume, editResume } = useLocalSearchParams();
	const getData = useFetch("GET", "auth/profile", {}, false);
	const getCity = useFetch("GET", "city/all", {});
	const getResume = useFetch("GET", "resume", {}, false);

	let data = {};
	const [nama, setNama] = useState();
	const [noHP, setNoHP] = useState();
	const [ttl, setTtl] = useState();
	const [alamat, setAlamat] = useState("");
	const [kota, setKota] = useState("");
	const [preSelectedLabelCity, setpreSelectedLabelCity] = useState();
	const [resumeData, setResumeData] = useState({});
	const refTTL = useRef();
	const refAlamat = useRef();
	const refKota = useRef();

	const maxDate = moment().subtract(18, "years");

	const [alamatError, setAlamatError] = useState();
	const [kotaError, setKotaError] = useState();

	const [date, setDate] = useState(moment().subtract(18, "years"));
	const [datePicker, setDatePicker] = useState(false);

	const [autoCompleteSuggestList, setAutoCompleteSuggestList] = useState(null);
	const [autoCompleteSelectedItem, setAutoCompleteSelectedItem] = useState({});

	const postResume = useFetch(
		"POST",
		"resume/edit",
		{
			id: resumeData.id,
			city_id: kota,
			name: nama,
			phone: noHP,
			birth_date: date,
			address: alamat,
		},
		false
	);

	const checkAlamat = () => {
		var flag = alamat == ""
		setAlamatError(flag);
		return flag;
	};

	const checkKota = () => {
		var flag = kota == ""
		setKotaError(flag);
		return flag;
	};

	const handleDatePicker = (event, selectedDate) => {
		setDatePicker(false);
		setDate(moment(selectedDate));
	};

	const handleNextButton = async () => {
		if (checkAlamat())
			base.alertSnackbar("Alamat tidak boleh kosong")
		else if (checkKota())
			base.alertSnackbar("Kota tidak boleh kosong")
		else if (ttl == '')
			base.alertSnackbar("Tanggal Lahir tidak boleh kosong")
		else{
			data = {
				name: nama,
				phone: noHP,
				birth_date: date,
				address: alamat,
				city: autoCompleteSelectedItem,
			};

			if (props.route.params.reviewResume) {
				await AsyncStorage.setItem("informasi_01", JSON.stringify(data));
				props.route.params.onRefresh()
				props.navigation.goBack()
			} else if (props.route.params.editResume) {
				postResume.fetchData();
			} else {
				await AsyncStorage.setItem("informasi_01", JSON.stringify(data));
				props.navigation.navigate('Resume', {screen : 'Informasi02', params: {}, })
			}
		}
	};

	const handleEdit = async () => {
		var getAsync_informasi_01 = await AsyncStorage.getItem("informasi_01")
		if(getAsync_informasi_01 != null){
			getAsync_informasi_01 = JSON.parse(getAsync_informasi_01)
			setDate(moment(getAsync_informasi_01.birth_date));
			setAlamat(getAsync_informasi_01.address);
			setKota(getAsync_informasi_01.city.id);
			setpreSelectedLabelCity(getAsync_informasi_01.city.label);
		}
	};

	useEffect(() => {
		// if(props.route.params.editResume)
		// 	getResume.fetchData();

		if(props.route.params.reviewResume){
			handleEdit()
		}
		else if(props.route.params.resumeData == null){
			AsyncStorage.setItem('lastResumePage', 'Informasi01')
			getData.refetch()
			handleEdit()
		}

		if(props.route.params.resumeData != null){
			setResumeData(props.route.params.resumeData)
			setNama(props.route.params.resumeData.name)
			setNoHP(props.route.params.resumeData.phone)
			setDate(moment(props.route.params.resumeData.birth_date))
			setAlamat(props.route.params.resumeData.name)
			setKota(props.route.params.resumeData.city.id)
			setAutoCompleteSelectedItem(props.route.params.resumeData.city)
		}
	}, []);

	useEffect(() => {
		if(getData.data.status != null){
			if(getData.data.status == 'success'){
				const tmpData = getData.data.data;
				setNama(tmpData?.name);
				setNoHP(tmpData?.phone);
			}
			else
				base.alertSnackbar(getData.data.message)
		}
	}, [getData.data]);

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

	useEffect(() => {
		if(getCity.data.status != null){
			if(getCity.data.status == "success"){
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

	// useEffect(() => {
	// 	if(getResume.data.status != null){
	// 		if(getResume.data.status == 'success'){
	// 			setAlamat(getResume.data.data?.address);
	// 			setKota(getResume.data.data?.city.id);
	// 			setpreSelectedLabelCity(getResume.data.data?.city.name);
	// 			setDate(moment(getResume.data.data?.birth_date));
	// 		}
	// 		else
	// 			base.alertSnackbar(getResume.data.message)
	// 	}
	// }, [getResume.data]);

	function onCitySelected(item){
		if(item != null){
			setAutoCompleteSelectedItem(item)
			setKota(item.id)
		}
	}

	return (
		<AutocompleteDropdownContextProvider>
			{/* <Stack.Screen
				options={{
					header: () => null,
				}}
			/> */}
			<View style={{ paddingVertical: SIZES.medium, backgroundColor: "white" }}>
				<Header backButton title={props.route.params.editResume ? "Edit Resume" : "Pengisian Resume"} navigation={props.navigation}/>
			</View>
			<HeaderResume numText='1' title="Informasi Anda"/>

			{
				(getCity.isLoading) ?
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
					<>
						<ScrollView
							style={{
								backgroundColor: "white",
								paddingHorizontal: SIZES.xLarge,
							}}>
							<TextField
								containerStyle={{ marginTop: 8 }}
								editable={false}
								keyboardType={"default"}
								label={"Nama"}
								placeholder={nama}
								required
								onChangeText={(text) => setNama(text)}
								value={nama}
							/>

							<TextField
								editable={false}
								keyboardType={"phone-pad"}
								label={"Nomor Handphone"}
								placeholder={noHP}
								required
								onChangeText={(text) => setNoHP(text)}
								value={noHP}
							/>

							<View style={styles.container}>
								<Text style={[FONTSTYLES.inputLabel, { marginBottom: SIZES.xSmall / 2 }]}>
									Tanggal Lahir
									<Text style={FONTSTYLES.asterisk}>*</Text>
								</Text>
								<TouchableWithoutFeedback onPress={() => setDatePicker(true)}>
									<Text style={styles.TextField}>{date.format("YYYY-MM-DD")}</Text>
								</TouchableWithoutFeedback>

								{
									datePicker &&
									<DateTimePicker
										value={date.toDate()}
										maximumDate={maxDate.toDate()}
										mode="date"
										onChange={(e, v) => handleDatePicker(e, v)}/>
								}
							</View>

							<TextField
								ref={refAlamat}
								keyboardType={"default"}
								label={"Alamat Tinggal"}
								multiline
								numberOfLines={4}
								placeholder={"Alamat"}
								required
								onChangeText={(text) => setAlamat(text)}
								onBlur={() => checkAlamat()}
								onSubmitEditing={() => checkAlamat() || refKota.current.focus()}
								value={alamat}
								error={alamatError}
								errorMessage={"Alamat tidak boleh kosong"}
							/>

							<View style={{ paddingBottom: SIZES.small }}>
								<Text style={[FONTSTYLES.inputLabel, { marginBottom: SIZES.xSmall / 2 }]}>
									Kota Tinggal
									<Text style={FONTSTYLES.asterisk}>*</Text>
								</Text>
								<AutocompleteDropdown
									initialValue={kota}
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
						</ScrollView>

						<View style={{ padding: 16, backgroundColor: COLORS.white }}>
							{
								postResume.isLoading ?
									<ActivityIndicator size={"large"} color={COLORS.primary} />
								:
									<Button
										title={props.route.params.reviewResume ? "Simpan" : props.route.params.editResume ? "Simpan" : "Lanjut"}
										style={{ height: 30 }}
										onPress={() => handleNextButton()}/>
							}
						</View>
					</>
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
	container: {
		flexDirection: "column",
		marginBottom: SIZES.small,
	},
	TextField: {
		flex: 1,
		// ...FONTSTYLES.TextField,
		color: COLORS.black_12,
		paddingHorizontal: SIZES.medium,
		paddingVertical: SIZES.small,
		borderWidth: 1,
		height: SIZES.medium * 3.3,
		textAlignVertical: "center",
		borderRadius: SIZES.medium / 2,
		borderColor: COLORS.gray,
		backgroundColor: COLORS.white,
		overflow: "hidden",
	},
});
