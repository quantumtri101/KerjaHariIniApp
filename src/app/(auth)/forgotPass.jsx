import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Image, } from 'react-native'
import React, {useEffect, useState}from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Stack, useRouter } from 'expo-router'
import {TextField, Button, Modals, HeaderBack} from '../../components'
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import { svg_confirmed } from '../../assets'
import useFetch from '../../hook/useFetch'
import Check_TextField_Phone from '../../utils'
import Header from '../../components/common/header/header'

export default function ForgotPass(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [isPhoneError, setIsPhoneError] = useState(false)
  const [isPhoneErrorMessage, setIsPhoneErrorMessage] = useState(false)
  const [phone, setPhone] = useState('')
  const modalButton = () =>{
    setModalVisible(false)
		props.navigation.replace('Auth', {screen : 'Login', })
  }

  const { data, isLoading, error, refetch, setRefetch } = useFetch("POST", "auth/forget-password", {
    phone: phone,
  }, false);

  const handleForgotPass = async () => {
    if(phone == '')
			setIsPhoneError(true)
		else
    	setRefetch()
  }

  useEffect(() => {
    if(data.status == 'success'){
			props.navigation.replace('Auth', {screen : 'OTPScreen', params: {prev: 'forgotPass', phone: phone, }, })
    }else if(data.status == 'error'){
      setIsPhoneError(true)
      setIsPhoneErrorMessage(data.message)
    }
  }, [data])

  return (
		<View style={{ backgroundColor: 'white', flex: 1, }}>
			<Header backButton navigation={props.navigation} withImage={false}/>

    	<ScrollView style={{
      	paddingHorizontal: SIZES.xLarge,
      	paddingVertical: SIZES.xSmall,
      	backgroundColor: COLORS.white
    	}}>
      	<View style={{
        	flex: 1,
					marginTop: 20,
      	}}>
        	<Text style={FONTSTYLES.h1}>Lupa Password</Text>
        	<Text style={FONTSTYLES.p}>Input No. Handphone anda untuk mendapatkan arahan penggantian password</Text>
        	<TextField
          	containerStyle={{ marginTop: SIZES.medium * 2 }}
          	label={'No. Handphone'}
          	placeholder={'+62'}
						defaultValue={"+62"}
          	onChangeText={(value) => setPhone(value)}
          	returnKeyType={'done'}
          	error={isPhoneError}
          	errorMessage={isPhoneErrorMessage}
          	keyboardType='phone-pad'
        	/>
        	{isLoading ?
          	<ActivityIndicator size={'large'} color={COLORS.primary}/>
          	:
          	<Button title='Masuk' onPress={() => handleForgotPass()} style={{ marginTop: SIZES.large}} disable={phone == '' ? true : false}/>
        	}
      	</View>
    	</ScrollView>
		</View>
  )
}