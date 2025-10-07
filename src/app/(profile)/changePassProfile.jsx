import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Header, TextField, HeaderBack } from '../../components/common'
import useFetch from '../../hook/useFetch'
import { COLORS, SIZES } from '../../constants'

export default function ChangePassProfile(props) {
  const [old_password, setOld_password] = useState()
  const [new_password, setNew_password] = useState()

  const postChangePass = useFetch('POST', 'auth/change-password', {
    old_password: old_password,
    new_password: new_password,
    id: props.route.params.params_id,
  }, false)

  const handleButton = () => {
    postChangePass.fetchData()
  }

  useEffect(() => {
    postChangePass.data.status == 'success' ?
      Alert.alert(
        'Update Password',
        'Berhasil',
        [
          { text: 'OK', onPress: () => props.navigation.navigate('Home', {screen: 'Profile', params: {}}) },
        ]
      )
      : postChangePass.data.status == 'error' ? alert(postChangePass.data.status)
        : null
  }, [postChangePass.data])

  return (
    <View>
      <View style={{ backgroundColor: 'white' }}>
        <Header backButton title={'Ganti Password'} navigation={props.navigation}/>
      </View>
      <ScrollView style={{ backgroundColor: 'white', paddingHorizontal: SIZES.xLarge }}>
        <TextField
          containerStyle={{ marginTop: 8 }}
          keyboardType={'default'}
          label={'Password Lama'}
          placeholder={'Password Lama'}
          secureTextEntry
          onChangeText={(text) => setOld_password(text)}
          value={old_password}
        />
        <TextField
          containerStyle={{ marginTop: 8 }}
          keyboardType={'default'}
          label={'Password Baru'}
          secureTextEntry
          placeholder={'Password Baru'}
          onChangeText={(text) => setNew_password(text)}
          value={new_password}
        />
      </ScrollView>
      <View style={{ backgroundColor: 'white', padding: SIZES.medium }}>
        {postChangePass.isLoading ?
          <ActivityIndicator size={'large'} color={COLORS.primary} />
          :
          <Button
            title={'Simpan'}
            onPress={handleButton}
          />
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})