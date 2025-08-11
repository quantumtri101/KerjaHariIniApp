import React, {useEffect, } from 'react'
// import { Stack, useRouter } from 'expo-router'
import { StartFinish } from '../../components'
import { svg_formSuccess } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function FormRekomendasiFinish(props) {
  // const router = useRouter()
  const title = 'Terima Kasih\natas pilihan anda'
  const subtitle = 'Anda akan mendapatkan rekomendasi\npekerjaan sesuai pilihan Anda.'

  const handleNext = async() => {
    var arrNextPage = await AsyncStorage.getItem("arrNextPage")
    arrNextPage = arrNextPage != null ? JSON.parse(arrNextPage) : []
    var nextPage = {}
    var flag = false
    for(let page of arrNextPage){
      flag = true
      if(page.id > 1){
        nextPage = page
        break
      }
    }
    if(!flag)
      AsyncStorage.removeItem("arrNextPage")

		props.navigation.replace(nextPage.id != null ? nextPage.route : (flag ? 'Home' : 'Resume'), {screen : nextPage.id != null ? nextPage.screen : (flag ? 'HomeTab' : 'Start'), params: {}, })
    // router.push('/resume/start')
  }

	useEffect(() => {
		AsyncStorage.removeItem('lastRequirementPage')
	}, [])

  return (
    <>
      <StartFinish
        svg={svg_formSuccess}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Lanjut'}
        onPress={() => handleNext()}
      />
    </>
  )
}