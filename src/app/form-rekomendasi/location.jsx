import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  TouchableNativeFeedback,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Header,
  SearchCheckboxList,
  TextField,
} from "../../components";
import { COLORS, FONTS, FONTSTYLES, SIZES } from "../../constants";
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "../../hook/useFetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "@expo/vector-icons/MaterialIcons";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Location(props) {
  // const router = useRouter();
  // const params = useLocalSearchParams();

  const [filteredData, setFilteredData] = useState();
  const [selected, setSelected] = useState([]);
  const [arr, setArr] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useFetch(
    "GET",
    "city",
    {},
    false
  );

  useEffect(() => {
    refetch(page, search);
  }, [page, search]);

	useEffect(() => {
		AsyncStorage.setItem('lastRequirementPage', 'Location')
	}, [])

  useEffect(() => {
    if (data.status != null) {
      if (data.status == "success") {
        var arrTemp = JSON.parse(JSON.stringify(arr));
        for (let data1 of data.data) arrTemp.push(data1);
        setArr(arrTemp);
      } else ToastAndroid.show(data.message, ToastAndroid.SHORT);
    }
  }, [data]);

  // useEffect(() => {
  // !isLoading && setFilteredData(data.data)
  // },[data])

  const handleButton = async () => {
    // console.log(selectedMemoized)
    if (selected.length == 0) {
      ToastAndroid.show("Silahkan pilih terlebih dahulu", ToastAndroid.SHORT);
    } else {
      await AsyncStorage.setItem("arr_city", JSON.stringify(selected));
			props.navigation.navigate('FormRekomendasi', {screen : 'Rate', params: {}, })
      // router.push("/form-rekomendasi/rate");
    }
  };

  function onSearched1(search1) {
    setArr([]);
    setSearch(search1);
    setPage(1);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={{ paddingVertical: SIZES.medium }}>
        <Header backButton title={" "} navigation={props.navigation}/>
      </View>
      <Text style={[FONTSTYLES.h1, { paddingHorizontal: SIZES.xLarge }]}>
        <Text style={{ color: COLORS.primary }}>Lokasi Kerja {"\n"}</Text>
        yang diharapkan
      </Text>
      <View style={[styles.mainContainer, { paddingHorizontal: SIZES.small }]}>
        {/* {!isLoading &&

        } */}

        <SearchCheckboxList
          inputData={arr}
          searchType="online"
          getSelectedValue={(v) => setSelected(v)}
          onEndReached={() => setPage(page + 1)}
          onSearched={(search1) => onSearched1(search1)}
        />
        {/* {!isLoading &&
          <View style={{ flex: 1, padding: 10 }}>
            <FlatList
              ListHeaderComponent={
                <TextField
                  search
                  style={styles.searchInput}
                  placeholder="Cari"
                  value={searchText}
                  onChangeText={(value) => setSearchText(value)}
                  containerStyle={{ backgroundColor: 'white' }}
                />
              }
              stickyHeaderIndices={[0]}
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ borderRadius: SIZES.medium / 2, overflow: 'hidden', backgroundColor: COLORS.lightWhite }}>
                  <TouchableNativeFeedback onPress={() => setSelected(item.id)}>
                    <View style={{ padding: SIZES.medium, flexDirection: 'row', gap: SIZES.large, alignItems: 'center' }}>
                      <Icon name={selected.includes(item?.id) ? 'check-box' : 'check-box-outline-blank'} size={SIZES.large} color={selected.includes(item?.id) ? COLORS.primary : COLORS.rockBlue} />
                      <Text style={FONTSTYLES.p_black_12}>{item.name}</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}
              ListEmptyComponent={<Text style={FONTSTYLES.p}>Hasil Tidak Ditemukan</Text>}
              ItemSeparatorComponent={<View style={{ height: SIZES.medium / 2 }} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        } */}
      </View>
      <View style={{ padding: SIZES.medium, backgroundColor: "white" }}>
        {isLoading ? (
          <ActivityIndicator
            size={"large"}
            style={{ marginTop: SIZES.large }}
            color={COLORS.primary}
          />
        ) : (
          <Button title={"Lanjut"} onPress={handleButton} />
        )}
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
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  // mainContainer: {
  //   flex: 1,
  //   backgroundColor: 'white'
  // },
  // itemSvgContainer: {
  //   // flex: 1,
  //   // padding: SIZES.xLarge,
  //   minWidth: 130,
  //   minHeight: 130,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderWidth: 2,
  //   borderRadius: SIZES.medium
  // },
  // itemTitle: {
  //   ...FONTSTYLES.p,
  //   textAlign: 'center',
  //   paddingVertical: SIZES.small
  // },
  // searchInput: {
  //   height: 40,
  //   borderColor: 'gray',
  //   borderWidth: 1,
  //   paddingHorizontal: 10,
  //   marginBottom: 10,
  // },
});
