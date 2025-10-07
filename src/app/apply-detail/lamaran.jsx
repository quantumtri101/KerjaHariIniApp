import { Pressable, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View, ScrollView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { COLORS, FONTSTYLES, SIZES } from '../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useFetch from '../../hook/useFetch';
import moment from 'moment';
import 'moment/locale/id'

export default function Lamaran(props) {
  const [conHeight, setConHeight] = useState(0)
  const resumeItem = [
    { icon: 'file', title: 'CV Anda', status: props.applicationData.resume_id, },
    { icon: 'file', title: 'Surat Lamaran', status: props.applicationData.content, },
    { icon: 'file', title: 'General Quiz', status: props.applicationData.general_quiz_result_id, }
  ]
  const isFocused = useIsFocused();
  const [isExpanded, setIsExpanded] = useState(false);

  const detailLorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel mauris id risus fermentum dapibus. Pellentesque faucibus risus vitae sapien pellentesque finibus. Fusce efficitur ligula eget magna maximus semper. Curabitur id ex eget justo aliquam eleifend. Duis a nisl eget tortor tempus sagittis. Sed vestibulum odio et elementum luctus. Suspendisse potenti. Vivamus pulvinar ligula vel ex eleifend congue. In in neque nibh. Donec convallis facilisis massa, ac auctor dolor rutrum id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras convallis nisl sed ligula posuere dictum. Integer congue velit dui, sit amet commodo ipsum hendrerit sed.'

	if(isFocused)
  	return (
			<ScrollView>
    		<View style={styles.mainContainer} >
      		{
						(props.status != 'wait' && props.status != 'declined' && props.jobsData.interview != null && props.jobsData.interview.length > 0) &&
        		<View style={{ marginBottom: SIZES.small }}>

          		<Text style={[FONTSTYLES.sBold12_222, { marginBottom: SIZES.small }]}>Informasi Interview</Text>

          		<View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
            		<Text style={[FONTSTYLES.p_12, { width: 128 }]}>Jadwal Interview</Text>
            		<Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary }]}>
              		{moment(props.jobsData.interview.schedule).format('dddd, D MMMM YYYY [Pk. ]HH.mm')}
            		</Text>
          		</View>

          		<View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
            		<Text style={[FONTSTYLES.p_12, { width: 128 }]}>Tipe Interview</Text>
            		<Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, textTransform: 'capitalize' }]}>
              		{props.jobsData.interview.type}
            		</Text>
          		</View>

          		{
								(props.jobsData.interview.type == 'online' && props.jobsData.interview.zoom_url != null) &&
            		<View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
              		<Text style={[FONTSTYLES.p_12, { width: 128 }]}>Link Zoom</Text>
              		<Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary }]}>
                		{props.jobsData.interview.zoom_url}
              		</Text>
            		</View>
          		}

          		{
								props.jobsData.interview.type == 'offline' &&
            		<View>
              		<View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
                		<Text style={[FONTSTYLES.p_12, { width: 128, lineHeight: 24 }]}>Lokasi Interview</Text>
                		<Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, lineHeight: 24 }]}>
                  		{props.jobsData.interview.location}
                		</Text>
              		</View>
              		<View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
                		<Text style={[FONTSTYLES.p_12, { width: 128, lineHeight: 24 }]}>Interviewer</Text>
                		<Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, lineHeight: 24 }]}>
                  		{props.jobsData.interview.interviewer_name}
                  		{'\n'}
                  		{props.jobsData.interview.interviewer_phone}
                		</Text>
              		</View>
            		</View>
          		}

        		</View>
      		}

					<View>
      			{
							resumeItem.map((item, index) =>
        				<View style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 8 }} key={index}>
          				<TouchableNativeFeedback onPress={() => { }}>
            				<View style={styles.itemContainer}>
              				<View style={{ flexDirection: 'row', alignItems: 'stretch', gap: SIZES.xSmall }}>
                				<MaterialCommunityIcons
                  				name={item.icon}
                  				size={18}
                  				color={COLORS.rockBlue}
                				/>
                				<Text style={[FONTSTYLES.sBold12_secondary, { flex: 1 }]}>{item.title}</Text>
                				<MaterialCommunityIcons
                  				name={item.status ? 'check-circle-outline' : 'close-circle-outline'}
                  				size={16}
                  				color={item.status ? COLORS._AcceptedText : COLORS._RejectedText}
                				/>
              				</View>
            				</View>
          				</TouchableNativeFeedback>
        				</View>
      				)
						}
					</View>
    		</View>
			</ScrollView>
  	)
}

const styles = StyleSheet.create({
  mainContainer: {
		flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.large
  },
  detailTitle: {
    ...FONTSTYLES.med10_black,
    marginBottom: 5
  },
  detailText: {
    ...FONTSTYLES.reg10_7373,
    lineHeight: SIZES.large,
  },
  kualifikasiTitle: {
    ...FONTSTYLES.med10_black,
    marginTop: SIZES.medium,
    marginBottom: 5
  },
  kualifikasiItemContainer: {
    marginBottom: 5,
    flexDirection: 'row',
    gap: SIZES.small,
    alignItems: 'flex-start'
  },
  itemContainer: {
    padding: SIZES.medium,
    borderRadius: SIZES.medium / 2,
    backgroundColor: COLORS.lightWhite2,
    gap: SIZES.xSmall / 2
  },
})