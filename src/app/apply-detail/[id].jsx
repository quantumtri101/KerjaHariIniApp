import {
  ActivityIndicator,
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
// import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import Header from "../../components/common/header/header";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  Badge,
  Button,
  CustomTopTabBar,
  Modals,
  Skeleton,
} from "../../components";
import { logo } from "../../assets";
import Lamaran from "./lamaran";
import Pekerjaan from "./pekerjaan";
import PencairanGaji from "./pencairan-gaji";

import { useIsFocused } from "@react-navigation/native";
import { svg_sentIllustration } from "../../assets";
import useFetch from "../../hook/useFetch";
import moment from "moment";
import { formatCurrency } from "../../utils";
import Base from "../../utils/base";

const Tab = createMaterialTopTabNavigator();

export default function ApplyDetailIndex(props) {
	var base = new Base()
  const [viewHeight, setViewHeight] = useState(0);
  const [tipeInterview, setTipeInterview] = useState("online");
	const [arrAllowedTab, setArrAllowedTab] = useState([]);
  const [applicationData, setApplicationData] = useState({})
  const [jobsData, setJobsData] = useState({})

  // const router = useRouter();
  // const { id, status, from, urgent } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [applicationId, setApplicationId] = useState("");
	const [shiftStartDateMoment, setShiftStartDateMoment] = useState(moment());
	const [shiftEndDateMoment, setShiftEndDateMoment] = useState(moment());

  const getApplication = useFetch("GET", "jobs/application?id=" + props.route.params.id, {});
  const getCity = useFetch("GET", "city?id=" + (applicationData.id != null ? applicationData.jobs.city_id : ''), {}, false);
  const getJobs = useFetch("GET", "jobs?id=" + (applicationData.id != null ? applicationData.jobs.id : ''), {}, false);
  // const getCheckLog = useFetch("GET", "check-log?jobs_id=" + props.route.params.id, {});

  useEffect(() => {
		if(getApplication.data.status != null){
      if(getApplication.data.status == 'success'){
        var arr = []
        if(getApplication.data.data.status == 'wait')
          arr.push('Lamaran')
        else if(getApplication.data.data.status == 'interview')
          arr.push('Lamaran')
        else if(getApplication.data.data.status == 'accepted')
          arr.push('Lamaran', 'Pekerjaan')
        else if(getApplication.data.data.status == 'working')
          arr.push('Lamaran', 'Pekerjaan')
        else if(getApplication.data.data.status == 'declined')
          arr.push('Lamaran')
        else if(getApplication.data.data.status == 'done')
          arr.push('Lamaran', 'Pekerjaan', 'Pencairan Gaji')
        else if(getApplication.data.data.status == 'expired')
          arr.push('Lamaran', 'Pekerjaan')
        setArrAllowedTab(arr)
        setApplicationData(getApplication.data.data)
      }
      else
        base.alertSnackbar(getApplication.data.message)
		}
  }, [getApplication.data]);

	useEffect(() => {
		if(getJobs.data.status != null){
      if(getJobs.data.status == 'success'){
        if(getJobs.data.data.shift.length > 0){
          getJobs.data.data.shift[0].start_date_moment = moment(getJobs.data.data.shift[0].start_date)
          getJobs.data.data.shift[0].end_date_moment = moment(getJobs.data.data.shift[0].end_date)
          setShiftStartDateMoment(getJobs.data.data.shift[0].start_date_moment)
          setShiftEndDateMoment(getJobs.data.data.shift[0].end_date_moment)
        }
        setJobsData(getJobs.data.data)
      }
      else
        base.alertSnackbar(getJobs.data.message)
		}

	}, [getJobs.data,])

  useEffect(() => {
    if(applicationData.id != null){
      getCity.fetchData()
      getJobs.fetchData()

      const splitId = applicationData.id.split("_")
      setApplicationId(splitId[2] + splitId[3]);
    }
  }, [applicationData, ]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          backgroundColor: "white",
          height: useSafeAreaInsets().top,
          width: "100%",
          zIndex: 11,
          position: "absolute",
          top: 0,
        }}/>

      {/* <ScrollView
        style={{ backgroundColor: "white", position: "relative" }}
        stickyHeaderIndices={[0]}> */}
        {/* <Stack.Screen
          options={{
            header: () => null,
          }}
        /> */}

        <View style={{ paddingVertical: SIZES.medium }}>
          <Header backButton title={"Detail Lamaran"} navigation={props.navigation}/>
        </View>

        <View style={styles.secondaryContainer}>
          <View style={styles.section_1}>
            <Text style={styles.applyID}>
              #{!getApplication.isLoading && applicationId}
            </Text>
            {
							props.route.params.status == "accepted" ?
              	<Badge.Accepted />
            	: props.route.params.status == "declined" ?
              	<Badge.Rejected />
            	: props.route.params.status == "wait" ?
              	<Badge.Waiting />
            	: props.route.params.status == "interview" ?
              	<Badge.Interview />
            	: props.route.params.status == "working" ?
              	<Badge.Working />
            	: props.route.params.status == "done" ?
              	<Badge.Completed />
            	: null
						}
          </View>

          <View style={[styles.section_1, { justifyContent: "space-between" }]}>
            <Text style={FONTSTYLES.p_12}>Tanggal / Waktu Melamar</Text>
            <Text style={[FONTSTYLES.med12_black, { color: COLORS.secondary }]}>
              {moment(getApplication.data.data?.created_at).format("DD/MM/YYYY [Pk.]HH.mm")}
            </Text>
          </View>
          {
						getApplication.isLoading || getCity.isLoading || getJobs.isLoading ?
            	<Skeleton
              	negWidth={SIZES.medium * 2}
              	height={SIZES.xSmall * 13.5}
              	borderRadius={SIZES.medium}
              	style={{ marginBottom: SIZES.xxLarge }}
            	/>
          	:
            <View style={styles.jobCardContainer}>
              <View style={styles.headContainer}>
                <View style={styles.avatarContainer}>
									{
										getJobs.data.data?.image.length == 0 ?
											<Image
												source={logo}
												style={{ width: 42 }}
												resizeMode="contain"/>
										:
											<Image
												source={{
													uri: `${base.host}/image/jobs?file_name=${
														getJobs.data.data?.image[0].file_name
													}&rnd=${moment().format("YYYYMMDDHHmmss")}`,
												}}
												style={{ width: 42, height: 42 }}
												resizeMode="contain"/>
									}
                </View>
                <View>
                  {
                    props.route.params.urgent &&
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentBadgeText}>Urgent</Text>
                    </View>
                  }
                  <Text style={styles.jobTitle}>
                    {getApplication.data.data?.jobs.name}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={SIZES.medium}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.jobLocation}>
                      {getCity.data.data?.name}, {getCity.data.data?.province_name}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: SIZES.large }}>
                <View style={{ flexGrow: 1, alignItems: "center" }}>
                  <Text style={FONTSTYLES.sBold12_secondary}>
                    Rp. {getApplication.data.data?.salary_approve.toLocaleString(base.priceFormatIDR)}
                  </Text>
                  <Text style={FONTSTYLES.med10_gray}>GAJI</Text>
                </View>

                <View style={{ flexGrow: 1, alignItems: "center" }}>
                  <Text style={FONTSTYLES.sBold12_secondary}>
                    {
											shiftStartDateMoment.isSame(shiftEndDateMoment, 'day') ?
												shiftEndDateMoment.format("DD MMMM YYYY")
                      : shiftStartDateMoment.isSame(shiftEndDateMoment, 'month') ?
												shiftStartDateMoment.format("DD") + shiftEndDateMoment.format(" - DD MMMM YYYY")
                      :
												shiftStartDateMoment.format("DD MMM") +shiftEndDateMoment.format(" - DD MMM YYYY")
										}
                  </Text>
                  <Text style={FONTSTYLES.med10_gray}>TANGGAL</Text>
                </View>

                <View style={{ flexGrow: 1, alignItems: "center" }}>
                  <Text style={FONTSTYLES.sBold12_secondary}>
                    Pk. {shiftStartDateMoment.format("HH.mm")} - {shiftEndDateMoment.format("HH.mm")}
                  </Text>
                  <Text style={FONTSTYLES.med10_gray}>WAKTU</Text>
                </View>
              </View>
            </View>
          }

					{
						getJobs.data.data != null && getApplication.data.data != null &&
						<View style={{ flex:1, marginHorizontal: -SIZES.medium }}>
							<Tab.Navigator
								tabBar={(props1) => <CustomTopTabBar {...props1} fill arrAllowedTab={arrAllowedTab} />}
								sceneContainerStyle={{ backgroundColor: "white" }}
								screenOptions={{
									swipeEnabled: false,
								}}>

								<Tab.Screen name="Lamaran">
									{
										(props1) => <Lamaran
											navigation={props.navigation}
											onStateChange={(num) => setViewHeight(num)}
											status={props.route.params.status}
											jobsData={jobsData}
											applicationData={applicationData}/>
									}

								</Tab.Screen>

								<Tab.Screen name="Pekerjaan">
									{
										(props1) => <Pekerjaan
											navigation={props.navigation}
											onStateChange={(num) => setViewHeight(num)}
											status={props.route.params.status}
											jobsData={jobsData}/>
									}

								</Tab.Screen>

								<Tab.Screen name="Pencairan Gaji">
									{
										(props1) => <PencairanGaji
											navigation={props.navigation}
											onStateChange={(num) => setViewHeight(num)}
											status={props.route.params.status}
											applicationData={applicationData}/>
									}

								</Tab.Screen>

							</Tab.Navigator>
						</View>
					}

        </View>
      {/* </ScrollView> */}

      {
				(getJobs.data.data?.interview[0]?.type == "online" && props.route.params.status == "wait" && getJobs.data.data?.interview[0]?.zoom_url != null) &&
        <View style={{ padding: SIZES.medium, backgroundColor: COLORS.white }}>
          <Button
            title={"Akses Link Zoom"}
            style={{ height: 30 }}
            onPress={() => Linking.openURL(getJobs.data.data?.interview[0].zoom_url)}/>
        </View>
      }

      {
				(props.route.params.status == "working" || props.route.params.status == "accepted") &&
        <View
          style={{
            padding: SIZES.medium,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 8,
            gap: 12,
          }}>
          {/* {status == 'working' && */}
          {
						getApplication.data.data?.is_available_check_out &&
            <Button
              leftIcon={<MaterialCommunityIcons name="qrcode-scan" size={SIZES.medium}/>}
              title={"Check Out"}
              // disable={() => getCheckLog.data?.data[1] != null ? true : false}
              // disable={getApplication.data.data?.is_available_check_out == true && false}
              style={{ height: 30 }}
              onPress={() => props.navigation.navigate('ScanQR', {params: {state: 'check_out', }})}/>
          }
          <Button
            leftIcon={<MaterialCommunityIcons name="map-marker" size={20} />}
            title={"Lokasi Kerja"}
            style={{ height: 30 }}
            onPress={() => props.navigation.navigate('Maps', {
								params: {
									from: 'apply-detail',
									companyLat: getJobs.data.data?.company.latitude,
									companyLong: getJobs.data.data?.company.longitude,
								},
							})
						}/>
        </View>
      }

      {/* <Modals
        title={'Apakah Anda yakin ingin\nmenerima Tawaran?'}
        titleSmall
        svg={svg_sentIllustration}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        customButton={<ModalCustomButton />} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  secondaryContainer: {
    borderTopStartRadius: SIZES.xLarge,
    borderTopEndRadius: SIZES.xLarge,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    zIndex: 10,
		flex: 1,
  },
  headContainer: {
    flexDirection: "row",
    gap: SIZES.xSmall,
    alignItems: "center",
  },
  avatarContainer: {
    backgroundColor: COLORS.secondary,
    width: SIZES.medium * 3,
    height: SIZES.medium * 3,
    borderRadius: SIZES.xSmall,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZES.medium / 2,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  tabsContainer: {
    minHeight: "100%",
  },
  jobTitle: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
  },
  jobLocation: {
    color: COLORS.secondary,
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.medium,
    // lineHeight: SIZES.xLarge,
  },
  urgentBadge: {
    alignSelf: "flex-start",
    height: SIZES.xLarge,
    justifyContent: "center",
    backgroundColor: "red",
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.xLarge / 4,
  },
  urgentBadgeText: {
    color: COLORS.white,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.xSmall,
    lineHeight: 18,
    textTransform: "uppercase",
  },
  jobCardContainer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.lightWhite2,
    marginBottom: SIZES.xxLarge,
    borderRadius: 8,
  },
  applyID: {
    flex: 1,
    ...FONTSTYLES.med12_black,
  },
  section_1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.small,
  },
});
