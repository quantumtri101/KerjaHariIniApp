import { Image, StyleSheet, Text, View, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { Button, Header } from '../../components'
import Base from '../../utils/base'
// import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { formatCurrency } from '../../utils'
import useFetch from '../../hook/useFetch'

export default function PayoutReview(props){
  var base = new Base()
  // const router = useRouter()
  // const { amount } = useLocalSearchParams()
  const getResume = useFetch('GET', 'resume', {})
  const getBank = useFetch('GET', 'bank?id=' + getResume.data.data?.bank_id, {}, false)
  const postRequestWithdraw = useFetch('POST', 'request-withdraw', {
    "bank_id": getResume.data.data?.bank_id,
    "acc_no": getResume.data.data?.acc_no,
    "acc_name": getResume.data.data?.name,
    "amount": props.route.params.amount,
    "fee": 0
  }, false)

  useEffect(() => {
    getBank.fetchData()
  }, [getResume.data])

  useEffect(() => {
    if(postRequestWithdraw.data.status != null){
      if (postRequestWithdraw.data.status == 'success') {
        props.navigation.navigate('Earning', {screen: 'Processing', params: {}})
        // router.push('/earning/processing')
      }
      else
        base.alertSnackbar(postRequestWithdraw.data.message)
    }
  }, [postRequestWithdraw.data])

  return (
    <View style={{ flex: 1, }}>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ paddingVertical: SIZES.medium, backgroundColor: 'white' }}>
        <Header backButton title={'Request Penarikan'} navigation={props.navigation}/>
      </View>
      <View style={styles.mainContainer}>

				<View style={styles.earningContainer}>
          <Text style={styles.earningTitle}>Jumlah Request Penarikan</Text>
          <Text style={styles.earning}>Rp. {props.route.params.amount.toLocaleString(base.priceFormatIDR)}</Text>
        </View>

        <View style={{ flex: 1, }}>
          <Text style={[FONTSTYLES.sBold16_dBlue, { color: 'black' }]}>List Transaksi</Text>

          <View style={{ flex: 1, gap: 8, marginTop: 8, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
              <Text style={[FONTSTYLES.med14_dBlue]}>Nama Rekening</Text>
              <Text style={[FONTSTYLES.med14_black]}>{getResume.data.data?.acc_name}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
              <Text style={[FONTSTYLES.med14_dBlue]}>No Rekening</Text>
              <Text style={[FONTSTYLES.med14_black]}>{getResume.data.data?.acc_no}</Text>
            </View>

            <Text style={[FONTSTYLES.reg10_7373, { textAlign: 'center', marginTop: SIZES.medium }]}>
              Proses Penarikan akan memakan waktu 1-2 minggu
            </Text>
          </View>
        </View>

        {
					postRequestWithdraw.isLoading ?
          <ActivityIndicator size={'large'} color={COLORS.primary} />
          :
          <Button
            title={'Lakukan Penarikan'}
            onPress={() => postRequestWithdraw.fetchData()}
            style={{ marginBottom: 16 }}
          />
        }

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: SIZES.medium,
    gap: SIZES.medium
  },
  earningContainer: {
    backgroundColor: COLORS.lightWhite2,
    elevation: 1,
    padding: SIZES.medium,
    borderRadius: SIZES.xSmall
  },
  earningTitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text_darkBlue,
    textAlign: 'center'
  },
  earning: {
    fontSize: 30,
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