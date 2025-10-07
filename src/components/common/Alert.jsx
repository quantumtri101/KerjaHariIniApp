import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Success = ({text, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress ? onPress : null} disabled={onPress ? false : true}>
      <View style={[styles.container, {backgroundColor: '#00B283'}]}>
        <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const Warning = ({text, bold, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress ? onPress : null} disabled={onPress ? false : true}>
      <View style={[styles.container, {backgroundColor: COLORS.warning}]}>
        <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
        <Text style={styles.text}>{text}<Text style={{fontWeight: 'bold'}}>{bold}</Text></Text>
      </View>
    </TouchableOpacity>
  )
}

const Info = ({text, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress ? onPress : null} disabled={onPress ? false : true}>
      <View style={[styles.container, {backgroundColor: COLORS.secondary}]}>
        <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const Error = ({text, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress ? onPress : null} disabled={onPress ? false : true}>
      <View style={[styles.container, {backgroundColor: COLORS._RejectedText}]}>
        <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const Disabled = ({text, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress ? onPress : null} disabled={onPress ? false : true}>
      <View style={[styles.container, {backgroundColor: COLORS.gray}]}>
        <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default { Success, Warning, Info, Disabled, Error }

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color : 'white',
    // backgroundColor: 'red'
  }
})