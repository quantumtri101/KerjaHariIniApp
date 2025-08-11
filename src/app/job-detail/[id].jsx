import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
// import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import Header from "../../components/common/header/header";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Button, CustomTopTabBar, Modals, Skeleton } from "../../components";
import InfoPekerjaan from "./infoPekerjaan";
import Perusahaan from "./perusahaan";

import { useIsFocused } from "@react-navigation/native";
import { logo, svg_sentIllustration } from "../../assets";
import useFetch from "../../hook/useFetch";
import Base from "../../utils/base";
import moment from "moment";
import "moment/locale/id";

const Tab = createMaterialTopTabNavigator();

export default function JobDetail(props) {
	var base = new Base()
  const [viewHeight, setViewHeight] = useState(0);
  const [city_id, setCity_id] = useState("");
  const [action, setAction] = useState("");
	const [shiftStartDateMoment, setShiftStartDateMoment] = useState(moment());
	const [shiftEndDateMoment, setShiftEndDateMoment] = useState(moment());

  // const router = useRouter();
  // const { from, urgent, id, userID } = useLocalSearchParams();
  const getJobs = useFetch("GET", "jobs?id=" + props.route.params.id,);
  const getJobsApplication = useFetch("GET", "jobs/application?jobs_id=" + props.route.params.id);
  const getIsRecommendation = useFetch("GET", "jobs?api_type=offering&id=" + props.route.params.id,);
  const getCity = useFetch("GET", "city?id=" + city_id, {});
  const postApproveWorker = useFetch("POST", "jobs/application/change-approve-worker", {}, false);
  // const postDeclineWorker = useFetch("POST", "jobs/application/change-approve-worker", {}, false);
  const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		// getJobs.setFetchUrl("jobs?id=" + props.route.params.id)
		// getIsRecommendation.setFetchUrl("jobs?api_type=offering&id=" + props.route.params.id)

		if (props.route.params.from == "home" || props.route.params.from == "rekomendasi-semua") {
			getIsRecommendation.fetchData();
		}
	}, []);

	useEffect(() => {
		if (getJobs.data != null) {
			// console.log('getJobsData', getJobs.data)
			setCity_id(getJobs.data.data?.city_id);


			if(getJobs.data.data?.shift.length > 0){
				setShiftStartDateMoment(moment(getJobs.data.data?.shift[0].start_date))
				setShiftEndDateMoment(moment(getJobs.data.data?.shift[0].end_date))
			}
		}
	}, [getJobs.data]);

	useEffect(() => {
    if (postApproveWorker.data.status != null) {
      if (postApproveWorker.data.status == "success") {
        if(action == 'accept')
          props.navigation.navigate('JobDetail', {screen: 'ApplySuccess', params: {}})
        else if(action == 'decline')
          props.navigation.replace('Home', {screen: 'ListLamaran', params: {}})
        // router.push("job-detail/applySuccess");
      }
      else
        base.alertSnackbar(postApproveWorker.data.message)
    }
	}, [postApproveWorker.data]);

	useEffect(() => {
		getCity.refetch();
	}, [city_id]);

  const modalButton = () => {
    setModalVisible(false);
		props.navigation.replace('Auth', {screen: 'Login', params: {}})
    // router.push("login");
  };

	function onAcceptDecline(){
		postApproveWorker.setRefetch({
			id: props.route.params.from == "rekomendasi" ? getJobs.data.data?.application[0].id : "",
			is_approve_worker: action == 'accept' ? 1 : -1,
		})
	}

  const ModalCustomButton = (props) => {
    // const router = useRouter();
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          flex: 1,
          alignSelf: "stretch",
          justifyContent: "center",
        }}>
        <Button
          onPress={() => setModalVisible(false)}
          title={"Tidak"}
          style={{ flex: 1 }}
          outline/>
        <Button
          onPress={() => onAcceptDecline()}
          title={
            action == "accept" ? "Terima"
						: action == "decline" ? "Tolak"
						: null
          }
          style={{ flex: 1 }}
        />
      </View>
    );
  };

	function recommendationAction(action){
		setAction(action)
		setModalVisible(true)
	}

  return (
    <View style={{ flex: 1, }}>
      {/* <Stack.Screen
        options={{
          header: () => null,
        }}
      /> */}
      <View
        style={{
          backgroundColor: "white",
          height: useSafeAreaInsets().top,
          width: "100%",
          zIndex: 11,
          position: "absolute",
          top: 0,
        }}/>

      <View style={{ flex: 1, }}>
        <ScrollView
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl
              refreshing={getJobs.isLoading}
              onRefresh={() => getJobs.refetch()}/>
          }
          style={{ backgroundColor: "white", position: "relative" }}>

          <View style={{ paddingVertical: SIZES.medium }}>
            <Header backButton title={getJobs.data.data?.company.name} navigation={props.navigation}/>
          </View>

          <View style={styles.secondaryContainer}>
            <View style={styles.headContainer}>
              {
								getJobs.isLoading ?
                	<Skeleton
                  	width={SIZES.medium * 5}
                  	height={SIZES.medium * 5}
                  	borderRadius={SIZES.xSmall}/>
              	:
                <View style={styles.avatarContainer}>
                  {
										getJobs.data.data?.image.length > 0 ?
                    	<Image
                      	source={{
                        	uri: `${base.host}/image/jobs?file_name=${getJobs.data.data?.image[0].file_name}&rnd=${moment().format("YYYYMMDDHHmmss")}`,
                      	}}
                      	style={{
                        	width: SIZES.medium * 5,
                        	height: SIZES.medium * 5,
                      	}}
                      	resizeMode="contain"/>
                    :
                      <Image
                        source={logo}
                        style={{ width: SIZES.medium * 5 }}
                        resizeMode="contain"
                        resizeMethod="auto"/>
                  }
                </View>
              }

              <View>
                {
									(getJobs.data.data?.application[0] == null || getJobs.data.data?.application.is_approve_worker != 1) &&
									getJobs.data.data?.is_urgent == 0 ?
										null
									:
                  	<View
                    	style={[
                      	styles.urgentBadge,
                      	{
                        	backgroundColor:
                          	getJobs.data.data?.application.length > 0 && getJobs.data.data?.application[0].is_approve_worker == 1 ? "green"
                            : getJobs.data.data?.is_urgent == 1 ? "red" : null,
                      	},
                    	]}>
                    	<Text style={styles.urgentBadgeText}>
                      	{
                          getJobs.data.data?.application.length > 0 && getJobs.data.data?.application[0].is_approve_worker == 1 ? "Telah Dilamar"
                        	: getJobs.data.data?.is_urgent == 1 ? "Urgent" : null
                        }
                    	</Text>
                  	</View>
                }
                {
									getJobs.isLoading ?
                  	<Skeleton
                    	negWidth={SIZES.xSmall * 14}
                    	height={SIZES.medium * 2}
                    	borderRadius={SIZES.xSmall}/>
                	:
                  	<Text style={styles.jobTitle} ellipsizeMode="tail">
                    	{getJobs.data.data?.name}
                  	</Text>
                }

                {
									getJobs.isLoading ?
                  	<Skeleton
                    	negWidth={SIZES.xSmall * 14 * 2}
                    	height={SIZES.medium * 1.5}
                    	borderRadius={SIZES.xSmall}/>
                	:
                  	<View style={{ flexDirection: "row", alignItems: "center" }}>
                    	<MaterialCommunityIcons
                      	name="map-marker"
                      	size={16}
                      	color={COLORS.secondary}
                    	/>
                    	<Text style={styles.jobLocation}>
                      	{getCity.data.data?.name}, Indonesia
                    	</Text>
                  	</View>
                }
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: SIZES.large,
                marginBottom: SIZES.xxLarge,
              }}>
              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {
									getJobs.isLoading ?
                  	<Skeleton
                    	width={SIZES.xSmall * 10}
                    	height={SIZES.xLarge - 2}
                    	borderRadius={SIZES.xSmall}
                  	/>
                	:
                  	<Text style={FONTSTYLES.sBold12_secondary}>
                    	{getJobs.data.data?.salary_casual_format}
                  	</Text>
                }
                <Text style={FONTSTYLES.med10_gray}>GAJI</Text>
              </View>

              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {
									getJobs.isLoading ?
                  	<Skeleton
                    	width={SIZES.xSmall * 10}
                    	height={SIZES.xLarge - 2}
                    	borderRadius={SIZES.xSmall}/>
                	:
                  	<Text style={FONTSTYLES.sBold12_secondary}>
                    	{
												shiftStartDateMoment.isSame(shiftEndDateMoment, 'month') ?
													shiftStartDateMoment.format("DD") + shiftEndDateMoment.format(" - DD MMMM YYYY")
                      	:
												shiftStartDateMoment.format("DD MMM") + shiftEndDateMoment.format(" - DD MMM YYYY")
											}
                  	</Text>
                }
                <Text style={FONTSTYLES.med10_gray}>TANGGAL</Text>
              </View>

              <View style={{ flexGrow: 1, alignItems: "center" }}>
                {
									getJobs.isLoading ?
                  	<Skeleton
                    	width={SIZES.xSmall * 10}
                    	height={SIZES.xLarge - 2}
                    	borderRadius={SIZES.xSmall}/>
                	:
                  <Text style={FONTSTYLES.sBold12_secondary}>
                    Pk.{shiftStartDateMoment.format("HH.mm")} - {shiftEndDateMoment.format("HH.mm")}
                  </Text>
                }
                <Text style={FONTSTYLES.med10_gray}>WAKTU</Text>
              </View>
            </View>

            <View
              style={{
                height: viewHeight + 42,
                marginHorizontal: -SIZES.xLarge,
                backgroundColor: COLORS.lightWhite2,
              }}>
              <Tab.Navigator
                tabBar={(props) => <CustomTopTabBar {...props} />}
                sceneContainerStyle={{ backgroundColor: COLORS.lightWhite }}
                screenOptions={{
                  swipeEnabled: false,
                }}>

                <Tab.Screen name="Info Pekerjaan" options={{ lazy: true }}>
                  {({ props }) => (
                    <InfoPekerjaan
                      {...props}
                      onStateChange={setViewHeight}
                      data={getJobs.data.data}
                      isLoading={getJobs.isLoading}
                    />
                  )}
                </Tab.Screen>

                <Tab.Screen name="Perusahaan" options={{ lazy: true }}>
                  {({ props }) => (
                    <Perusahaan
                      {...props}
                      onStateChange={setViewHeight}
                      data={getJobs.data.data}
                      isLoading={getJobs.isLoading}
                    />
                  )}
                </Tab.Screen>

              </Tab.Navigator>
            </View>
          </View>

        </ScrollView>

        {
					!getJobs.isLoading &&
          <View>
            {
							(props.route.params.from == "home" || props.route.params.from == "rekomendasi-semua") && getIsRecommendation.data.data == null &&
              <View style={{ padding: 16, backgroundColor: COLORS.lightWhite }}>
                <Button
                  title={getJobsApplication.data.data?.length > 0 ? "Anda telah melamar" : "Lamar"}
                  style={{ height: 30 }}
                  disable={getJobsApplication.data.data?.length > 0}
                  onPress={() => props.navigation.navigate('JobDetail', {screen: 'Apply', params: {jobs_id: getJobs.data.data?.id, }})}/>
              </View>
            }

            {
							(props.route.params.from == "rekomendasi" || getIsRecommendation.data.data != null) &&
              <View style={{ padding: 16, backgroundColor: COLORS.lightWhite }}>
                <Button
                  title={"Terima Tawaran"}
                  style={{ height: 30, marginBottom: 12 }}
                  onPress={() => recommendationAction('accept')}/>
                <Button
                  title={"Tolak Tawaran"}
                  style={{ height: 30 }}
                  outline
                  onPress={() => recommendationAction('decline')}/>
              </View>
            }
          </View>
        }
        <Modals
          title={
            "Apakah anda yakin ingin\n" +
            (
							action == "accept" ? "menerima"
              : action == "decline" ? "menolak"
              : null
						) + " tawaran ini?"
          }
          titleSmall
          svg={svg_sentIllustration}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          customButton={<ModalCustomButton />}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  secondaryContainer: {
    borderTopStartRadius: SIZES.xLarge,
    borderTopEndRadius: SIZES.xLarge,
    backgroundColor: COLORS.lightWhite,
    padding: SIZES.xLarge,
    zIndex: 10,
  },
  headContainer: {
    flexDirection: "row",
    gap: SIZES.xSmall,
    alignItems: "flex-start",
  },
  avatarContainer: {
    backgroundColor: COLORS.white,
    width: SIZES.medium * 5,
    height: SIZES.medium * 5,
    borderRadius: SIZES.xSmall,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsContainer: {
    minHeight: "100%",
  },
  jobTitle: {
    width: Dimensions.get("window").width - SIZES.xSmall * 14,
    fontSize: 18,
    fontFamily: FONTS.semibold,
  },
  jobLocation: {
    color: COLORS.secondary,
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.medium,
    lineHeight: SIZES.xLarge,
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
});
