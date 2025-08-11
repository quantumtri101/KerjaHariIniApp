import {StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
// import { Stack, useRouter } from 'expo-router'
import Header from '../../components/common/header/header'
import { COLORS, FONTSTYLES, SIZES, FONTS, } from '../../constants'
import { Button, HeaderResume, } from '../../components'
import {png_resumeKtp } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function KTP(props) {
	// const router = useRouter()

	useEffect(() => {
		if(props.route.params.reviewResume == null)
			AsyncStorage.setItem('lastResumePage', 'KTP')
	}, [])

	function onGoBack(){
		props.route.params.onRefresh()
		props.navigation.goBack()
	}

	function onNextAction(){
		if(props.route.params.reviewResume)
			props.navigation.navigate('Resume', {screen : 'KtpCamera', params: {editResume: props.route.params.editResume, reviewResume: props.route.params.reviewResume, onGoBack: () => onGoBack(), }, })
		else
			props.navigation.navigate('Resume', {screen : 'KtpCamera', params: {}, })
	}

	return (
		<>
			{/* <Stack.Screen
				options={{
					header: () => null
				}}
			/> */}
			<View style={{ paddingVertical: SIZES.medium, backgroundColor: 'white' }}>
				<Header backButton title={'Pengisian Resume'} navigation={props.navigation}/>
			</View>
			<HeaderResume numText='5' title="KTP"/>

			<View style={styles.mainContainer}>
				<View style={styles.centerContainer}>
					<Text style={styles.title}>
						Bersiaplah untuk memegang{'\n'}bagian depan Kartu Tanda{'\n'}Penduduk anda
					</Text>
					<Image source={png_resumeKtp} style={styles.svg} resizeMode='cover' />
				</View>
			</View>
			<View style={{ padding: 16, backgroundColor: COLORS.white }}>
				<Button title={'Lanjut'} style={{ height: 30 }} onPress={() => onNextAction()} />
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
