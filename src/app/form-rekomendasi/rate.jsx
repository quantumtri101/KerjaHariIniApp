import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, FlatList, TouchableNativeFeedback, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button, Header, RadioButtonList, SearchCheckboxList } from '../../components'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import Icon from 'react-native-vector-icons/MaterialIcons';
import useFetch from '../../hook/useFetch'
import { formatCurrency } from '../../utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios";

const CheckBoxItem = ({ item, onChange, selected }) => {
  return (
    <View style={{ borderRadius: SIZES.medium / 2, overflow: 'hidden', backgroundColor: COLORS.lightWhite }}>
      <TouchableNativeFeedback onPress={() => onChange(item)}>
        <View style={{ padding: SIZES.medium, flexDirection: 'row', gap: SIZES.large, alignItems: 'center' }}>
          <Icon name={selected.id == item.id ? 'radio-button-on' : 'radio-button-off'} size={SIZES.large} color={selected.id == item.id ? COLORS.primary : COLORS.rockBlue} />
          <Text style={FONTSTYLES.p_black_12}>{formatCurrency(item.min_salary) + ' - ' + formatCurrency(item.max_salary)}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default function FormRekomendasiRate(props) {
  const { data, isLoading, error, refetch } = useFetch("GET", "range-salary/all?file_name=", {});
  const dataPost = useFetch("POST", "jobs/recommendation", {}, false);
  const [selected, setSelected] = useState({})

  useEffect(() => {
    if(dataPost.data != null){
      if(dataPost.data.status == 'success'){
        AsyncStorage.removeItem('arr_sub_category')
        AsyncStorage.removeItem('arr_city')
				props.navigation.navigate('FormRekomendasi', {screen : 'Finish', params: {}, })
      }
      else
        console.log('DATA POST', dataPost.data.message)
    }
    else
      console.log("Server Error")
  }, [dataPost.data,])

	useEffect(() => {
		AsyncStorage.setItem('lastRequirementPage', 'Rate')
	}, [])

  const handleSaveButton = async (buttonAction) => {
    if (buttonAction == 'Lanjut' && selected.id == null) {
      ToastAndroid.show('Silahkan pilih terlebih dahulu', ToastAndroid.SHORT)
    } else {
      var arr_sub_category = await AsyncStorage.getItem('arr_sub_category')
      var arr_city = await AsyncStorage.getItem('arr_city')
      var arr_city1 = []
      var arr_sub_category1 = []

      arr_sub_category = JSON.parse(arr_sub_category)
      arr_city = JSON.parse(arr_city)
      for(let sub_category of arr_sub_category)
        arr_sub_category1.push({id: sub_category.id})
      for(let city of arr_city)
        arr_city1.push({id: city.id})

      var bodyPost = {
        arr_city: arr_city1,
        arr_sub_category: arr_sub_category1,
        jobs_range_salary_id: ''
      }
      if(selected.id != null)
        bodyPost.jobs_range_salary_id = selected.id

      console.log('bodyPost', bodyPost)

      dataPost.setRefetch(bodyPost)
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={{ }}>
        <Header backButton title={' '} navigation={props.navigation}/>
      </View>
      <Text style={[FONTSTYLES.h1, { paddingHorizontal: SIZES.xLarge }]}>
        <Text style={{ color: COLORS.primary }}>Range Gaji {'\n'}</Text>
        yang diharapkan
      </Text>
      <View style={[styles.mainContainer, { paddingHorizontal: SIZES.small }]}>
        {
          isLoading ?
          <ActivityIndicator size={'large'} color={COLORS.primary} />
          :
          <View style={{ flex: 1, padding: 10 }}>
            <FlatList
              data={data.data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <CheckBoxItem item={item} onChange={(v) => setSelected(v)} selected={selected} />
              )}
              ItemSeparatorComponent={<View style={{ height: SIZES.medium / 2 }} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        }
      </View>
      <View style={{ padding: SIZES.medium, backgroundColor: 'white' }} >
        {
          dataPost.isLoading || isLoading ?
          <ActivityIndicator size={'large'} color={COLORS.primary} />
          :
          <View>
            <Button title={'Lewati'} outline onPress={() => handleSaveButton('Lewati')} style={{ marginBottom: SIZES.medium }} />
            <Button title={'Lanjut'} onPress={() => handleSaveButton('Lanjut')} />
          </View>
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