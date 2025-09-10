import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Header from '../../components/common/header/header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { Button, TextField } from '../../components'
// import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { LinearGradient } from 'expo-linear-gradient'
import { LIPSUM } from '../../constants/theme'
import useFetch from '../../hook/useFetch'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

export default function QuizIndex(props) {
  // const router = useRouter()
  const quizData = useFetch('GET', 'general-quiz/question', {}, false)
  const postQuiz = useFetch('POST', 'general-quiz/result', postAnswer)
  // const { id, timerMinutes, timerSeconds} = useLocalSearchParams()
  const next = parseInt(props.route.params.id) + 1
  const thumbWidth = (100 / quizData.data.recordsFiltered) * parseInt(props.route.params.id)
  const [page, setPage] = useState(1)
  const [answer, setAnswer] = useState()
  const [postAnswer, setPostAnswer] = useState()
	const [timer, setTimer] = useState(0);
	const [timerMoment, setTimerMoment] = useState(moment.duration());
	const [nowMoment, setNowMoment] = useState(moment());

	useEffect(() => {
		initData()
	}, [])

  useEffect(() => {
    var offset = (page - 1) * 1
    
    quizData.setFetchUrl('general-quiz/question?page=' + page + '&offset=' + offset + '&num_data=1')
    quizData.refetch()
  }, [page, ])

  useEffect(() => {
    if(postQuiz.data != null){
      if(postQuiz.data.status == 'success'){
        AsyncStorage.removeItem('arr_quiz')
				props.navigation.navigate('Quiz', {screen : 'QuizFinish', })
        // router.replace('/quiz/finish')
      }else
        console.log('Fetch Error :', postQuiz.data?.message)
    }
    else
      console.log(postQuiz.error.data)
  },[postQuiz.data])

	useEffect(() => {
		setTimeout(() => {
			if(timer < 0)
				return
			setTimerMoment(moment.duration(parseFloat(timer), 's'))
			setTimer(timer - 1)
		}, 1000)
	}, [timer])

  async function initData(){
    await AsyncStorage.setItem('lastQuizPage', 'Quiz')
		setTimer(props.route.params.timerSeconds - 1)
		setTimerMoment(moment.duration(props.route.params.timerSeconds, 's'))

		var arr = await AsyncStorage.getItem('arr_quiz')
		arr = arr != null ? JSON.parse(arr) : []
		if(arr[props.route.params.id] != null)
			setAnswer(arr[props.route.params.id])
  }

  const submitAnswer = async () => {
    var arr = await AsyncStorage.getItem('arr_quiz')
    arr = JSON.parse(arr)

    var data = {
      time_completed: nowMoment - moment(),
    }
    var arr_answer = []
    for(let temp of arr){
      arr_answer.push({
        general_quiz_option: {
          id: temp,
        },
      })
    }
    data.arr_answer = arr_answer
    postQuiz.setRefetch(data)
  }

  const saveAnswer = async () => {
    var arr = await AsyncStorage.getItem('arr_quiz')
    arr = arr != null ? JSON.parse(arr) : []
    if(arr[props.route.params.id] != null)
      arr[props.route.params.id] = answer
    else
      arr.push(answer)
    AsyncStorage.setItem('arr_quiz', JSON.stringify(arr))
  }

  function buttonHandler() {
		saveAnswer()
    if (page == quizData.data.recordsFiltered)
      submitAnswer()
    else
      setPage(page + 1)
			// props.navigation.replace('Quiz', {screen : 'QuizPage', params: {id: next, timerSeconds: timerMoment.as('seconds'), }, })
  }

  return (
    <>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ backgroundColor: 'white' }}>
        <Header backButton title={'General Quiz'} navigation={props.navigation}/>
      </View>
      {
				quizData.data.data != null && quizData.data.data.length > 0 ?
        <View>
          <ScrollView style={{ backgroundColor: 'white', paddingHorizontal: SIZES.xLarge }}>

            <View style={styles.section_1}>
              <Text style={FONTSTYLES.sBold12_secondary}>{String(page).padStart(2, '0')}/{String(quizData.data.recordsFiltered).padStart(2, '0')}</Text>
              <View style={styles.timerContainer}>
                <MaterialCommunityIcons name={'timer'} size={18} color={COLORS.primary} />
                <Text style={styles.timer}>{timerMoment.minutes()}min {timerMoment.seconds()}s</Text>
              </View>
            </View>

            <View style={{ position: 'relative', marginTop: 10, }}>
              <View style={[styles.progressTrack, ]} />
							<View style={[styles.progressTrack1, { width: (page / quizData.data.recordsFiltered * 100) + '%', }]} />
            </View>

						<View style={{ marginTop: 16, }}>
            	<Text style={FONTSTYLES.reg16_222}>
              	<Text style={{ fontFamily: FONTS.semibold }}>Q{page} </Text>
              	{quizData.data.data[0].name}
            	</Text>
						</View>

            <View style={{ paddingTop: SIZES.medium }}>
              {
                quizData.data.data[0].general_quiz_option.map((item, index) =>
                  <View style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 8 }} key={index}>
                    <TouchableNativeFeedback onPress={() => setAnswer(item.id)}>
                      <View style={styles.itemContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: SIZES.xSmall }}>
                          <MaterialIcons
                            name={answer == item.id ? 'radio-button-checked' : 'radio-button-unchecked'}
                            size={20}
                            color={answer == item.id ? COLORS.primary : COLORS.gray}/>
                          <Text style={[FONTSTYLES.p, { flex: 1, color: COLORS.gray_22 }]}>{item.option}</Text>
                        </View>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                )
              }
            </View>

          </ScrollView>

          <View style={{ padding: 16, backgroundColor: COLORS.white }}>
            {postQuiz.isLoading ?
              <ActivityIndicator size={'large'} color={COLORS.primary} />
              :
              <Button title={'Lanjut'} style={{ height: 30 }} onPress={() => buttonHandler()} disable={answer == null ? true : false} />
            }
          </View>

        </View>
				:
				<View style={{ flex: 1, alignItems: 'center', backgroundColor: COLORS.white }}>
					<ActivityIndicator size={'large'} color={COLORS.primary} />
				</View>
     }
    </>
  )
}

const styles = StyleSheet.create({
  section_1: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  timerContainer: {
    flexDirection: 'row',
    gap: SIZES.medium / 2,
    paddingVertical: SIZES.medium / 2,
    paddingHorizontal: SIZES.medium,
    backgroundColor: COLORS._Interview,
    borderRadius: SIZES.xLarge,
    alignItems: 'center'
  },
  timer: {
    height: 18,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  progressTrack: {
    height: 10,
		width: '100%',
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    opacity: 0.25,
		position: 'absolute',
  },
	progressTrack1: {
		height: 10,
		borderRadius: 8,
		backgroundColor: COLORS.primary,
		position: 'absolute',
	},
  progressThumb: {
    height: 10,
    borderRadius: 8,
    position: 'absolute',
    top: 10,
    left: 0
  },
  itemContainer: {
    padding: SIZES.medium,
    borderRadius: SIZES.medium / 2,
    backgroundColor: COLORS.lightWhite2,
    gap: SIZES.xSmall / 2
  },
})