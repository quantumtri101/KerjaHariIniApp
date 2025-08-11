import { FlatList, ScrollView, StyleSheet, Text, View, TouchableNativeFeedback, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect } from 'react'
// import { Stack } from 'expo-router'
import { Header } from '../components/common'
import { COLORS, FONTSTYLES, FONTS, SIZES } from '../constants'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useFetch from '../hook/useFetch'

export default function Notification(props) {
  const getNotification = useFetch('GET', 'notification', {})
  const postSetRead = useFetch('POST', 'notification/read', {}, false)

  useEffect(() => {
    postSetRead.fetchData()
  },[getNotification.data])

  const Item = ({ item }) => {
    return (
      <TouchableNativeFeedback onPress={() => null}>
        <View style={{ padding: SIZES.medium, flexDirection: 'row', backgroundColor: item.read_at != null ? COLORS.lightWhite : null }}>
          {/* <View style={{ padding: SIZES.medium, flexDirection: 'row'}}> */}
          <View style={{ width: SIZES.xLarge }}>
            <MaterialCommunityIcons name='circle-medium' size={SIZES.xLarge} color={item.read_at != null ? null : COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[FONTSTYLES.p_14, { marginTop: 2 }]}>{item.title}</Text>
            <Text style={[FONTSTYLES.reg12_rockBlue]}>{item.body}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  return (
    <View style={{ flex: 1, }}>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <Header backButton title={'Notifikasi'} navigation={props.navigation}/>
			{
				getNotification.data.data != null && getNotification.data.data.length > 0 ?
				<FlatList
					data={getNotification.data.data}
					keyExtractor={(item) => item.id}
					renderItem={({ item, index }) => <Item item={item} key={index} />}
					refreshControl={<RefreshControl refreshing={getNotification.isLoading} onRefresh={() => getNotification.refetch()} />}
					style={{ flex: 1, backgroundColor: 'white' }}
				/>
				:
				<View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
					<Text style={{ fontFamily: FONTS.semibold, fontSize: 16, }}>Tidak ada Notifikasi</Text>
				</View>
			}

    </View>
  )
}

const styles = StyleSheet.create({})