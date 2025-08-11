import { Image, StyleSheet, Text, View, ScrollView, FlatList, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { Button, Header } from '../../components'
// import { FontAwesome5 } from '@expo/vector-icons';
import { png_qrcode, logo, JGAicon } from '../../assets'
import useFetch from '../../hook/useFetch'
import { useEffect } from 'react'
import QRCode from 'react-native-qrcode-svg';
// import { Svg, SvgFromUri, SvgXml, SvgUri } from 'react-native-svg'
import { useState } from 'react'
// import { atob } from 'buffer'
// import base64 from 'react-native-base64'

export default function MyQR(props) {
  // const router = useRouter()
  // const { amount } = useLocalSearchParams()
  const getProfile = useFetch('GET', 'auth/profile', {})

  const list = [
    ['Nama Rekening', 'Nama Rekening'],
    ['Bank', 'Bank Central Asia'],
    ['Nomor Rekening', '1231 2132 1231 23']
  ]

  const [qrCode, setQrCode] = useState()

  useEffect(() => {
    // const decode = base64.decode(getProfile.data.data?.qr_code_id)
    // console.log(decode)
    // setQrCode(decode)
  }, [getProfile.data])

  return (
    <>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ paddingVertical: SIZES.medium, backgroundColor: 'white' }}>
        <Header backButton title={'Lihat QR Code'} navigation={props.navigation}/>
      </View>
      <View style={styles.mainContainer}>
        <View style={{ alignItems: 'center' }}>
          {/* <Pressable onPress={() => router.push('/bypassRecruit')}> */}
            {/* <Image source={png_qrcode} resizeMode='center' style={{height: 244, width: 244}}/> */}
            {/* <ActivityIndicator size={'large'} color={COLORS.primary} /> */}
            {getProfile.isLoading ?
              <ActivityIndicator size={'large'} color={COLORS.primary} />
              :
							<QRCode
								value={getProfile.data.data?.id}/>

            }
              {/* <SvgXml xml={qrCode} /> */}
            {/* <SvgXml xml={qrCode} /> */}
          {/* </Pressable> */}
        </View>
        <View style={styles.earningContainer}>
          <Text style={styles.earning}>{getProfile.data.data?.name}</Text>
          {/* <Text style={styles.earningTitle}>1231 2132 1231 23</Text> */}
        </View>
      </View>

      {/* <View style={{ padding: SIZES.medium, backgroundColor: COLORS.white }}>
        <Button title={'Lamar Dengan Scan QR'} onPress={() => props.navigation.navigate('Profile', {screen: 'RecruitScanQR', params: {}})} />
      </View> */}
    </>
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