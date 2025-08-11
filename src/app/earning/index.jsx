import { Image, StyleSheet, Text, View, ScrollView, FlatList } from 'react-native'
import React from 'react'
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { Button, Header } from '../../components'
// import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatCurrency } from '../../utils'
import useFetch from '../../hook/useFetch'
import moment from 'moment'
import 'moment/locale/id'


export default function EarningIndex(props) {

  // const router = useRouter()
  // const { user_id, salary_balance } = useLocalSearchParams()
  // const getSalaryTransaction = useFetch('GET', 'transaction/salary?user_id=' + user_id, {})
  const getSalaryTransaction = useFetch('GET', 'transaction/salary', {})

  const ItemList = ({ item }) => {

    // const getJobsName = () => {
    //   const getJobs = useFetch('GET', 'jobs?id=' + item.description.substr(20, 21), {})
    //   return (getJobs.data.data?.name == null ? '' : getJobs.data.data?.name)
    // }

    return (
      <View style={{ gap: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SIZES.xSmall }}>

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="cash" size={12} color={COLORS.text_darkBlue} />
          </View>

          <Text style={[FONTSTYLES.sBold14_222, { flex: 1 }]}>{item.description}</Text>
          <View style={[styles.status, { backgroundColor: item.status == 'accepted' ? COLORS._Accepted : COLORS._Waiting }]}>
            <Text style={[styles.statusText, { color: item.status == 'accepted' ? COLORS._AcceptedText : COLORS._WaitingText }]}>{item.status}</Text>
          </View>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={FONTSTYLES.med14_dBlue}>{item.amount_format}</Text>
          <Text style={FONTSTYLES.med14_dBlue}>{moment(item.date).format('DD/MM/YYYY HH:mm')}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: COLORS.tabBarInactive, marginVertical: 5 }} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, }}>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ paddingVertical: SIZES.medium, backgroundColor: 'white' }}>
        <Header backButton navigation={props.navigation} title={'Akumulasi Gaji'} />
      </View>

      <View style={styles.mainContainer}>

        <View style={styles.earningContainer}>
          <Text style={styles.earningTitle}>Jumlah Gaji Anda</Text>
          <Text style={styles.earning}>{formatCurrency(props.route.params.salary_balance)}</Text>
        </View>

        <Button
          title={'Lakukan Penarikan'}
          onPress={() => props.navigation.navigate('Earning', {screen: 'RequestPayout', params: {maxAmount: props.route.params.salary_balance, }})}
          disable={props.route.params.salary_balance < 10000 ? true : false}/>

        <Text style={FONTSTYLES.sBold16_dBlue}>List Transaksi</Text>

        <FlatList
          data={getSalaryTransaction.data.data}
          renderItem={({ item, index }) => <ItemList item={item} key={index} />}
          ItemSeparatorComponent={<View style={{ height: SIZES.xSmall }} />}
          ListEmptyComponent={() => <Text style={styles.empty}>Belum ada transaksi</Text>}
          style={{ paddingVertical: SIZES.medium }}/>

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
  },
  empty: {
    ...FONTSTYLES.p_black_12,
    alignSelf: 'center',
  },
})