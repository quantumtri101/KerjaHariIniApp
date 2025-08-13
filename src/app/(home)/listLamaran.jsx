import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
import Header from "../../components/common/header/header";
import { Badge, Skeleton, TextField } from "../../components";
// import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "../../hook/useFetch";
import moment from "moment";
import "moment/locale/id";
import { logo } from "../../assets";
import { useEffect, useState, } from "react";
import Base from "../../utils/base";

export default function ListLamaran(props) {
	var base = new Base()
  const data = [
    "Accepted",
    "Rejected",
    "Waiting",
    "Interview",
    "Working",
    "Completed",
  ];
  const preloaddata = ["", "", "", "", "", ""];
	const [arr, setArr] = useState([])

  // const router = useRouter();
  // const { refresh } = useLocalSearchParams();
  const getApplication = useFetch("GET", "jobs/application", {});

  useEffect(() => {
		if(getApplication.data.status != null){
      if(getApplication.data.status == 'success'){
			  setArr(getApplication.data.data)
      }
      else
        base.alertSnackbar(getApplication.data.message)
		}
  }, [getApplication.data, ]);

  const Preloader = () => {
    return (
      <View
        style={{
          gap: SIZES.small + 2,
          flexDirection: "row",
          height: SIZES.medium * 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Skeleton
          width={SIZES.large * 2 + 2}
          height={SIZES.large * 2 + 2}
          borderRadius={SIZES.medium / 2}
        />
        <View style={{ flexShrink: 1 }}>
          <Skeleton
            negWidth={SIZES.small * 15.5}
            height={SIZES.medium + 2}
            borderRadius={SIZES.medium / 2}
          />
          <Skeleton
            negWidth={SIZES.small * 15.5 * 2}
            height={SIZES.small + 2}
            borderRadius={SIZES.medium / 2}
          />
        </View>
        <Skeleton
          width={SIZES.medium * 5}
          height={SIZES.xSmall * 2.5}
          borderRadius={SIZES.medium * 5}
        />
      </View>
    );
  };

  const RenderItem = (props) => {

    return (
      <TouchableNativeFeedback
				onPress={() => props.navigation.navigate('ApplyDetail', {screen: 'ApplyDetail', params: {id: props.item.id, status: props.item.status, }})}>
        <View key={props.index} style={styles.itemContainer}>
          <View style={styles.itemAvatarContainer}>
						{
							props.item.jobs.image != null && props.item.jobs.image.length > 0 ?
								<Image
									source={{
										uri: `${base.host}/image/jobs?file_name=${props.item.jobs.image[0].file_name}&rnd=${moment().format("YYYYMMDDHHmmss")}`,
									}}
									style={{ width: 42, height: 42 }}
									resizeMode="contain"/>
							:
								<Image
									source={logo}
									style={{ width: 42 }}
									resizeMode="contain"
									resizeMethod="auto"/>
						}
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.jobTitle}>
              {props.item.jobs.name}
            </Text>
            <Text style={styles.date}>
              {moment(props.item.created_at).format("DD/MM/YYYY[ Pk. ]HH.mm")}
            </Text>
          </View>
          <View style={styles.badgeContainer}>
            {
							props.item.status == "expired" ?
              	<Badge.Expired />
            	: props.item.status == "accepted" ?
              	<Badge.Accepted />
            	: props.item.status == "declined" ?
              	<Badge.Rejected />
            	: props.item.status == "wait" ?
              	<Badge.Waiting />
            	: props.item.status == "interview" ?
              	<Badge.Interview />
            	: props.item.status == "working" ?
              	<Badge.Working />
            	: props.item.status == "done" ?
              	<Badge.Completed />
            	: null
						}
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  };

  return (
    <View
      style={[styles.mainContainer, {  }]}
    >
      <Header noInsets withNotif title={"List Lamaran"} navigation={props.navigation}/>
			{
				getApplication.isLoading ?
					<Preloader/>
				: arr.length == 0 ?
          <Text style={[styles.empty, {marginHorizontal: 0, }]}>Anda belum melamar pekerjaan untuk saat ini</Text>
        :
      		<FlatList
        		data={arr}
        		ListHeaderComponentStyle={{ padding: SIZES.medium }}
        		ItemSeparatorComponent={<View style={{ height: 1, marginHorizontal: SIZES.medium, backgroundColor: "#EAEAEA", }}/>}
						keyExtractor={(item) => item.id}
        		refreshControl={<RefreshControl refreshing={getApplication.isLoading} onRefresh={() => getApplication.refetch()}/>}
        		renderItem={(item, index) => <RenderItem item={item.item} index={item.index} navigation={props.navigation}/>}/>
			}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  itemContainer: {
    gap: SIZES.xSmall,
    flexDirection: "row",
    height: SIZES.medium * 5,
    padding: SIZES.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  itemAvatarContainer: {
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZES.medium / 2,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  jobTitle: {
    ...FONTSTYLES.sBold14_222,
    color: COLORS.gray_22,
    flexShrink: 0,
  },
  date: {
    color: "#AAA",
    fontSize: SIZES.xSmall,
    fontFamily: FONTS.regular,
    lineHeight: 14,
  },
  badgeContainer: {
    flexGrow: 1,
    alignItems: "flex-end",
  },
  empty: {
    ...FONTSTYLES.p_black_12,
    paddingHorizontal: SIZES.medium,
  },
});
