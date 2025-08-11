import React, {useEffect, } from 'react'
// import { Stack, useRouter } from 'expo-router'
import { StartFinish } from '../../components'
import { svg_resumeSuccess } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ResumeFinish(props) {
  // const router = useRouter()
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
    // router.push('/quiz/start')
  }

	useEffect(() => {
		AsyncStorage.removeItem('lastResumePage')
	}, [])

  return (
    <>
      {/* <Stack.Screen options={{header: () => null}} /> */}
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