import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import { COLORS, FONTS, FONTSTYLES, images, SIZES } from '../../../constants'
import React, { useEffect } from 'react'
// import { FontAwesome5 } from '@expo/vector-icons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LocalSvg } from 'react-native-svg/css'
import { notification } from '../../../assets'
// import { useRouter } from 'expo-router'
import useFetch from '../../../hook/useFetch'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({ withNotif, noInsets, title, backButton, onBackPress, rightIcon, rightIconOnPress, navigation, style, withImage = true, }) => {
  const insets = useSafeAreaInsets()
  // const router = useRouter()
  const getUnreadNotification = useFetch('GET', 'notification/total-read', {})
  // useEffect(() => {

  // },[onBackPress])
  // useEffect(() => {
  // }, [getNotification.data])
  return (
    <View style={[
      styles.mainContainer, 
      // { marginTop: noInsets ? SIZES.xSmall : insets.top },
      style,
    ]}>
      {backButton &&
        <View style={styles.backButton}>
          <TouchableNativeFeedback onPress={() => onBackPress != null ? onBackPress() : navigation.goBack()} style={{}}>
            {/* <View style={styles.backButton}> */}
              <MaterialCommunityIcons name={'chevron-left'} size={16} style={{ color: COLORS.black_12, }}/>
            {/* </View> */}
          </TouchableNativeFeedback>
        </View>
      }
			<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
      	{
					title ?
        	<Text style={styles.titleMain}>{title}</Text>
        	: withImage &&
        	<View style={{ flex: 1 }}>
          	<Image
            	source={images.headerLogo}
            	resizeMode='contain'
            	style={{ width: 112, height: 41 }}
          	/>
        	</View>
      	}
			</View>

      {
				withNotif &&
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <LocalSvg
            asset={notification}
            style={{
              width: 23,
              height: 25
            }}
          />
          {
            getUnreadNotification.data.data > 0 &&
            <MaterialCommunityIcons
              name='circle'
              color={COLORS.primary}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          }
        </TouchableOpacity>
      }

      {
				rightIcon &&
        <TouchableOpacity onPress={rightIconOnPress}>
          {rightIcon}
        </TouchableOpacity>
      }
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  mainContainer: {
    gap: SIZES.xLarge,
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.xLarge,
    paddingBottom: SIZES.small,
  },
  titleMain: {
    // flex: 1,
    // height: 41,
    textAlignVertical: 'center',
    color: COLORS.gray_22,
    fontFamily: FONTS.semibold,
    fontSize: 18,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: 'white',
    elevation: 10,
    padding: 8,
    shadowColor: '#00000080',
    shadowOpacity: .2,
    shadowOffset: {
      width: .5,
      height: 0,
    },
    shadowRadius: 10,
    borderRadius: 18,
    // height: 37,
    // width: 37,
    alignItems: 'center',
    justifyContent: 'center',
    // overflow: 'hidden'
  }
})