import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/common/header/header'
import { COLORS, SIZES } from '../../constants'
import { Button, TextField } from '../../components'

export default function ApplyJobs(props) {
  const [content, setContent] = useState('')

  return (
    <View>
      <View style={{ backgroundColor: 'white' }}>
        <Header backButton title={'Isi Surat Lamaran'} navigation={props.navigation}/>
      </View>

      <ScrollView style={{ backgroundColor: 'white', padding: SIZES.xLarge }}>
        <TextField
          required
          label={'Surat Lamaran'}
          keyboardType={'default'}
          placeholder={'Isi Surat Lamaran'}
          multiline
          numberOfLines={10}
          onChangeText={(v) => setContent(v)}
        />
      </ScrollView>
      <View style={{ padding: 16, backgroundColor: COLORS.white }}>
        <Button title={'Lamar'} style={{ height: 30 }}
					onPress={() => props.navigation.navigate('JobDetail', {screen: 'ApplyReview', params: {jobs_id: props.route.params.jobs_id, content: content, }}) }
					disable={!content}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})