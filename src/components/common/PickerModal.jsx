import React, {useEffect, useState} from 'react';
import {
	View,
	TextInput,
	TouchableHighlight,
		TouchableNativeFeedback,
		Text,
		Modal,
		Image,
		TouchableOpacity
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleDot, } from '@fortawesome/free-solid-svg-icons'
import { faCircle, } from '@fortawesome/free-regular-svg-icons'

import theme from '../../constants/theme'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Base from '../../utils/base';
import { COLORS, FONTS, FONTSTYLES, SIZES } from '../../constants'
import Button from './Button';
import { ScrollView } from 'react-native-gesture-handler';

export default function PickerModal(props){
	const [selected, setSelected] = useState({})

	useEffect(() => {
		setSelected(props.value)
	}, [props.value, ])

	return(
		<Modal
			animationType='fade'
			transparent={true}
			visible={props.isModal}>
			<TouchableOpacity activeOpacity={1} style={{flex : 1, backgroundColor : '#00000090'}} onPress={() => props.onModalClosed()}>
				<View style={{justifyContent : 'center', flex : 1, padding : 8, }}>
					<View style={{backgroundColor : 'white', flexDirection: 'column', borderRadius : 8, padding : 8, maxHeight: '80%', }}>
						<View>
							<Text style={[ FONTSTYLES.inputLabel, ]}>{props.title}</Text>
						</View>

						<ScrollView style={{ }}>
							<View style={{ marginTop: 16, flex: 1, }}>
							{
								props.arr_option.map((option, index) => (
									<TouchableOpacity onPress={() => setSelected(option)} style={{ borderRadius: 8, }} key={index}>
										<View key={index} style={{ paddingHorizontal: 8, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', }}>
											<View>
												<FontAwesomeIcon icon={selected.id == option.id ? faCircleDot : faCircle} style={{ color: COLORS.primary, }}/>
											</View>

											<View style={{ marginLeft: 8, }}>
												<Text>{option.name}</Text>
											</View>
										</View>
									</TouchableOpacity>
								))
							}
							</View>
						</ScrollView>

						<View style={{ marginTop: 16, }}>
							<Button title="Simpan" onPress={() => props.onOptionClicked(selected)} />
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	)
}