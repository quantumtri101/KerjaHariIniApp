import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Image,
} from "react-native";
import DeviceInfo from 'react-native-device-info';
import React, { useCallback, useEffect, useState } from "react";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
// import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/common/header/header";
import ModalPreloader from "../../components/common/PleaseWaitModal";
// import { useRouter, useFocusEffect } from "expo-router";
import useFetch from "../../hook/useFetch";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import { formatCurrency } from "../../utils";
import moment from "moment";
import "moment/locale/id";
import { LocalSvg } from "react-native-svg/css";
import { svg_avatar } from "../../assets";
import Base from "../../utils/base";

export default function Profile(props) {
	var base = new Base()
  // const router = useRouter();
  const [token, setToken] = useState(null);
  const { getItem, setItem } = useAsyncStorage("token");
	const menu = [
		{
			icon: "account",
			title: "Ganti Profile",
			onPress: () => props.navigation.navigate('Profile', {screen: 'MyProfile', params: {}}),
		},
		{
			icon: "lock",
			title: "Ganti Password",
			onPress: () => props.navigation.navigate('Profile', {screen: 'ChangePassProfile', params: { params_id: getProfile.data.data?.id, }}),
		},
		{
			icon: "qrcode",
			title: "Lihat QR Code Anda",
			onPress: () => props.navigation.navigate('Profile', {screen: 'MyQR', params: { }}),
		},
		{
			icon: "file",
			title: "Edit Resume",
			onPress: () => props.navigation.navigate('Resume', {screen: 'Review', params: {editResume: true, }}),
		},
		{
			icon: "history",
			title: "Syarat dan Ketentuan",
			onPress: () => props.navigation.navigate('Profile', {screen: 'TermCondition', params: { }}),
		},
		{
			icon: "history",
			title: "Privacy Policy",
			onPress: () => props.navigation.navigate('Profile', {screen: 'PrivacyPolicy', params: { }}),
		},
		{
			icon: "power",
			title: "Log Out",
			onPress: () => logout()
		},
	];

  const { data, isLoading, error, refetch } = useFetch(
    "POST",
    "auth/logout",
    {
      token: token,
    },
    false
  );

  const getProfile = useFetch("GET", "auth/profile", {});

	useEffect(() => {
    if(data.status != null){
      if (data.status == "success"){
        AsyncStorage.removeItem("token")
        props.navigation.replace('Auth', {screen: 'Login', params: {}})
      }
      else
        base.alertSnackbar(data.message)
    }
	}, [data]);

  const logout = async () => {
    refetch();
  }

  return (
    <View style={[styles.mainContainer, { marginTop: useSafeAreaInsets().top }]}>
      <Header noInsets withNotif title={"Profile"} navigation={props.navigation}/>
      <ScrollView style={{}}>
        <View style={styles.profileContainer}>
          {
						getProfile.data.data?.file_name == null ?
              <LocalSvg asset={svg_avatar} width={78} height={78} />
            :
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: `${base.host}/image/user?file_name=${
                      getProfile.data.data?.file_name
                    }&rnd=${moment().format("YYYYMMDDHHmmss")}`,
                  }}
                  style={{ width: 78, height: 78 }}/>
              </View>
					}
          <Text style={styles.username}>{getProfile.data.data?.name}</Text>
        </View>

        <View style={styles.earningContainer}>
          <TouchableOpacity
            onPress={() =>
							props.navigation.navigate('Earning', {screen: 'EarningIndex', params: { salary_balance: getProfile.data.data?.salary_balance, user_id: getProfile.data.data?.id, }})
            } style={{ flex: 1, }}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", }}>
              <View>
                <Text style={styles.akumulasiText}>Akumulasi Gaji</Text>
                <Text style={styles.earningText}>
                  {formatCurrency(getProfile.data.data?.salary_balance)}
                </Text>
              </View>
            
              <View style={styles.earningMore}>
                <MaterialCommunityIcons name={"eye"} size={18} color={"white"} />
                <Text style={styles.earnignMoreText}>Lihat lebih</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {
            menu.map((item, index) =>
              <View key={index}>
                <TouchableNativeFeedback onPress={item.onPress}>
                  <View style={styles.menuItemContainer} key={index}>
                    <View style={{ width: 20, height: 20 }}>
                      <MaterialCommunityIcons name={item.icon} size={20} color={COLORS.gray}/>
                    </View>
                    <Text style={FONTSTYLES.p_black_12}>{item.title}</Text>
                  </View>
                </TouchableNativeFeedback>
                
                { index < menu.length - 1 && <View style={styles.separator} /> }
              </View>
            )
          }
        </View>
        <Text style={styles.version}>Versi Aplikasi {DeviceInfo.getVersion()}</Text>
      </ScrollView>

      <ModalPreloader isModal={isLoading}/>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  username: {
    color: COLORS.secondary,
    fontFamily: FONTS.semibold,
    fontSize: 18,
    lineHeight: 27,
  },
  earningContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.small,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.xSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "#262E282A",
    elevation: 8,
  },
  akumulasiText: {
    ...FONTSTYLES.p_black_12,
    color: COLORS.white,
  },
  earningText: {
    height: SIZES.xLarge,
    verticalAlign: "middle",
    color: COLORS.white,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.medium,
    lineHeight: SIZES.xLarge,
    letterSpacing: 0.5,
  },
  earningMore: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SIZES.xSmall,
  },
  earnignMoreText: {
    color: COLORS.white,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.small,
  },
  menuContainer: {
    marginTop: SIZES.medium,
    paddingTop: SIZES.medium / 2,
    paddingBottom: 42,
    borderRadius: SIZES.xSmall,
    backgroundColor: COLORS.lightWhite2,
  },
  menuItemContainer: {
    height: SIZES.medium * 3.5,
    paddingLeft: SIZES.xSmall * 3,
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.xSmall,
  },
  separator: {
    height: 1,
    backgroundColor: "#0000001A",
    marginHorizontal: SIZES.medium,
  },
  version: {
    marginVertical: SIZES.medium * 3.5,
    color: COLORS.gray_22,
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
    opacity: 0.5,
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    gap: SIZES.xSmall,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  avatarContainer: {
    // backgroundColor: COLORS.secondary,
    borderRadius: 78,
    width: 78,
    height: 78,
    overflow: "hidden",
  },
});
