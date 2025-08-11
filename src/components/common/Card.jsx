import {
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
// import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React, { useEffect } from "react";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
import Base from "../../utils/base";
// import { useRouter } from "expo-router";
import moment from "moment";
import "moment/locale/id";
import useFetch from "../../hook/useFetch";
import { logo } from "../../assets/png";

const UrgentNeededJobs = ({ data, keys, userID, navigation, }) => {
	var base = new Base()
  // const router = useRouter();
  // console.log('UrgentData', data)
  // const getJobsImage = data.company.file_name == null ? null : useFetch('GET', 'image/company?file_name='+data.company.file_name, {})
  // console.log('data.application', data.application)
  useEffect(() => {
    // console.log('keys', keys)
    // console.log('userID', userID)
    // console.log('data application: ', data)
  }, []);

	function onDetail(){
		navigation.navigate('JobDetail', {screen: 'JobDetailIndex', params: {from: 'home', urgent: true, id: data.id, userID: userID,}, })
	}

  return (
    <View style={_unjs.touchableContainer} key={keys}>
      <TouchableNativeFeedback onPress={() => onDetail()}>
        <View style={_unjs.mainContainer}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                _unjs.urgentBadge,
                {
                  backgroundColor: data.application.length > 0 ? "green" : "red",
                },
              ]}>
              <Text style={_unjs.urgentBadgeText}>
                {/* data.application.user_id == userID ? */}
                {data.application.length > 0 ? "Telah Dilamar" : "Mendesak"}
              </Text>
            </View>
          </View>
          <View style={{
              flexDirection: "row",
              gap: SIZES.xSmall,
              alignItems: "center",
            }}>
            <View style={_unjs.clientAvatarContainer}>
              {
								data.image.length > 0 && data.image[0].file_name != null ?
              		<Image
                		source={{ uri: `${base.host}/image/jobs?file_name=${data.image[0].file_name}&rnd=${moment().format("YYYYMMDDHHmmss")}`, }}
                		style={{ width: '100%', height: '100%' }}
                		resizeMode="contain"/>
                :
                  <Image
                    source={logo}
                    style={{ width: SIZES.small * 3 }}
                    resizeMode="contain"/>
              }
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={_unjs.jobsTitle}>
              {data.name}
              {/* {data.id} */}
              {/* {data.company.file_name} */}
              {/* Doorbell 6 Jam di acara Pernikahan */}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: SIZES.xSmall / 2,
              alignItems: "center",
            }}>
            <MaterialCommunityIcons
              name="clock"
              size={SIZES.medium}
              color={COLORS.rockBlue}
            />
            <Text style={FONTSTYLES.reg12_rockBlue}>
              {/* Sabtu, 2 Jan 2023 | Pk. 09.00 */}
              {data.shift.length > 0 ? data.shift[0].start_date_moment.format("dddd, DD MMM YYYY | [Pk.] HH.mm") : '-'}
              {/* {moment(data.shift[0].end_date_format).format('dddd, DD MMM YYYY | [Pk.] HH.mm')} */}
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const _unjs = StyleSheet.create({
  touchableContainer: {
    borderRadius: SIZES.xSmall,
    overflow: "hidden",
  },
  mainContainer: {
    width: SIZES.xSmall * 23,
    gap: SIZES.xSmall,
    padding: SIZES.medium,
    backgroundColor: COLORS.lightWhite2,
    borderRadius: SIZES.xSmall,
  },
  urgentBadge: {
    flexShrink: 0,
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
  clientAvatarContainer: {
    backgroundColor: COLORS.white,
    width: SIZES.small * 3,
    height: SIZES.small * 3,
    borderRadius: SIZES.xSmall * 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  jobsTitle: {
    ...FONTSTYLES.sBold14_222,
    flexShrink: 1,
  },
});

const Jobs = ({ data, from, keys, userID, navigation, }) => {
  // const router = useRouter();
	var base = new Base()
  const getCity = useFetch("GET", "city?id=" + data.city_id, {});
  return (
    <View style={_jobs.touchableContainer} key={keys}>
      <TouchableNativeFeedback
        onPress={() => navigation.navigate('JobDetail', {screen: 'JobDetailIndex', params: {from: from, id: data.id, userID: userID,}, })}>
        <View style={_jobs.mainContainer}>
          {
            (data.application.length > 0 && data.application[0].is_approve_worker == 1 && data.is_urgent == 1) && 
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: SIZES.medium,
                paddingTop: SIZES.medium,
              }}
            >
              <View
                style={[
                  _jobs.urgentBadge,
                  {
                    backgroundColor:
                      data.application.length > 0 && data.application[0].is_approve_worker == 1 ? "green" 
                      : (data.is_urgent == 1 && "red"),
                  },
                ]}
              >
                <Text style={_jobs.urgentBadgeText}>
                  {
                    data.application.length > 0 && data.application[0].is_approve_worker == 1 ? "Telah Dilamar"
                    : data.is_urgent == 1 && "Mendesak"
                  }
                </Text>
              </View>
            </View>
          }
          <View
            style={[
              _jobs.titleContainer,
              {
                paddingTop:
                  data.application.length == 0 && data.is_urgent == 0
                    ? SIZES.medium
                    : SIZES.xSmall,
              },
            ]}
          >
            <View style={_jobs.clientAvatarContainer}>
              {
								data.image.length > 0 && data.image[0].file_name != null ?
                  <Image
                    source={{ uri: `${base.host}/image/jobs?file_name=${data.image[0].file_name}&rnd=${moment().format("YYYYMMDDHHmmss")}`, }}
                    style={{ width: SIZES.medium * 3, height: SIZES.medium * 3 }}
                    resizeMode="contain"/>
                :
                  <Image
                    source={logo}
                    style={{ width: SIZES.medium * 3 }}
                    resizeMode="contain"/>
              }
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={_jobs.jobsTitle}
            >
              {data.name}
              {/* Doorbell 6 Jam di acara Pernikahan */}
            </Text>
            <View style={{ flex: 1 }} />
            <View style={_jobs.rightArrowContainer}>
              <MaterialCommunityIcons
                name="chevron-right"
                size={SIZES.xLarge}
                color={COLORS.rockBlue}
              />
            </View>
          </View>
          <View style={_jobs.divider} />
          <View style={_jobs.detailContainer}>
            <View style={_jobs.detailContainerRow}>
              <MaterialCommunityIcons
                name="clock"
                size={SIZES.medium}
                color={COLORS.rockBlue}
              />
              <Text style={[FONTSTYLES.reg12_rockBlue, { color: COLORS.secondary }]}>
                {data.shift.length > 0 ? data.shift[0].start_date_moment.format("dddd, DD MMM YYYY | [Pk.] HH.mm") : '-'}
              </Text>
            </View>
            <View style={_jobs.detailContainerRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={SIZES.medium}
                color={COLORS.rockBlue}
              />
              <Text style={[FONTSTYLES.reg12_rockBlue, { color: COLORS.secondary }]}>
                {/* Hotel Marriott Surabaya */}
                {getCity.data.data?.name}
              </Text>
            </View>
            <View style={_jobs.detailContainerRow}>
              <MaterialCommunityIcons
                name="cash"
                size={SIZES.medium}
                color={COLORS.rockBlue}
              />
              <Text
                style={[FONTSTYLES.reg12_rockBlue, { color: COLORS.secondary }]}
              >
                Rp. {data.salary_casual.toLocaleString(base.priceFormatIDR)}
                {/* Rp. 3.500.000 */}
              </Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const _jobs = StyleSheet.create({
  touchableContainer: {
    marginHorizontal: SIZES.medium,
    borderRadius: SIZES.medium,
    overflow: "hidden",
  },
  mainContainer: {
    // gap: SIZES.xSmall,
    backgroundColor: COLORS.lightWhite2,
    borderRadius: SIZES.medium,
  },
  clientAvatarContainer: {
    backgroundColor: COLORS.white,
    width: SIZES.medium * 3,
    height: SIZES.medium * 3,
    borderRadius: SIZES.medium / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  jobsTitle: {
    ...FONTSTYLES.sBold14_222,
    color: COLORS.secondary,
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
  titleContainer: {
    paddingTop: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    flexDirection: "row",
    gap: SIZES.xSmall,
    alignItems: "center",
  },
  detailContainer: {
    paddingHorizontal: SIZES.medium,
    paddingBottom: SIZES.medium,
    gap: SIZES.medium / 4,
  },
  detailContainerRow: {
    flexDirection: "row",
    gap: SIZES.xSmall / 2,
    alignItems: "center",
  },
  urgentBadge: {
    flexShrink: 0,
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

export default {
  UrgentNeededJobs,
  Jobs,
};
