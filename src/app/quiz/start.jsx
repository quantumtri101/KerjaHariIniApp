import React, {useEffect, } from 'react'
// import { Stack, useRouter } from 'expo-router'
import { StartFinish } from '../../components'
import { svg_quiz } from '../../assets'
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function QuizStart(props) {
  // const router = useRouter()
  const title = 'Pengisian\nGeneral Quiz'
  const subtitle = 'Selesaikan General Quiz untuk mengukur\npengetahuan anda seputar pekerjaan'

  function onStart(){
    // AsyncStorage.setItem('start_time', moment().format('YYYY-MM-DD HH:mm:ss'))
		props.navigation.navigate('Quiz', {screen : 'QuizPage', params: {id: 1, timerSeconds: 180, }, })
    // router.push('/quiz/[id]?id=1&timerMinutes=3&timerSeconds=0')
  }

	useEffect(() => {
		AsyncStorage.setItem('lastQuizPage', 'QuizStart')
	}, [])

  return (
    <>
      {/* <Stack.Screen options={{header: () => null}} /> */}
      <StartFinish
        svg={svg_quiz}
        title={title}
        subtitle={subtitle}
        buttonTitle={'Mulai'}
        onPress={() => onStart()}
      />
    </>
  )
}