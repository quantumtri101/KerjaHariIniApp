import { Text, StyleSheet, View, TouchableOpacity, Pressable } from 'react-native'
import React, { Component, useState } from 'react'
// import Icon from '@expo/vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTSTYLES, SIZES } from '../../constants';

const CheckBox = ({ containerStyle, label, required, data, text, textStyle, onPress }) => {
  const [userOption, setUserOption] = useState(false);
  // props.isSelected ? setSelectedJob(true) : null
  // const label = props.label

  // console.log(props.item.value)
  data = data
  return (
    <View style={[containerStyle, { marginBottom: SIZES.small }]}>
      {label &&
        <Text style={[FONTSTYLES.inputLabel, { marginBottom: SIZES.xSmall / 2 }]}>
          {label}
          {required ?
            <Text style={FONTSTYLES.asterisk}>*</Text>
            :
            null
          }
        </Text>
      }
      <View style={styles.container}>
        {data && data.map((item) => {
          return (
            <Pressable onPress={() => setUserOption(item.value) || onPress()}>
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
        {text &&
          <Pressable onPress={() => setUserOption(!userOption) || onPress()}>
            <View style={styles.container}>
              <Icon
                name={(userOption === true ? 'check-box' : 'check-box-outline-blank')}
                size={SIZES.medium}
                color={(userOption === true ? COLORS.primary : COLORS.gray)}
              />
              <Text
                style={[
                  // item.value === userOption ?
                  //   [FONTSTYLES.p, { color: COLORS.gray_22 }]
                  //   :
                  textStyle ? textStyle : FONTSTYLES.p
                ]}
              >
                {text}
              </Text>
            </View>
          </Pressable>
        }
      </View>
    </View>
  )
}

export default CheckBox

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.medium / 2
  }
})