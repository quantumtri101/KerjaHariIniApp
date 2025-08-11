import { Image, StyleSheet, Text, View, ScrollView, FlatList, Pressable } from 'react-native'
import React from 'react'
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { Alert, Button, Header } from '../../components'
import { FontAwesome5 } from '@expo/vector-icons';
import { png_qrcode } from '../../assets'

export default function BypassRecruit(props) {
  // const router = useRouter()
  const list = [
    ['Judul Pekerjaan', 'Judul Pekerjaan'],
    ['Tanggal', 'Jumat, 1 Jan 2020'],
    ['Jam', '09.00 - 10.00 WIB'],
    ['Gaji', 'Rp. 1.000.000'],
  ]

  return (
    <>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ paddingVertical: SIZES.medium, backgroundColor: 'white' }}>
        <Header backButton title={'Bypass Recruiting'} navigation={props.navigation}/>
      </View>
      <View style={styles.mainContainer}>
        <Alert.Success text={'Anda telah direkrut, selamat bekerja!'}/>
        <Text style={[FONTSTYLES.med16_gray, {color: 'black'}]}>Anda telah direkrut oleh :</Text>
        <Text style={FONTSTYLES.sBold12_222}>Informasi Pekerjaan</Text>
        <View>
          {list.map((item, index) => (
            <View style={{ flexDirection: 'row', marginBottom: SIZES.small }} key={index}>
              <Text style={[FONTSTYLES.p_12, { width: 128, lineHeight: 24 }]}>{item[0]}</Text>
              <Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, lineHeight: 24 }]}>{item[1]}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{padding: 16, backgroundColor: 'white'}}>
        <Button title={'Kembali'} onPress={() => props.navigation.replace('Home', {screen: 'Home', params: {}})}/>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: SIZES.medium,
    gap: SIZES.large,
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