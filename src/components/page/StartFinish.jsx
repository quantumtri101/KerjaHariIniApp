import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LocalSvg } from 'react-native-svg/css'
import { FONTS, FONTSTYLES, SIZES, COLORS } from '../../constants'
import { Button } from '../common'

const StartFinish = ({ svg, title, subtitle, buttonTitle, onPress, navigation }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.centerContainer}>
        <LocalSvg asset={svg} style={styles.svg} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subtitle}</Text>
      </View>
      <View style={{ padding: SIZES.medium }} >
        <Button title={buttonTitle} onPress={onPress} />
      </View>
    </View>
  )
}

export default StartFinish

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xLarge
  },
  svg: {
    width: '100%',
    aspectRatio: 3 / 2
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xLarge,
    textAlign: 'center',
    marginTop: SIZES.medium,
    color: COLORS.gray_22,
  },
  subTitle: {
    ...FONTSTYLES.p,
    textAlign: 'center'
  }
})