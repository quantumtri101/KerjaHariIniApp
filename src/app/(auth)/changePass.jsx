import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Image, } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { TextField, Button, Modals, Header } from '../../components'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { svg_confirmed } from '../../assets'
import useFetch from '../../hook/useFetch'
import Check_TextField_Phone from '../../utils'

export default function ChangePass(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [isPhoneError, setIsPhoneError] = useState(false)
  const [isPhoneErrorMessage, setIsPhoneErrorMessage] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const getProfile = useFetch('GET', 'auth/profile', {}, false)

  const { data, isLoading, error, refetch } = useFetch("POST", "auth/change-password", {
    "phone": props.route.params.phone,
    "new_password": newPassword,
    "id": getProfile.data.data?.id
  }, false);

  const [buttonDisabled, setButtonDisabled] = useState(true)

  const handleForgotPass = async () => {
    refetch()
  }

  const modalButton = () => {
    setModalVisible(false)
		props.navigation.replace('Auth', {screen : 'Login', })
  }

  useEffect(() => {
    newPassword == '' ? setButtonDisabled(true) : setButtonDisabled(false)
  }, [newPassword])

  useEffect(() => {
    if (data.status == 'success') {
      setModalVisible(true)
    } else if (data.status == 'error') {
      setIsPhoneError(true)
      setIsPhoneErrorMessage(data.message)
    }
  }, [data])

  return (
    <ScrollView style={{
      paddingHorizontal: SIZES.xLarge,
      paddingVertical: SIZES.xSmall,
      backgroundColor: COLORS.white
    }}>
			<Header />

      <View style={{
        flex: 1,
				marginTop: 20,
      }}>
        <Text style={FONTSTYLES.h1}>Ganti Password</Text>
        <Text style={FONTSTYLES.p}>Silahkan masukkan Kode OTP yang diterima serta Password baru anda</Text>

        <TextField
          containerStyle={{ marginTop: SIZES.large }}
          label={'Password baru'}
          placeholder={'Masukkan password baru anda'}
          onChangeText={(value) => setNewPassword(value)}
          returnKeyType={'done'}
          value={newPassword}
          required
          secureTextEntry
          error={isPhoneError}
          errorMessage={isPhoneErrorMessage}
        />
        {isLoading ?
          <ActivityIndicator size={'large'} color={COLORS.primary} />
          :
          <Button
            title='Simpan'
            onPress={() => handleForgotPass()}
            style={{ marginTop: SIZES.large }}
            disable={buttonDisabled}
          />
        }
      </View>
      <Modals
        svg={svg_confirmed}
        title={'Selamat!'}
        desc={'Password anda berhasil direset, silahkan login dengan password baru anda.'}
        buttonTitle={'Login'}
        visible={modalVisible}
        onPress={modalButton}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  otp_container: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.xSmall
  },
  otp: {
    flex: 1,
    padding: SIZES.small / 2,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: SIZES.medium / 2,
    minHeight: 62,
    textAlign: 'center',
    fontSize: SIZES.large,
    fontFamily: FONTS.bold
  },
  _focus: {
    borderColor: COLORS.primary,
  },
})