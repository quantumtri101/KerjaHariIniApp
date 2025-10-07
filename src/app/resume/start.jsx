import React, {useEffect, } from 'react'
import { StartFinish } from '../../components'
import { svg_resume } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ResumeStart(props) {
  const title = 'Lakukan pengisian\nresume anda'
  const subtitle = 'Anda akan mendapatkan Rekomendasi\nPekerjaan sesuai pilihan - pilihan Anda.'

  const handleNext = async() => {
		props.navigation.navigate('Resume', {screen : 'Informasi01', params: {}, })
  }

	useEffect(async() => {
    console.log(await AsyncStorage.getItem('arrNextPage'))
		AsyncStorage.setItem('lastResumePage', 'Start')
	}, [])

  return (
    <>
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