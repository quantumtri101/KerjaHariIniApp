import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { gif_faceRecognition } from '../../assets'
import { FONTS, FONTSTYLES, SIZES } from '../../constants'
import { Button, Header } from '../../components'

export default function VerifikasiPenerimaan(props) {
  return (
    <View>
      <View style={{ backgroundColor: 'white' }}>
        <Header backButton title={'Verifikasi Penerimaan'} navigation={props.navigation}/>
      </View>
      <View style={styles.mainContainer}>

        <View style={styles.centerContainer}>
          <Text style={styles.title}>
            Bersiaplah untuk{'\n'}mengambil gambar{'\n'}wajah anda sambil memegang{'\n'}KTP
          </Text>
          <Image source={gif_faceRecognition} />
        </View>

        <View style={{ padding: SIZES.medium }} >
          <Button title={'Lanjut'} onPress={() => props.navigation.replace('JobDetail', {screen: 'ApplySuccess', params: {}})}/>
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    backgroundColor: 'white'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xLarge
  },
  svg:{
    width:'100%',
    aspectRatio: 3/2
  },
  title:{
    fontFamily: FONTS.semibold,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginTop: SIZES.medium
  },
  subTitle: {
    ...FONTSTYLES.p,
    textAlign: 'center'
  }
})