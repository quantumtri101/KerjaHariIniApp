import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, FONTS, SIZES } from '../../constants'

const Accepted = () => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS._Accepted}]}>
      <Text style={[styles.text, {color: COLORS._AcceptedText}]}>Diterima</Text>
    </View>
  )
}

const Rejected = () => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS._Rejected}]}>
      <Text style={[styles.text, {color: COLORS._RejectedText}]}>Ditolak</Text>
    </View>
  )
}

const Waiting = () => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS._Waiting}]}>
      <Text style={[styles.text, {color: COLORS._WaitingText}]}>Menunggu</Text>
    </View>
  )
}

const Interview = () => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS._Interview}]}>
      <Text style={[styles.text, {color: COLORS._InterviewText}]}>Jadwal Interview</Text>
    </View>
  )
}

const Working = () => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS._Working}]}>
      <Text style={[styles.text, {color: COLORS._WorkingText}]}>Hari Kerja</Text>
    </View>
  )
}

const Completed = () => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS._Completed}]}>
      <Text style={[styles.text, {color: COLORS._CompletedText}]}>Selesai Kerja</Text>
    </View>
  )
}

const Expired = () => {
  return (
    <View style={[styles.container, {backgroundColor: COLORS.gray_22}]}>
      <Text style={[styles.text, {color: COLORS.white}]}>Kadaluwarsa</Text>
    </View>
  )
}

export default {
  Accepted,
  Rejected,
  Waiting,
  Interview,
  Working,
  Completed,
  Expired
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100, 
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xSmall,
    lineHeight: SIZES.medium,
    textAlign: 'center'
  }
})