import React, {useEffect, } from 'react'
import { StartFinish } from '../../components'
import { svg_formSuccess } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function QuizFinish(props) {
  const title = 'Terima kasih\ntelah menyelesaikan\nGeneral Quiz'
  const subtitle = 'Hasil General Quiz anda akan menjadi bahan pertimbangan penerimaan lamaran anda.'

  const handleNext = async() => {
    AsyncStorage.removeItem("arrNextPage")
		props.navigation.replace('Home', {screen : 'HomeTab', params: {}, })
  }

	useEffect(() => {
		AsyncStorage.removeItem('lastQuizPage')
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