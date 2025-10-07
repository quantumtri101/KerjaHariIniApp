import React, {useEffect, } from 'react'
import { StartFinish } from '../../components'
import { svg_quiz } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function QuizStart(props) {
  const title = 'Pengisian\nGeneral Quiz'
  const subtitle = 'Selesaikan General Quiz untuk mengukur\npengetahuan anda seputar pekerjaan'

  function onStart(){
		props.navigation.navigate('Quiz', {screen : 'QuizPage', params: {id: 1, timerSeconds: 180, }, })
  }

	useEffect(() => {
		AsyncStorage.setItem('lastQuizPage', 'QuizStart')
	}, [])

  return (
    <>
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