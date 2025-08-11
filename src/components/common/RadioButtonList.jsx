import { View, Pressable, Text, TextInput, FlatList, StyleSheet, TouchableNativeFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTSTYLES, SIZES } from "../../constants";
// import Icon from '@expo/vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextField from "./TextField";

const RadioButtonList = ({ inputData }) => {

  const [userOption, setUserOption] = useState(0);

  const CheckBoxItem = ({ item, onChange }) => {
    return (
      <View style={{ borderRadius: SIZES.medium / 2, overflow: 'hidden', backgroundColor: COLORS.lightWhite }}>
        <TouchableNativeFeedback onPress={() => onChange(item.id)}>
          <View style={{ padding: SIZES.medium, flexDirection: 'row', gap: SIZES.large, alignItems: 'center' }}>
            <Icon name={item.id === userOption ? 'radio-button-on' : 'radio-button-off'} size={SIZES.large} color={item.id === userOption ? COLORS.primary : COLORS.rockBlue} />
            <Text style={FONTSTYLES.p_black_12}>{item.label}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  };

  const handleCheckBoxChange = (id) => {
    setUserOption(id)
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={inputData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CheckBoxItem item={item} onChange={handleCheckBoxChange} />
        )}
        ItemSeparatorComponent={<View style={{ height: SIZES.medium / 2 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RadioButtonList

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