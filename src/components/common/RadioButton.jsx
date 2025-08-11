import { Text, StyleSheet, View, TouchableOpacity, Pressable } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
// import Icon from '@expo/vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants';

const RadioButton = ({containerStyle, label, required, data, onChange, error, errorMessage}) => {
  const [userOption, setUserOption] = useState(false);

  const handleOption = (v) => {
    const value = v
    setUserOption(value)
    onChange(value)
  }

  data = data
  return (
    <View style={[containerStyle, { marginBottom: SIZES.small }]}>
      <Text style={[FONTSTYLES.inputLabel, { marginBottom: SIZES.xSmall / 2 }]}>
        {label}
        {required ?
          <Text style={FONTSTYLES.asterisk}>*</Text>
          :
          null
        }
      </Text>
      <View style={styles.container}>
        {data.map((item, index) => {
          return (
            <Pressable onPress={() => handleOption(item.value)} key={index}>
              <View style={styles.container}>
                <Icon
                  name={(item.value === userOption ? 'radio-button-checked' : 'radio-button-unchecked')}
                  size={SIZES.medium}
                  color={(item.value === userOption ? COLORS.primary : COLORS.gray)}
                />
                <Text
                  style={
                    item.value === userOption ?
                      [FONTSTYLES.p, { color: COLORS.gray_22 }]
                      :
                      FONTSTYLES.p
                  }
                >
                  {item.value}
                </Text>
              </View>
            </Pressable>
          )
        })}
      </View>
      {
        error &&
          <Text style={styles.errorMessage}>{errorMessage}</Text>
      }
    </View>
  )
}

export default RadioButton

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.medium / 2
  },
  _error: {
    borderColor: COLORS.red
  },
  errorMessage: {
    color: COLORS.red,
    fontFamily: FONTS.bold,
    fontSize: SIZES.xSmall,
    marginTop: SIZES.xSmall / 2
  },
})