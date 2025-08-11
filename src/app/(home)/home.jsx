import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Button,
	ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";
import Header from "../../components/common/header/header";
import { avataaars, avatar_new, svg_avatar } from "../../assets";
import { Alert, HomeBanner, Skeleton } from "../../components";
import { useSafeAreaInsets, SafeAreaView, } from "react-native-safe-area-context";
import Geolocation from '@react-native-community/geolocation';
import Card from "../../components/common/Card";
// import { useRouter } from "expo-router";
import moment from "moment";
import useFetch from "../../hook/useFetch";
import Base from "../../utils/base";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { MaterialIcons } from "@expo/vector-icons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import "moment/locale/id";
import { LocalSvg } from "react-native-svg/css";

// import * as Device from "expo-device";
// import * as Notifications from 'expo-notifications';
// import Constants from "expo-constants";
// import { fcmGetToken } from "../../hook/getDeviceToken";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { registerForExpoPushNotificationsAsync, registerForPushNotificationsAsync } from '../../hook/getDeviceToken'

// const { status } = await Notifications.requestPermissionsAsync();
// if (status !== 'granted') {
//   alert('You need to enable permissions in order to receive notifications');
//   return;
// }

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications

export default function Home(props) {
	var base = new Base()
  const getJobsUrgent = useFetch(
    "GET",
    "jobs?api_type=recommendation&is_live_app=1&is_approve=1&filter=job_not_started&is_urgent=1&staff_type=open",
    {},
    false
  );
	const getJobs = useFetch(
    "GET",
    "jobs?api_type=recommendation&is_live_app=1&is_approve=1&filter=job_not_started&staff_type=open",
    {},
    false
  );
  const insets = useSafeAreaInsets();
  // const router = useRouter();
  const getProfile = useFetch("GET", "auth/profile", {});
  const getBanner = useFetch("GET", "banner?is_publish=1", {});

  const [pushToken, setPushToken] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
	const [arrJobsUrgent, setArrJobsUrgent] = useState([]);
	const [arrJobs, setArrJobs] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [message, setMessage] = useState();

  const postNotification = useFetch(
    "POST",
    "communication/test-send",
    message,
    false
  );

  // useEffect(() => {
  //   console.log('UEF', postNotification.data)
  // }, [postNotification.data])

  // useEffect(() => {
  //   if (message != null) {
  //     postNotification.fetchData()
  //   }
  // }, [message])

	useEffect(() => {
    if(getJobs.data.status != null){
			if(getJobs.data.status == 'success'){
				var arr = arrJobs.map((x) => x)
				for(let data of getJobs.data.data){
					for(let shift of data.shift){
						shift.start_date_moment = moment(shift.start_date)
						shift.end_date_moment = moment(shift.end_date)
					}
					arr.push(data)
				}
				setArrJobs(arr)
			}
			else
				base.alertSnackbar(getJobs.data.message)
		}
  }, [getJobs.data]);

	useEffect(() => {
    if(getJobsUrgent.data.status != null){
			if(getJobsUrgent.data.status == 'success'){
				var arr = arrJobsUrgent.map((x) => x)
				for(let data of getJobsUrgent.data.data){
					for(let shift of data.shift){
						shift.start_date_moment = moment(shift.start_date)
						shift.end_date_moment = moment(shift.end_date)
					}
					arr.push(data)
				}
				setArrJobsUrgent(arr)
			}
			else
				base.alertSnackbar(getJobsUrgent.data.message)
		}
  }, [getJobsUrgent.data]);

  const redirect = async () => {
    const notifRedirect = await AsyncStorage.getItem("notifRedirect");
    if (notifRedirect) {
			props.navigation.navigate(notifRedirect)
      // router.push(notifRedirect);
      await AsyncStorage.removeItem("notifRedirect");
    }
		else{
			getJobsUrgent.refetch()
			getJobs.refetch()
		}
  };

  

  const setRefresh = () => {
		setArrJobs([])
		setArrJobsUrgent([])
    getJobs.refetch()
		getJobsUrgent.refetch()
		getProfile.refetch()
  };

  useEffect(() => {
		redirect();

    // fcmGetToken().then((token) => setPushToken(JSON.stringify(token)));

    // registerForPushNotificationsAsync().then(token => setPushToken(token)).catch(error => console.log(error));
    // registerForExpoPushNotificationsAsync().then(token => setExpoPushToken(token)).catch(error => console.log(error));

    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   // console.log(response);
    //   router.replace('/profile')
    // });

    // return () => {
    // Notifications.removeNotificationSubscription(notificationListener.current);
    // Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

  return (
		<ScrollView style={{ backgroundColor: 'white', flex: 1, }} 
			refreshControl={
				<RefreshControl
					refreshing={getJobs.isLoading}
					onRefresh={() => setRefresh()}
				/>
			}>
			<View style={{  }}>
				<Header withNotif navigation={props.navigation}/>
				<View style={styles.userSection}>
					{
						!getProfile.isLoading && getProfile.data.data?.file_name == null ?
							<LocalSvg asset={svg_avatar} width={42} height={42} />
						:
							<Image
								source={{
									uri: `${base.host}/image/user?file_name=${getProfile.data.data?.file_name}&rnd=${moment().format("YYYYMMDDHHmmss")}`,
								}}
								style={styles.avatar}
							/>
						}
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
						<View style={{ justifyContent: "center", }}>
							<Text style={[FONTSTYLES.p]}>{moment().format("LL")}</Text>
							<Text style={[FONTSTYLES.med16_gray]}>
								Hi, {getProfile.data.data?.name}
							</Text>
						</View>

						<View style={{  }}>
							{
								getProfile.data.data?.available_to_check_in ?
								<TouchableOpacity onPress={() => props.navigation.navigate('ScanQR', {params: {state: 'check_in', }})}>
									<View
										style={{
											width: SIZES.xSmall * 4.5,
											height: SIZES.xSmall * 4.5,
											backgroundColor: COLORS.secondary,
											borderRadius: SIZES.xSmall * 4.5,
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<MaterialIcons
											name="qr-code-scanner"
											color={COLORS.white}
											size={SIZES.xLarge}
										/>
									</View>
								</TouchableOpacity>
								: getProfile.data.data?.available_to_check_out &&
								<TouchableOpacity onPress={() => props.navigation.navigate('ScanQR', {params: {state: 'check_out', }})}>
									<View
										style={{
											width: SIZES.xSmall * 4.5,
											height: SIZES.xSmall * 4.5,
											backgroundColor: COLORS.secondary,
											borderRadius: SIZES.xSmall * 4.5,
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<MaterialIcons
											name="qr-code-scanner"
											color={COLORS.white}
											size={SIZES.xLarge}
										/>
									</View>
								</TouchableOpacity>
							}
						</View>
					</View>

				</View>

				{
					getProfile.data.data?.available_to_check_in ?
						<View style={{ padding: SIZES.medium }}>
							<Alert.Warning
								text={"Anda memiliki Pekerjaan Hari Ini. "}
								bold={"Check In"}
							/>
						</View>
					: getProfile.data.data?.is_working == 1 &&
						<View style={{ padding: SIZES.medium }}>
							<Alert.Info text={"Sedang Bekerja"} />
						</View>
				}

				<View style={styles.homeBannerSection}>
					{
						getJobs.isLoading && getBanner.data == null ?
							<Skeleton
								negWidth={32}
								height={SIZES.medium * 10}
								borderRadius={SIZES.medium}
							/>
						:
						<HomeBanner data={getBanner.data.data} />
					}
				</View>

				<View style={{ paddingVertical: SIZES.xLarge, gap: SIZES.xSmall }}>
					<Text style={styles.sectionTitle}>Pekerjaan Mendesak</Text>
					{
						arrJobsUrgent.length == 0 ?
						<Text style={[styles.empty_2, {marginHorizontal: 16, }]}>
							Belum ada pekerjaan mendesak untuk anda saat ini
						</Text>
						:
						<FlatList
							data={arrJobsUrgent}
							ListHeaderComponent={() => <View style={{ width: SIZES.small }} />}
							ListFooterComponent={() => <View style={{ width: SIZES.small }} />}
							maxToRenderPerBatch={3}
							keyExtractor={(item) => item.id}
							renderItem={({ item, index }) =>
								getJobs.isLoading ?
									<Skeleton
										width={SIZES.xSmall * 23}
										height={SIZES.xSmall * 13}
										borderRadius={SIZES.medium}
										key={index}/>
								:
									<Card.UrgentNeededJobs
										keys={index}
										key={index}
										data={item}
										navigation={props.navigation}
										userID={getProfile.data.data?.id}/>
							}
							ItemSeparatorComponent={({ item, index }) => <View style={{ width: SIZES.small }} key={index} />}
							horizontal
							showsHorizontalScrollIndicator={false}
							nestedScrollEnabled/>
					}
				</View>

				<View style={{ paddingTop: SIZES.small, paddingBottom: SIZES.xSmall }}>
					<Text style={styles.sectionTitle}>Pekerjaan Baru</Text>
					{
						arrJobs.length == 0 ?
						<Text style={[styles.empty, {marginHorizontal: 16, }]}>Belum ada pekerjaan baru untuk anda saat ini</Text>
						:
						<FlatList
							data={arrJobs}
							ItemSeparatorComponent={() => <View style={{ height: SIZES.small }} />}
							ListFooterComponent={() => <View style={{ height: SIZES.small }} />}
							ListHeaderComponent={() => <View style={{ width: SIZES.small }} />}
							keyExtractor={(item) => item.id}
							renderItem={({ item, index }) =>
								getJobs.isLoading ?
									<Skeleton
										negWidth={32}
										height={SIZES.medium * 10}
										style={{ marginLeft: SIZES.medium }}
										borderRadius={SIZES.medium}
										key={index}/>
								:
									<Card.Jobs
										data={item}
										keys={index}
										key={index}
										from={"home"}
										navigation={props.navigation}
										userID={getProfile.data.data?.id}/>
							}/>
					}
					
				</View>


			</View>
		</ScrollView>
  );
};

const styles = StyleSheet.create({
  userSection: {
    paddingVertical: SIZES.medium / 2,
    paddingHorizontal: SIZES.large,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 42,
  },
  homeBannerSection: {
    paddingVertical: SIZES.medium / 2,
    paddingHorizontal: SIZES.medium,
  },
  sectionTitle: {
    ...FONTSTYLES.sBold16_dBlue,
    paddingHorizontal: SIZES.medium,
  },
  empty: {
    ...FONTSTYLES.p_black_12,
    // marginHorizontal: SIZES.medium,
  },
  empty_2: {
    ...FONTSTYLES.p_black_12,
    // marginHorizontal: SIZES.medium / 4,
  },
});
