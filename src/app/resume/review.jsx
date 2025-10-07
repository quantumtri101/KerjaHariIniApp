import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableNativeFeedback,
	ActivityIndicator,
	BackHandler,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/common/header/header";
import { COLORS, FONTSTYLES, SIZES, FONTS } from "../../constants";
import { Button, CheckBox, HeaderResume, } from "../../components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import cityLabel from "../../hook/getLabel";
import useFetch from "../../hook/useFetch";
import moment from "moment";
import skill from "./skill";
import Base from "../../utils/base";

const statusData = [
	{ name: 'Belum Kawin', id: 'unmarried', },
	{ name: 'Kawin', id: 'married', },
	{ name: 'Cerai Hidup', id: 'divorce_by_living', },
	{ name: 'Cerai Mati', id: 'divorce_by_death', },
]

const CardItemList = ({ item }) => {
	return (
		<View style={styles.detailContainerRow}>
			<MaterialCommunityIcons name="circle-medium" size={SIZES.medium} color={COLORS.rockBlue} />
			<Text style={[FONTSTYLES.reg12_rockBlue, { color: COLORS.secondary }]}>{item}</Text>
		</View>
	);
};

const CardHeader = ({ title, icon, route }) => {
	return (
		<View>
			<View style={styles.cardHeaderContainer}>
				<MaterialCommunityIcons name={icon} size={36} color={COLORS.rockBlue} />
				<Text numberOfLines={2} ellipsizeMode="tail" style={styles.cardTitle}>
					{title}
				</Text>
				<View style={{ flex: 1 }} />
				<View style={{ borderRadius: SIZES.large, overflow: "hidden" }}>
					<View style={{ padding: SIZES.small / 2 }}>
						<MaterialCommunityIcons
							name="chevron-right"
							size={SIZES.xLarge}
							color={COLORS.rockBlue}
						/>
					</View>
				</View>
			</View>
			<View style={styles.divider} />
		</View>
	);
};

export default function ReviewResume(props) {
	var base = new Base()
	const [informasi_01, setInformasi_01] = useState();
	const [informasi_02, setInformasi_02] = useState();
	const [arr_experience, setArr_experience] = useState();
	const [arr_skill, setArr_skill] = useState();
	const [id_image, setId_image] = useState('');
	const [selfie_image, setSelfie_image] = useState('');
	const [id_image_base64, setId_image_base64] = useState();
	const [selfie_image_base64, setSelfie_image_base64] = useState();
	const [agreement, setAgreement] = useState(false);
	const [postData, setPostData] = useState();
	const [countRefresh, setCountRefresh] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [resumeData, setResumeData] = useState({});

  const firstRender = useRef(true);

	const getResume = useFetch("GET", "resume", {}, false);
	const postResume = useFetch("POST", "resume", {}, false);

	useEffect(() => {
		props.route.params.editResume ? getResume.refetch() : getAsyncStorage();

		if(!props.route.params.editResume)
			AsyncStorage.setItem('lastResumePage', 'Review')
	}, []);

	useEffect(() => {
		if(getResume.data.status != null){
			setRefreshing(false)
			if(getResume.data.status == 'success'){
				var temp = JSON.parse(JSON.stringify(getResume.data.data))
				temp.birth_date_moment = moment(temp.birth_date)
				setResumeData(temp)
			}
			else
				base.alertSnackbar(getResume.data.message)
		}
	}, [getResume.data]);

	useEffect(() => {
		if(resumeData.id != null)
			initDataFromAPI();
	}, [resumeData]);

	useEffect(() => {
		if (postResume.data.status != null) {
			if (postResume.data.status == "success") {
				AsyncStorage.removeItem("informasi_01");
				AsyncStorage.removeItem("informasi_02");
				AsyncStorage.removeItem("arr_experience");
				AsyncStorage.removeItem("arr_skill");
				AsyncStorage.removeItem("id_image");
				AsyncStorage.removeItem("selfie_image");
				props.navigation.navigate('Resume', {screen : 'Finish', params: {}, })
			}
			else
				base.alertSnackbar(postResume.data.message)
		}
	}, [postResume.data]);

	const initDataFromAPI = () => {
		var temp = {}
		for(let status of statusData){
			if(resumeData.marital_status == status.id){
				temp = status
				break
			}
		}
		setInformasi_01({
			name: resumeData.name,
			phone: resumeData.phone,
			birth_date: resumeData.birth_date,
			birth_date_moment: resumeData.birth_date_moment,
			address: resumeData.address,
			city: resumeData.city != null ? resumeData.city.name : '',
		});
		setInformasi_02({
			marital_status: temp,
			height: resumeData.height,
			weight: resumeData.weight,
			education: resumeData.education.name,
			bank: resumeData.bank.name,
			acc_no: resumeData.acc_no,
			acc_name: resumeData.acc_name,
			id_no: resumeData.id_no,
		});
		setArr_experience(resumeData.experience);
		setArr_skill(resumeData.skill);
		setId_image(resumeData.id_file_name);
		setSelfie_image(resumeData.selfie_file_name);
	};

	const getAsyncStorage = async () => {
		const informasi_01 = JSON.parse(await AsyncStorage.getItem("informasi_01"));
		const informasi_02 = JSON.parse(await AsyncStorage.getItem("informasi_02"));
		const arr_experience = JSON.parse(await AsyncStorage.getItem("arr_experience"));
		const arr_skill = JSON.parse(await AsyncStorage.getItem("arr_skill"));
		const id_image = await AsyncStorage.getItem("id_image");
		const selfie_image = await AsyncStorage.getItem("selfie_image");
		setInformasi_01(informasi_01);
		setInformasi_02(informasi_02);
		setArr_experience(arr_experience);
		setArr_skill(arr_skill);
		setId_image(id_image);
		setSelfie_image(selfie_image);

		var resumeData = {}
		for(let x in informasi_01)
			resumeData[x] = informasi_01[x]
		for(let x in informasi_02)
			resumeData[x] = informasi_02[x]
		resumeData.experience = []
		for(let x in arr_experience)
			resumeData.experience.push(arr_experience[x])
		resumeData.skill = []
		for(let x in arr_skill)
			resumeData.skill.push(arr_skill[x])
		resumeData.id_image = id_image
		resumeData.selfie_image = selfie_image
		setResumeData(resumeData)
		setRefreshing(false);
	};

	const handleNext = async () => {
		var informasi_01 = await AsyncStorage.getItem("informasi_01");
		var informasi_02 = await AsyncStorage.getItem("informasi_02");
		var arr_experience = await AsyncStorage.getItem("arr_experience");
		var arr_skill = await AsyncStorage.getItem("arr_skill");
		var id_image = await AsyncStorage.getItem("id_image");
		var selfie_image = await AsyncStorage.getItem("selfie_image");

		informasi_01 = JSON.parse(informasi_01);
		informasi_02 = JSON.parse(informasi_02);
		arr_experience = JSON.parse(arr_experience);
		arr_skill = JSON.parse(arr_skill);
		var id_image_base64 = await base.toDataURLPromise(id_image)
		var selfie_image_base64 = await base.toDataURLPromise(selfie_image)

		for (let skill of arr_skill) {
			skill.resume = null
			if(skill.id != null && !skill.id.includes('RESUME_SKILL')){
				skill.skill = {
					id: skill.id,
				}
				skill.id = null
			}

			if (skill.skill == null)
				skill.custom_skill = skill.label
		}

		postResume.setRefetch({
			city_id: informasi_01.city.id,
			education_id: informasi_02.education.id,
			bank_id: informasi_02.bank.id,
			name: informasi_01.name,
			phone: informasi_01.phone,
			birth_date: moment(informasi_01.birth_date).format("YYYY-MM-DD"),
			address: informasi_01.address,
			marital_status_id: informasi_02.marital_status.id,
			height: informasi_02.height,
			weight: informasi_02.weight,
			acc_no: informasi_02.acc_no,
			acc_name: informasi_02.acc_name,
			id_no: informasi_02.id_no,
			is_publish: "",
			arr_experience: arr_experience != null ? arr_experience : [],
			arr_skill: arr_skill != null ? arr_skill : [],
			id_image: id_image_base64,
			selfie_image: selfie_image_base64,
		})
	};

  function onRefresh() {
    setRefreshing(true);
		props.route.params.editResume ? getResume.refetch() : getAsyncStorage();
  }

	return (
		<View style={{ flex: 1, }}>
			<View style={{ flexDirection: 'row', }}>
				<Header
					style={{ flex: 1, }}
					backButton={props.route.params.editResume}
					title={props.route.params.editResume ? "Edit Resume" : "Review Resume"}
					navigation={props.navigation}
				/>
			</View>

			<ScrollView
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				style={{ backgroundColor: "white", paddingHorizontal: SIZES.xLarge }}>

				{/* Informasi 1 */}
				<TouchableOpacity
					onPress={() =>
						props.navigation.navigate('Resume', {screen : 'Informasi01', params: {editResume: props.route.params.editResume, reviewResume: !props.route.params.editResume, resumeData: resumeData, onRefresh: () => onRefresh(), }, })
					}>
					<View style={styles.cardContainer}>
						<CardHeader title={"Informasi 1"} icon={"file"} route={"informasi_01"} />
						<View style={styles.detailContainer}>
							{
								informasi_01 == null || getResume.isLoading ?
									<ActivityIndicator size={"large"} color={COLORS.primary} />
								:
									<View>
										<CardItemList item={informasi_01.name} />
										<CardItemList item={informasi_01.phone} />
										<CardItemList item={moment(informasi_01.birth_date).format("DD/MM/YYYY")} />
										<CardItemList item={informasi_01.address} />
										<CardItemList item={props.route.params.editResume ? informasi_01.city : informasi_01.city?.title} />
									</View>
							}
						</View>
					</View>
				</TouchableOpacity>

				{/* Informasi 2 */}
				<TouchableOpacity
					onPress={() =>
						props.navigation.navigate('Resume', {screen : 'Informasi02', params: {editResume: props.route.params.editResume, reviewResume: !props.route.params.editResume, resumeData: resumeData, onRefresh: () => onRefresh(), }, })
					}>
					<View style={styles.cardContainer}>
						<CardHeader title={"Informasi 2"} icon={"file"} route={"informasi_02"} />
						<View style={styles.detailContainer}>
							{
								informasi_02 == null || getResume.isLoading ?
									<ActivityIndicator size={"large"} color={COLORS.primary} />
								:
									<View>
										<CardItemList item={informasi_02.marital_status.name} />
										<CardItemList item={informasi_02.height + " KG"} />
										<CardItemList item={informasi_02.weight + " CM"} />
										<CardItemList item={props.route.params.editResume ? informasi_02.education : informasi_02.education.name} />
										<CardItemList item={props.route.params.editResume ? informasi_02.bank : informasi_02.bank.name} />
										<CardItemList item={informasi_02.acc_no} />
										<CardItemList item={informasi_02.acc_name} />
										<CardItemList item={informasi_02.id_no} />
									</View>
							}
						</View>
					</View>
				</TouchableOpacity>

				{/* Pengalaman Kerja */}
				<TouchableOpacity
					onPress={() =>
						props.navigation.navigate('Resume', {screen : 'PengalamanKerja', params: {editResume: props.route.params.editResume, reviewResume: !props.route.params.editResume, resumeData: resumeData, onRefresh: () => onRefresh(), }, })
					}>
					<View style={styles.cardContainer}>
						<CardHeader title={"Pengalaman Kerja"} icon={"file"} route={"pengalamanKerja"} />
						<View style={styles.detailContainer}>
							{
								arr_experience == null || getResume.isLoading ?
									<ActivityIndicator size={"large"} color={COLORS.primary} />
								: arr_experience.length > 0 ?
									arr_experience.map((item, index) => <CardItemList item={item.name} key={index} />)
								:
									<Text style={{ textAlign: "center" }}>Tidak ada data Pengalaman Kerja</Text>
							}
						</View>
					</View>
				</TouchableOpacity>

				{/* Skill */}
				<TouchableOpacity
					onPress={() =>
						props.navigation.navigate('Resume', {screen : 'Skill', params: {editResume: props.route.params.editResume, reviewResume: !props.route.params.editResume, resumeData: resumeData, onRefresh: () => onRefresh(), }, })
					}>
					<View style={styles.cardContainer}>
						<CardHeader title={"Skill"} icon={"file"} route={"skill"} />
						<View style={styles.detailContainer}>
							{
								arr_skill == null || getResume.isLoading ?
									<ActivityIndicator size={"large"} color={COLORS.primary} />
								: arr_skill.length > 0 ?
									arr_skill.map((item, index) =>
										<CardItemList item={item.name} key={index} />
									)
								:
									<Text style={{ textAlign: "center" }}>Tidak ada data Skill</Text>
							}
						</View>
					</View>
				</TouchableOpacity>

				{/* KTP */}
				<TouchableOpacity onPress={() =>
					props.navigation.navigate('Resume', {screen : 'KTP', params: {editResume: props.route.params.editResume, reviewResume: !props.route.params.editResume, resumeData: resumeData, onRefresh: () => onRefresh(), }, })
				}>
					<View style={styles.cardContainer}>
						<CardHeader title={"KTP"} icon={"file"} route={"ktp"} />
						{
							id_image == '' || selfie_image == '' ?
								<ActivityIndicator size={"large"} color={COLORS.primary} />
							:
								<View style={{ flexDirection: 'row', justifyContent: 'flex-start', }}>
									{
										id_image != null &&
										<View style={{ }}>
											<View style={[styles.detailContainerRow, { paddingBottom: 5 }]}>
												<MaterialCommunityIcons
													name="check-circle-outline"
													size={16}
													color={id_image != '' ? COLORS._AcceptedText : COLORS._RejectedText}
												/>
												<Text style={[FONTSTYLES.reg10_7373, { color: COLORS._AcceptedText }]}>KTP.jpg</Text>
											</View>

											<Image source={{ uri: `${base.host}/image/resume/id?file_name=${id_image}&rnd=${moment().format("YYYYMMDDHHmmss")}` }} style={{ width: 100, height: 100, borderRadius: 16, }} resizeMode="contain"/>
										</View>
									}
									{
										selfie_image != null &&
										<View style={{ marginLeft: 16, }}>
											<View style={[styles.detailContainerRow, { paddingBottom: 5 }]}>
												<MaterialCommunityIcons
													name="check-circle-outline"
													size={16}
													color={selfie_image != '' ? COLORS._AcceptedText : COLORS._RejectedText}
												/>
												<Text style={[FONTSTYLES.reg10_7373, { color: COLORS._AcceptedText }]}>
													KTP_Selfie.jpg
												</Text>
											</View>

											<Image source={{ uri: `${base.host}/image/resume/selfie?file_name=${id_image}&rnd=${moment().format("YYYYMMDDHHmmss")}` }} style={{ width: 100, height: 100, borderRadius: 16, }} resizeMode="contain"/>
										</View>
									}
								</View>
						}
						
					</View>
				</TouchableOpacity>

				{/* <Text>{id_image}</Text> */}
			</ScrollView>
			{
				!props.route.params.editResume &&
				<View style={{ padding: 16, backgroundColor: COLORS.white }}>
					<CheckBox
						text={"Dengan ini saya menyetujui bahwa data ini adalah benar adanya."}
						textStyle={styles.checkBoxText}
						onPress={() => setAgreement(!agreement)}
					/>
					{
						postResume.isLoading || isLoading ?
							<ActivityIndicator
								size={"large"}
								style={{ marginTop: SIZES.large }}
								color={COLORS.primary}
							/>
						:
							<Button
								title={"Lanjut"}
								style={{ height: 30 }}
								onPress={() => handleNext()}
								disable={!agreement}
							/>
					}
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		backgroundColor: COLORS.lightWhite,
		borderRadius: SIZES.medium,
		padding: SIZES.large,
		marginBottom: SIZES.medium,
	},
	photoContainer: {},
	cardHeaderContainer: {
		flexDirection: "row",
		gap: SIZES.medium,
		alignItems: "center",
		marginBottom: 6,
	},
	cardTitle: {
		...FONTSTYLES.sBold14_222,
		color: COLORS._coolToneBlue_alt1,
		flexShrink: 1,
	},
	rightArrowContainer: {
		alignItems: "center",
		justifyContent: "center",
		width: SIZES.xSmall * 3,
		height: SIZES.xSmall * 3,
	},
	divider: {
		height: 1,
		marginVertical: SIZES.xSmall,
		backgroundColor: "#EDF1F7",
	},
	detailContainer: {
		// paddingHorizontal: SIZES.medium,
		// paddingBottom: SIZES.medium,
		gap: SIZES.medium / 4,
	},
	detailContainerRow: {
		flexDirection: "row",
		gap: SIZES.xSmall / 2,
		alignItems: "center",
	},
	checkBoxText: {
		...FONTSTYLES.reg10_7373,
		color: COLORS.gray_22,
	},
});
