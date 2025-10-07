import { View, Pressable, Text, TextInput, FlatList, StyleSheet, TouchableNativeFeedback, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextField from "./TextField";


const CheckBoxItem = ({ item, onChange, selected }) => {
  return (
    <View style={{ borderRadius: SIZES.medium / 2, overflow: 'hidden', backgroundColor: COLORS.lightWhite }}>
      <TouchableNativeFeedback onPress={() => onChange(item.id)}>
        <View style={{ padding: SIZES.medium, flexDirection: 'row', gap: SIZES.large, alignItems: 'center' }}>
          <Icon name={selected ? 'check-box' : 'check-box-outline-blank'} size={SIZES.large} color={selected ? COLORS.primary : COLORS.rockBlue} />
          <Text style={FONTSTYLES.p_black_12}>{item.name}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const SearchCheckboxList2 = ({inputData, arrSelectedData}) => {
  const [data, setData] = useState(inputData);
  const [filteredData, setFilteredData] = useState(inputData);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    var arrSelectedDataTemp = []
    for(let temp of data){
      if(temp.is_selected == null)
        temp.is_selected = false

      if(temp.is_selected)
        arrSelectedDataTemp.push(temp)
    }
    setData(data)

    arrSelectedData(arrSelectedDataTemp)
  }, [data]);

  useEffect(() => {
    if(filteredData != null){
      const filteredData1 = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      searchText === '' ? setFilteredData(data) : setFilteredData(filteredData1);
    }
  }, [searchText,])

  const handleCheckBoxChange = (id) => {
    var arr_temp = JSON.parse(JSON.stringify(data))
    var arrFilteredData = JSON.parse(JSON.stringify(filteredData))
    for(let temp of arr_temp){
      if(temp.id == id){
        temp.is_selected = !temp.is_selected
        break;
      }
    }
    for(let filter of arrFilteredData){
      if(filter.id == id){
        filter.is_selected = !filter.is_selected
        break;
      }
    }
    setData(arr_temp)
    setFilteredData(arrFilteredData)
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        ListHeaderComponent={
          <TextField
            search
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
          <CheckBoxItem item={item} onChange={handleCheckBoxChange} selected={item.is_selected}/>
        )}
        ListEmptyComponent={<Text style={FONTSTYLES.p}>Hasil Tidak Ditemukan</Text>}
        ItemSeparatorComponent={<View style={{ height: SIZES.medium / 2 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SearchCheckboxList2

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