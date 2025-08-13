import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Header from '../../components/common/header/header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, SIZES } from '../../constants'
import { Button, TextField } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ApplyJobs(props) {
  // const router = useRouter()
  // const { jobs_id } = useLocalSearchParams()
  const [content, setContent] = useState('')

  // const handleButton = async() => {
  //   // await AsyncStorage.setItem('')
  // }

  return (
    <>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ backgroundColor: 'white' }}>
        <Header backButton title={'Isi Surat Lamaran'} navigation={props.navigation}/>
      </View>

      <ScrollView style={{ backgroundColor: 'white', padding: SIZES.xLarge }}>
        <TextField
          required
          label={'Surat Lamaran'}
          keyboardType={'default'}
          placeholder={'Isi Surat Lamaran'}
          multiline
          numberOfLines={10}
          onChangeText={(v) => setContent(v)}
        />
      </ScrollView>
      <View style={{ padding: 16, backgroundColor: COLORS.white }}>
        <Button title={'Lamar'} style={{ height: 30 }}
					onPress={() => props.navigation.navigate('JobDetail', {screen: 'ApplyReview', params: {jobs_id: props.route.params.jobs_id, content: content, }}) }
					disable={!content}/>
      </View>
    </>
  )
}

const styles = StyleSheet.create({})