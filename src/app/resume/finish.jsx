import React, {useEffect, } from 'react'
import { StartFinish } from '../../components'
import { svg_resumeSuccess } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ResumeFinish(props) {
  const title = 'Resume anda telah tersimpan'
  const subtitle = 'Resume akan dikirimkan saat Anda melakukan lamaran Pekerjaan.'

  const handleNext = async() => {
    var arrNextPage = await AsyncStorage.getItem("arrNextPage")
    arrNextPage = arrNextPage != null ? JSON.parse(arrNextPage) : []
    var nextPage = {}
    var flag = false
    for(let page of arrNextPage){
      flag = true
      if(page.id > 2){
        nextPage = page
        break
      }
    }
    if(!flag)
      AsyncStorage.removeItem("arrNextPage")

		props.navigation.replace(nextPage.id != null ? nextPage.route : (flag ? 'Home' : 'Quiz'), {screen : nextPage.id != null ? nextPage.screen : (flag ? 'HomeTab' : 'QuizStart'), params: {}, })
  }

	useEffect(() => {
		AsyncStorage.removeItem('lastResumePage')
	}, [])

  return (
    <>
      <StartFinish
        svg={svg_resumeSuccess}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Lanjut'}
        onPress={() => handleNext()}
      />
    </>
  )
}