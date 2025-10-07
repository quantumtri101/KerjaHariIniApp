import { Image, StyleSheet, Text, View, ScrollView, FlatList, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { Button, Header } from '../../components'
import { png_qrcode, logo, JGAicon } from '../../assets'
import useFetch from '../../hook/useFetch'
import QRCode from 'react-native-qrcode-svg';

export default function MyQR(props) {
  const getProfile = useFetch('GET', 'auth/profile', {})

  const list = [
    ['Nama Rekening', 'Nama Rekening'],
    ['Bank', 'Bank Central Asia'],
    ['Nomor Rekening', '1231 2132 1231 23']
  ]

  return (
    <View>
      <View style={{ backgroundColor: 'white' }}>
        <Header backButton title={'Lihat QR Code'} navigation={props.navigation}/>
      </View>
      <View style={styles.mainContainer}>
        <View style={{ alignItems: 'center' }}>
          {
            getProfile.isLoading ?
            <ActivityIndicator size={'large'} color={COLORS.primary} />
            :
            <QRCode value={getProfile.data.data?.id}/>
          }
        </View>
        <View style={styles.earningContainer}>
          <Text style={styles.earning}>{getProfile.data.data?.name}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: SIZES.medium,
    gap: SIZES.medium,
  },
  earningContainer: {
    backgroundColor: COLORS.lightWhite2,
    elevation: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.xSmall
  },
  earningTitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text_darkBlue,
    textAlign: 'center'
  },
  earning: {
    fontSize: 20,
    fontFamily: FONTS.semibold,
    color: COLORS.text_darkBlue,
    textAlign: 'center'
  },
  iconContainer: {
    padding: 8,
    backgroundColor: COLORS.tabBarInactive,
    borderRadius: 16
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: SIZES.medium
  },
  statusText: {
    ...FONTSTYLES.med10_black
  }
})