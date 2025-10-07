import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/common/header/header'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, FONTSTYLES, SIZES } from '../../constants'
import { Button, CheckBox, Skeleton, TextField } from '../../components'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CollapsibleText from '../../components/common/CollapsibleText'
import { LIPSUM } from '../../constants/theme'
import useFetch from '../../hook/useFetch'
import moment from 'moment'
import 'moment/locale/id'

export default function ApplyReview(props) {
  const [agree, setAgree] = useState(false)

  const getResume = useFetch('GET', 'resume', {})
  const getEducation = useFetch('GET', 'education?id=' + getResume.data.data?.education_id, {}, false)
  const getQuiz = useFetch('GET', 'general-quiz/result', {}, false)
  const postApplication = useFetch('POST', 'jobs/application', {
    "jobs_id": props.route.params.jobs_id,
    "content": props.route.params.content,
    "first_question": null
  }, false)

  useEffect(() => {
    getResume.refetch()
  }, [])

  useEffect(() => {
    if (getResume.data != null) {
      getEducation.refetch()
      getQuiz.refetch()
    }
  }, [getResume.isLoading])

  useEffect(() => {
    if (postApplication.data.status == 'success') {
			props.navigation.navigate('JobDetail', {screen: 'ApplySuccess', params: {}})
    }
  }, [postApplication.data])

  return (
    <View style={{ flex: 1, }}>
      <View style={{ backgroundColor: 'white' }}>
        <Header backButton title={'Review Lamaran'} navigation={props.navigation}/>
      </View>
      <ScrollView style={{ backgroundColor: 'white', paddingHorizontal: SIZES.xLarge }}>
        {
					(getResume.isLoading, getEducation.isLoading, getQuiz.isLoading) ?
          <>
            <Skeleton negWidth={SIZES.medium * 3} height={SIZES.medium * 10} borderRadius={SIZES.medium} style={{ marginBottom: SIZES.medium }} />
            <Skeleton negWidth={SIZES.medium * 3} height={SIZES.medium * 10} borderRadius={SIZES.medium} style={{ marginBottom: SIZES.medium }} />
            <Skeleton negWidth={SIZES.medium * 3} height={SIZES.medium * 10} borderRadius={SIZES.medium} style={{ marginBottom: SIZES.medium }} />
          </>
          :
          <>
            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderContainer}>
                <MaterialCommunityIcons name="file" size={36} color={COLORS.rockBlue} />
                <Text
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  style={styles.cardTitle}>
                  Resume Anda
                </Text>
                <View style={{ flex: 1 }} />
                <View style={styles.rightArrowContainer}>
                  <MaterialCommunityIcons name='chevron-right' size={SIZES.xLarge} color={COLORS.rockBlue} />
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailContainer}>
                <View style={styles.detailContainerRow}>
                  <MaterialCommunityIcons name='clock' size={SIZES.medium} color={COLORS.rockBlue} />
                  <Text style={[FONTSTYLES.reg12_rockBlue, { color: COLORS.secondary }]}>
                    {getResume.data.data?.name}
                  </Text>
                </View>
                <View style={styles.detailContainerRow}>
                  <MaterialCommunityIcons name='map-marker' size={SIZES.medium} color={COLORS.rockBlue} />
                  <Text style={[FONTSTYLES.reg12_rockBlue, { color: COLORS.secondary }]}>
                    {moment(getResume.data.data?.birth_date).format('DD MMMM YYYY')}
                  </Text>
                </View>
                <View style={styles.detailContainerRow}>
                  <MaterialCommunityIcons name='school' size={SIZES.medium} color={COLORS.rockBlue} />
                  <Text style={[FONTSTYLES.reg12_rockBlue, { color: COLORS.secondary }]}>
                    {getEducation.data.data?.name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderContainer}>
                <MaterialCommunityIcons name="file" size={36} color={COLORS.rockBlue} />
                <Text
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  style={styles.cardTitle}>
                  Surat Lamaran
                </Text>
                <View style={{ flex: 1 }} />
                <View style={styles.rightArrowContainer}>
                  <MaterialCommunityIcons name='chevron-right' size={SIZES.xLarge} color={COLORS.rockBlue} />
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailContainer}>
                <CollapsibleText text={props.route.params.content} numberOfLines={3} />
              </View>
            </View>

            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderContainer}>
                <MaterialCommunityIcons name="file" size={36} color={COLORS.rockBlue} />
                <Text
                  numberOfLines={2}
                  ellipsizeMode='tail'
                  style={styles.cardTitle}>
                  Quiz
                </Text>
                <View style={{ flex: 1 }} />
                <View style={styles.rightArrowContainer}>
                  <MaterialCommunityIcons name='chevron-right' size={SIZES.xLarge} color={COLORS.rockBlue} />
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailContainerRow}>
                {
									getQuiz.data.data == null ?
                  <View>
                    <MaterialCommunityIcons name='close-circle-outline' size={16} color={COLORS._RejectedText} />
                    <Text style={[FONTSTYLES.reg10_7373, { color: COLORS._RejectedText }]}>
                      Anda belum menyelesaikan quiz
                    </Text>
                  </View>
                  :
                  <View>
                    <MaterialCommunityIcons name='check-circle-outline' size={16} color={COLORS._AcceptedText} />
                    <Text style={[FONTSTYLES.reg10_7373, { color: COLORS._AcceptedText }]}>
                      Telah diikuti {moment(getQuiz.data?.data[0]?.updated_at).format('dddd, DD MMM YYYY [Pk.] HH.mm')}
                    </Text>
                  </View>
                }
              </View>
            </View>
          </>
        }
      </ScrollView>
      {
        postApplication.isLoading ?
        <ActivityIndicator size={'large'} color={COLORS.primary} />
        :
        <View style={{ padding: 16, backgroundColor: COLORS.white }}>
          <CheckBox text={'Dengan ini saya menyetujui bahwa data adalah benar ada nya.'} textStyle={styles.checkBoxText} onPress={() => setAgree(!agree)} />
          <Button title={'Lanjut'} style={{ height: 30 }} onPress={() => postApplication.fetchData()} disable={!agree} />
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
  },
  cardHeaderContainer: {
    flexDirection: 'row',
    gap: SIZES.medium,
    alignItems: 'center',
    marginBottom: 6
  },
  cardTitle: {
    ...FONTSTYLES.sBold14_222,
    color: COLORS._coolToneBlue_alt1,
    flexShrink: 1,
  },
  rightArrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZES.xSmall * 3,
    height: SIZES.xSmall * 3
  },
  divider: {
    height: 1,
    marginVertical: SIZES.xSmall,
    backgroundColor: '#EDF1F7',
  },
  detailContainer: {
    // paddingHorizontal: SIZES.medium,
    // paddingBottom: SIZES.medium,
    gap: SIZES.medium / 4
  },
  detailContainerRow: {
    flexDirection: 'row',
    gap: SIZES.xSmall / 2,
    alignItems: 'center'
  },
  checkBoxText: {
    ...FONTSTYLES.reg10_7373,
    color: COLORS.gray_22
  }
})