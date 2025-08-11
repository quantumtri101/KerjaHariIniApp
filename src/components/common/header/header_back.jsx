import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import { COLORS, FONTS, FONTSTYLES, images, SIZES } from '../../../constants'
import React, { useEffect } from 'react'
// import { FontAwesome5 } from '@expo/vector-icons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import { LocalSvg } from 'react-native-svg'
import { notification } from '../../../assets'
// import { useRouter } from 'expo-router'
import useFetch from '../../../hook/useFetch'
import Base from '../../../utils/base'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HeaderBack(props) {
	var base = new Base()

  return (
    <View style={{ marginLeft: 12, marginTop: 20, }}>
			<TouchableOpacity onPress={() => props.navigation.goBack()}>
				<MaterialCommunityIcons
					name="chevron-left"
					size={SIZES.xLarge * 1.5}
					color={COLORS.black}
				/>
			</TouchableOpacity>
		</View>
  )
}

const styles = StyleSheet.create({})