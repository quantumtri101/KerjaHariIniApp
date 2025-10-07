import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, FlatList, TouchableNativeFeedback, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Header, SearchCheckboxList, SearchCheckboxList2, TextField, RadioButton } from '../../components'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useFetch from '../../hook/useFetch'

export default function FormRekomendasiPosition(props) {
  const [selected, setSelected] = useState([])
  const [arr, setArr] = useState([])
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
	const [url, setUrl] = useState("");
  const { data, isLoading, error, refetch, setFetchUrl, } = useFetch("GET", "sub-category?category_id=" + props.route.params.category, {}, false);

  useEffect(() => {
    refetch(page, search)
  }, [page, search,])

	useEffect(() => {
		AsyncStorage.setItem('lastRequirementPage', 'Position')
	}, [])

  useEffect(() => {
    if(data.status != null){
      if (data.status == "success") {
        var arrTemp = JSON.parse(JSON.stringify(arr))
        for(let data1 of data.data)
          arrTemp.push(data1)
        setArr(arrTemp)
      }
      else
        ToastAndroid.show(data.message, ToastAndroid.SHORT)
    }
  }, [data,])

  const handleButton = async () => {
    if (selected.length == 0) {
      ToastAndroid.show('Silahkan pilih terlebih dahulu', ToastAndroid.SHORT)
    } else {
      await AsyncStorage.setItem('arr_sub_category', JSON.stringify(selected))
			props.navigation.navigate('FormRekomendasi', {screen : 'Location', params: {}, })
    }
  }

  function onSearched1(search1){
    setArr([])
    setSearch(search1)
    setPage(1)
  }

  return (
    <View style={styles.mainContainer}>
      <View style={{ }}>
        <Header backButton title={' '} navigation={props.navigation}/>
      </View>
      <Text style={[FONTSTYLES.h1, { paddingHorizontal: SIZES.xLarge }]}>
        <Text style={{ color: COLORS.primary }}>Pekerjaan </Text>
        apa yang{'\n'}sedang anda cari ?
      </Text>
      <View style={[styles.mainContainer, { paddingHorizontal: SIZES.small }]}>
        <SearchCheckboxList inputData={arr} getSelectedValue={(v) => setSelected(v)} searchType="online" onSearched={(search1) => onSearched1(search1)}/>
      </View>
      <View style={{ padding: SIZES.medium, backgroundColor: 'white' }} >
        {isLoading ?
          <ActivityIndicator size={'large'} style={{ marginTop: SIZES.large }} color={COLORS.primary} />
          :
          <Button title={'Lanjut'} onPress={handleButton} />
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  itemSvgContainer: {
    minWidth: 130,
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: SIZES.medium
  },
  itemTitle: {
    ...FONTSTYLES.p,
    textAlign: 'center',
    paddingVertical: SIZES.small
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
})