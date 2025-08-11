import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { StartFinish } from '../../components'
import { svg_formRekomendasi } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function FormRekomendasiStart(props) {
  // const router = useRouter()
  const title = 'Anda akan memasuki\nForm Rekomendasi'
  const subtitle = 'Anda akan mendapatkan Rekomendasi\nPekerjaan sesuai pilihan Anda.'

  const handleNext = async() => {
		props.navigation.navigate('FormRekomendasi', {screen : 'Category', })
    // router.push('/form-rekomendasi/category')
  }

  useEffect(() => {
    AsyncStorage.setItem('lastRequirementPage', 'Start')
  },[])

  return (
    <>
      <StartFinish
        svg={svg_formRekomendasi}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Mulai'}
        onPress={() => handleNext()}
      />
    </>
  )
}