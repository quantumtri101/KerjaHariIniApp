import { ScrollView, StyleSheet, Text, View, FlatList, TouchableNativeFeedback, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { Stack, useRouter } from 'expo-router'
import Header from '../../components/common/header/header'
import { COLORS, FONTSTYLES, SIZES, FONTS } from '../../constants'
import { Button, TextField, HeaderResume, } from '../../components'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { gif_faceRecognition } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function FaceRecognition(props) {
	// const router = useRouter()

	// const getIdImage64Async = async () => {
	// 	let a = await AsyncStorage.getItem('id_image')
	// 	// console.log('base64', JSON.parse(a))
	// }

	useEffect(() => {
		if(props.route.params.reviewResume == null)
			AsyncStorage.setItem('lastResumePage', 'FaceRecognition')
	}, [])

	function onGoBack(){
    props.navigation.goBack()
		props.route.params.onGoBack()
	}

	function onNextClicked(){
		if(props.route.params.reviewResume)
			props.navigation.navigate('Resume', {screen : 'SelfieKtp', params: {editResume: props.route.params.editResume, reviewResume: props.route.params.reviewResume, id_image: props.route.params.id_image, onGoBack: () => onGoBack(),}, })
		else
			props.navigation.navigate('Resume', {screen : 'SelfieKtp', params: {}, })
	}

	return (
		<>
			{/* <Stack.Screen
				options={{
					header: () => null
				}}
			/> */}
			<View style={{ backgroundColor: 'white' }}>
				<Header backButton title={'Pengisian Resume'} navigation={props.navigation}/>
			</View>
			<HeaderResume numText='6' title="Selfie KTP"/>

			<View style={styles.mainContainer}>
				<View style={styles.centerContainer}>
					<Text style={styles.title}>
						Bersiaplah untuk{'\n'}mengambil gambar{'\n'}wajah anda sambil memegang{'\n'}KTP
					</Text>
					<Image source={gif_faceRecognition} style={styles.svg} resizeMode='cover' />
				</View>
			</View>
			<View style={{ padding: 16, backgroundColor: COLORS.white }}>
				<Button title={'Lanjut'} style={{ height: 30 }} onPress={() => onNextClicked()} />
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	numBox: {
		...FONTSTYLES.sBold16_secondary,
		width: 35,
		height: 35,
		textAlign: 'center',
		textAlignVertical: 'center',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.gray
	},
	mainContainer: {
		flex: 1,
		backgroundColor: 'white'
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: SIZES.xLarge
	},
	svg: {
		// width:'100%',
		// aspectRatio: 3/2
	},
	title: {
		fontFamily: FONTS.semibold,
		fontSize: SIZES.medium,
		textAlign: 'center',
		marginTop: SIZES.medium,
		color: COLORS.gray_22,
	},
	subTitle: {
		...FONTSTYLES.p,
		textAlign: 'center'
	}
})
