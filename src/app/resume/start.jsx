import React, {useEffect, } from 'react'
// import { Stack, useRouter } from 'expo-router'
import { StartFinish } from '../../components'
import { svg_resume } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ResumeStart(props) {
  // const router = useRouter()
  const title = 'Lakukan pengisian\nresume anda'
  const subtitle = 'Anda akan mendapatkan Rekomendasi\nPekerjaan sesuai pilihan - pilihan Anda.'

  const handleNext = async() => {
		props.navigation.navigate('Resume', {screen : 'Informasi01', params: {}, })
    // router.push('/resume/informasi_01')
  }

	useEffect(async() => {
    console.log(await AsyncStorage.getItem('arrNextPage'))
		AsyncStorage.setItem('lastResumePage', 'Start')
	}, [])

  return (
    <>
      {/* <Stack.Screen options={{header: () => null}} /> */}
      <StartFinish
        svg={svg_resume}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Mulai'}
        onPress={() => handleNext()}
      />
    </>
  )
}