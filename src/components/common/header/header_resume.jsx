import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import { COLORS, FONTS, FONTSTYLES, images, SIZES } from '../../../constants'
import React, { useEffect } from 'react'
import Base from '../../../utils/base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HeaderResume(props) {
	var base = new Base()

  return (
    <View
			style={{
				flexDirection: "row",
				backgroundColor: "white",
				alignItems: "center",
				paddingBottom: 16,
			}}>
			<View style={{ width: SIZES.xLarge, height: 2, backgroundColor: "rgba(0,0,0,0.1)" }} />
			<View style={styles.numBox}>
				<Text style={FONTSTYLES.sBold16_secondary}>{props.numText}</Text>
			</View>
			<Text style={[FONTSTYLES.sBold16_secondary, {marginLeft: SIZES.small, }, ]}>{props.title}</Text>
			<View style={{ flex: 1, height: 2, backgroundColor: "rgba(0,0,0,0.1)" }} />
		</View>
  )
}

const styles = StyleSheet.create({
	numBox: {
		...FONTSTYLES.sBold16_secondary,
		flexDirection: 'row',
		justifyContent: 'center',
		textAlign: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.gray,
	},
});