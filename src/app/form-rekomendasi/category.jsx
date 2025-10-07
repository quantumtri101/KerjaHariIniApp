import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Header, Skeleton } from "../../components";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { svg_courier, svg_hospitality } from "../../assets";
import useFetch from "../../hook/useFetch";
import Base from "../../utils/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import "moment/locale/id";

export default function FormRekomendasiCategory(props) {
	var base = new Base()

  const { data, isLoading, error, refetch, fetchData } = useFetch(
    "GET",
    "category/all",
    {},
    false
  );
  const [itemData] = useState([
    { icon: svg_courier, title: "Kurir Logistik" },
    { icon: svg_hospitality, title: "Hospitality" },
  ]);
  const [tmpData, setTmpData] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    refetch();
		AsyncStorage.setItem('lastRequirementPage', 'Category')
  }, []);

  useEffect(() => {
    if (data.status != null) {
      if (data.status == "success") {
        setTmpData(data.data);
      } else ToastAndroid.show(data.message, ToastAndroid.SHORT);
    }
  }, [data]);

  const handleButton = async () => {
    if (category.id == null)
      ToastAndroid.show("Category is Empty", ToastAndroid.SHORT);
    else {
      await AsyncStorage.setItem("category", JSON.stringify(category));
			props.navigation.navigate('FormRekomendasi', {screen : 'Position', params: {category: category.id, }, })
    }
  };
  const skeleton = [];

  for (let i = 0; i < 9; i++) {
    skeleton.push(
      <View key={i}>
        <Skeleton width={130} height={130} borderRadius={8} />
        <Skeleton
          width={130}
          height={22}
          borderRadius={8}
          style={{ marginTop: SIZES.small }}
        />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={{ }}>
        <Header backButton title={" "} navigation={props.navigation}/>
      </View>
      <Text style={[FONTSTYLES.h1, { paddingHorizontal: SIZES.xLarge }]}>
        <Text style={{ color: COLORS.primary }}>Kategori Pekerjaan{"\n"}</Text>
        Apa yang Anda{"\n"}sedang cari ?
      </Text>
      <ScrollView style={styles.mainContainer}>
        <View style={{ flex: 1, paddingHorizontal: SIZES.xLarge }}>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "flex-start",
              marginTop: SIZES.xLarge,
            }}
          >
            {isLoading
              ? skeleton
              : tmpData.map((item, index) => (
                  <Pressable onPress={() => setCategory(item)} key={index}>
                    <View
                      style={[
                        styles.itemSvgContainer,
                        { borderColor: item.name == category.name ? COLORS.primary : "white", },
                      ]}
                    >
                      {item.file_name != null ? (
                        <Image
                          source={{
                            uri: `${base.host}/image/category?file_name=${
                              item.file_name
                            }&rnd=${moment().format("YYYYMMDDHHmmss")}`,
                          }}
                          style={{ height: 80, width: 80 }}
                        />
                      ) : (
                        <ActivityIndicator size={24} color={COLORS.primary} />
                      )}
                      {/* <LocalSvg asset={item.icon} width={80} height={80} /> */}
                      <Icon
                        name={
                          item.name == category.name
                            ? "radio-button-on"
                            : "radio-button-off"
                        }
                        size={16}
                        color={
                          item.name == category.name ? COLORS.primary : "black"
                        }
                        style={{ position: "absolute", top: 12, right: 12 }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.itemTitle,
                        {
                          color:
                            item.name == category.name
                              ? COLORS.primary
                              : "black",
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                ))}
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: SIZES.medium, backgroundColor: "white" }}>
        {
          isLoading ?
            <ActivityIndicator
              size={"large"}
              style={{ marginTop: SIZES.large }}
              color={COLORS.primary}
            />
          :
            <Button
              title={"Mulai"}
              onPress={() => handleButton()}
              disable={category == "" ? true : false}
            />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  itemSvgContainer: {
    minWidth: 130,
    minHeight: 130,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: SIZES.medium,
  },
  itemTitle: {
    ...FONTSTYLES.p,
    textAlign: "center",
    paddingVertical: SIZES.small,
  },
});
