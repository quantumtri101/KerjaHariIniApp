import { View, Pressable, Text, TextInput, FlatList, StyleSheet, TouchableNativeFeedback, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";
// import Icon from '@expo/vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextField from "./TextField";


const CheckBoxItem = ({ item, onChange, selected, index, }) => {
  return (
    <View style={{ borderRadius: SIZES.medium / 2, overflow: 'hidden', backgroundColor: COLORS.lightWhite }}>
      <TouchableNativeFeedback onPress={() => onChange(index)}>
        <View style={{ padding: SIZES.medium, flexDirection: 'row', gap: SIZES.large, alignItems: 'center' }}>
          <Icon name={item.checked ? 'check-box' : 'check-box-outline-blank'} size={SIZES.large} color={item.checked ? COLORS.primary : COLORS.rockBlue} />
          <Text style={FONTSTYLES.p_black_12}>{item.name}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const SearchCheckboxList = ({ inputData, getSelectedValue, searcPlaceholder, onEndReached, onSearched, searchType = "local", withSearch = true, }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [firstTime, setFirstTime] = useState(true);
  const [firstTimeFilter, setFirstTimeFilter] = useState(false);
  const [timeoutSearch, setTimeoutSearch] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {

    if (firstTimeFilter) {
      var arr = []
      for (let filter of filteredData) {
        if (filter.checked)
          arr.push(filter)
      }

      getSelectedValue(arr)
      setSelected(arr)
      setFirstTimeFilter(false)
    }
  }, [filteredData, firstTimeFilter,])

  useEffect(() => {
    if (inputData != null) {
      var arr = JSON.parse(JSON.stringify(inputData))
      var arrSelected = JSON.parse(JSON.stringify(selected))

      for (let data of arr) {
        var flag = false
        for (let dataSelected of arrSelected) {
          if (data.id == dataSelected.id) {
            data.checked = true
            flag = true
            break
          }
        }
        if (!flag)
          data.checked = false
      }

      setFilteredData(arr)
      setData(arr)
    }
  }, [inputData, selected,])

  useEffect(() => {
    if(timeoutSearch != null)
      clearTimeout(timeoutSearch)

    setTimeoutSearch(setTimeout(() => {
      if(!firstTime){
        if(searchType == "local"){
          if(filteredData != null){
            const filteredData1 = data.filter((item) =>
              item.name.toLowerCase().includes(searchText.toLowerCase())
            );
            searchText === '' ? setFilteredData(data) : setFilteredData(filteredData1);
          }
        }
        else if(searchType == "online"){
          onSearched(searchText)
        }
      }
      else
        setFirstTime(false)
    }, 300))

  }, [searchText,])

  const handleCheckBoxChange = (index) => {
    // if (!selected.includes(id)) {
    //   setSelected(current => [...current, id])
    // }
    // else {
    //   const newArray = selected.filter(item => item !== id)
    //   setSelected([])
    //   setSelected(newArray)
    // }

    var arr = JSON.parse(JSON.stringify(filteredData))
    var arr1 = JSON.parse(JSON.stringify(data))

    var filter = arr[index]
    filter.checked = !filter.checked
    setFirstTimeFilter(true)
    setFilteredData(arr)

    var filter1 = arr1[index]
    filter1.checked = !filter1.checked
    setData(arr1)
  };

  function onEndReached1() {
    if (scrollY > 0 && filteredData.length > 0 && onEndReached != null)
      onEndReached()
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        ListHeaderComponent={
          withSearch &&
          <TextField
            search
            // style={styles.searchInput}
            placeholder="Cari"
            value={searchText}
            onChangeText={(value) => setSearchText(value)}
            // onChangeText={handleSearch}
            // onEndEditing={(value) => handleSearch(value)}
            containerStyle={{ backgroundColor: 'white' }}
          />
        }
        stickyHeaderIndices={[0]}
        data={filteredData}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => (
          <CheckBoxItem item={item} key={index} index={index} onChange={handleCheckBoxChange} />
        )}
        ListEmptyComponent={<Text style={FONTSTYLES.p}>Hasil Tidak Ditemukan</Text>}
        ItemSeparatorComponent={<View style={{ height: SIZES.medium / 2 }} />}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => onEndReached1()}
      />
    </View>
  );
};

export default SearchCheckboxList

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  itemSvgContainer: {
    // flex: 1,
    // padding: SIZES.xLarge,
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