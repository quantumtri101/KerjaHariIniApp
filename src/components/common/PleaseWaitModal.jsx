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
import theme from '../../constants/theme'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Base from '../../utils/base';

export default class ModalPreloader extends Base{
	render(){
		const { isModal } = this.props
		return(
			<Modal
				animationType='fade'
				transparent={true}
				visible={isModal}>
				<TouchableOpacity activeOpacity={1} style={{flex : 1, backgroundColor : '#00000090'}}>
					<View style={{justifyContent : 'center', flex : 1, padding : 8}}>
							<View style={{backgroundColor : 'white', borderRadius : 8, padding : 8}}>
									<View>
											<Text style={{fontWeight : 'bold', fontSize : 16}}>Mohon Menunggu</Text>
									</View>
							</View>
					</View>
				</TouchableOpacity>
			</Modal>
		)
	}
}