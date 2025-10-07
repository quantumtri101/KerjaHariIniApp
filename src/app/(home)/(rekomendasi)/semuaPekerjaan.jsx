import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Skeleton, TextField } from "../../../components";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../../constants";
import { LocalSvg } from "react-native-svg/css";
import { search_config } from "../../../assets";
import { Pressable } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useFetch from "../../../hook/useFetch";
import moment from "moment";
import "moment/locale/id";
import Base from "../../../utils/base";

export default function SemuaPekerjaan(props) {
	var base = new Base()
  const [filter_subCategory, setFilter_subCategory] = useState("");
  const [search, setSearch] = useState("");
  const [arrJobs, setArrJobs] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [fromSystem, setFromSystem] = useState(true);
  const getProfile = useFetch("GET", "auth/profile", {});
  const getAllJobs = useFetch(
    "GET",
    "jobs?api_type=recommendation&is_live_app=1&is_approve=1&staff_type=open" + 
      "&sub_category_id=" + filter_subCategory +
      "&name=" + search +
      "&filter=job_not_started",
    {},
    false
  );
  const getSubCategory = useFetch("GET", "sub-category", {});
  const Item_horizontalFlatList = ({ item, index, active }) => {
    return (
      <TouchableOpacity key={index} onPress={() => setFilter_subCategory(filter_subCategory != item.id ? item.id : '')}>
        <View style={{ alignItems: "center" }}>
          <View
            style={[
              styles.horizontalItemIcon,
              {
                backgroundColor: index % 2 === 0 ? COLORS._coolToneBlue_alt2 : COLORS._coolToneBlue,
              },
            ]}
          >
            {
              item.file_name == null ?
                <MaterialIcons
                  name="category"
                  size={SIZES.xLarge}
                  color={COLORS.white}
                />
              :
                <Image
                  source={{ uri: `${base.host}/image/sub-category?file_name=${item.file_name}`,}}
                  style={{ width: SIZES.xLarge, height: SIZES.xLarge }}
                />
            }
          </View>
          <Text
            ellipsizeMode="tail"
            style={[
              styles.horizontalItemTitle,
              {
                color: active == item.id ? COLORS.text_darkBlue : COLORS.rockBlue,
              },
            ]}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if(getAllJobs.data.status != null){
      if(getAllJobs.data.status == 'success'){
        var arr = arrJobs.map((x) => x)
        for(let data of getAllJobs.data.data){
          for(let shift of data.shift){
            shift.start_date_moment = moment(shift.start_date)
            shift.end_date_moment = moment(shift.end_date)
          }
          arr.push(data)
        }
        setArrJobs(arr)
      }
      else
        base.alertSnackbar(getAllJobs.data.message)
      setFromSystem(false)
    }
  }, [getAllJobs.data]);

  useEffect(() => {
    onRefreshed()
  }, [filter_subCategory, ])

  useEffect(() => {
    if(!fromSystem){
      if(searchTimeout != null)
        clearTimeout(searchTimeout)

      setSearchTimeout(
        setTimeout(() => {
          onRefreshed()
        }, base.searchWaitTimeout)
      )
    }
  }, [search, ])

  function onRefreshed(){
    setArrJobs([])
    getAllJobs.refetch()
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          padding: SIZES.medium,
          gap: SIZES.xSmall,
        }}
      >
        <TextField
          search
          placeholder={"Pencarian"}
          containerStyle={{ flex: 1 }}
          onChangeText={(text) => setSearch(text)}
          value={search}
        />
      </View>
      
      <View>
        <Text style={styles.kategoriTitle}>Kategori Pekerjaan</Text>
        <FlatList
          data={getSubCategory.data.data}
          renderItem={({ item, index }) =>
            getSubCategory.isLoading ?
              <View>
                <Skeleton
                  width={SIZES.medium * 3.25}
                  height={SIZES.medium * 3.25}
                  borderRadius={SIZES.medium}
                />
                <Skeleton
                  width={SIZES.medium * 3.25}
                  height={SIZES.medium}
                  style={{ marginTop: SIZES.small }}
                />
              </View>
            :
              <Item_horizontalFlatList
                item={item}
                key={index}
                active={filter_subCategory}
              />
          }
          ListHeaderComponent={() => <View style={{ width: SIZES.medium }} />}
          ListFooterComponent={() => <View style={{ width: SIZES.medium }} />}
          ItemSeparatorComponent={() => <View style={{ width: SIZES.medium }} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: SIZES.medium }}
        />
      </View>

      {
        arrJobs.length == 0 ?
        <Text style={[styles.empty, {marginHorizontal: 0, }]}>
          Belum ada pekerjaan untuk anda saat ini
        </Text>
        :
        <FlatList
          ListHeaderComponent={() => <View style={{ height: SIZES.medium }} />}
          ListFooterComponent={() => <View style={{ height: SIZES.medium }} />}
          ItemSeparatorComponent={() => <View style={{ height: SIZES.medium }} />}
          refreshControl={
            <RefreshControl
              refreshing={getAllJobs.isLoading}
              onRefresh={() => onRefreshed()}
            />
          }
          data={arrJobs}
          renderItem={({ item, index }) =>
            getAllJobs.isLoading ?
              <Skeleton
                negWidth={SIZES.medium * 2}
                height={157}
                borderRadius={SIZES.medium / 2}
                style={{ marginHorizontal: SIZES.medium }}
              />
            :
              <Card.Jobs
                data={item}
                key={index}
                navigation={props.navigation}
                from={"rekomendasi-semua"}
                userID={getProfile.data.data?.id}
              />
          }
          style={{ flex: 1, backgroundColor: COLORS.white }}
        />
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FONTSTYLES.topTabBar_Active,
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.xSmall,
  },
  kategoriTitle: {
    ...FONTSTYLES.sBold14_222,
    color: COLORS._coolToneBlue_alt1,
    paddingHorizontal: SIZES.medium,
  },
  horizontalItemIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: SIZES.medium,
  },
  horizontalItemTitle: {
    maxWidth: 52,
    fontFamily: FONTS.semibold,
    fontSize: SIZES.small,
    lineHeight: SIZES.medium,
    marginTop: SIZES.small,
  },
  empty: {
    ...FONTSTYLES.p_black_12,
    paddingHorizontal: SIZES.medium,
  },
});
