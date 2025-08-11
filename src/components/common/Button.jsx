import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'

export default function Button({
  onPress,
  style,
  title,
  leftIcon,
  outline,
  disable
}){
  return (
    <TouchableOpacity
      onPress={() => disable ? null : onPress()}
      style={[style, outline ? styles.containerOutline : disable ? styles.containerDisable : styles.container]}
    >
      <Text style={outline ? styles.textOutline : FONTSTYLES.buttonText}>
        {leftIcon}
        {leftIcon &&
          <View style={{width: 8}} />
        }
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium / 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54
  },
  containerDisable: {
    backgroundColor: COLORS.gray,
    borderRadius: SIZES.medium / 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54
  },
  containerOutline: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium / 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: 54
  },
  textOutline: {
    ...FONTSTYLES.buttonText,
    color: COLORS.primary
  }
})