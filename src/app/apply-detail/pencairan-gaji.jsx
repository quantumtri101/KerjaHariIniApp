import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { COLORS, FONTSTYLES, SIZES } from '../../constants';
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PencairanGaji(props) {
  const [conHeight, setConHeight] = useState(0)
  const isFocused = useIsFocused();
  const [isExpanded, setIsExpanded] = useState(false);

  const detailLorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel mauris id risus fermentum dapibus. Pellentesque faucibus risus vitae sapien pellentesque finibus. Fusce efficitur ligula eget magna maximus semper. Curabitur id ex eget justo aliquam eleifend. Duis a nisl eget tortor tempus sagittis. Sed vestibulum odio et elementum luctus. Suspendisse potenti. Vivamus pulvinar ligula vel ex eleifend congue. In in neque nibh. Donec convallis facilisis massa, ac auctor dolor rutrum id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras convallis nisl sed ligula posuere dictum. Integer congue velit dui, sit amet commodo ipsum hendrerit sed.'

	if(isFocused)
  return (
    <View style={styles.mainContainer}>

      <View style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
        <View style={styles.itemContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: SIZES.xSmall }}>
            <MaterialCommunityIcons
              name={'circle'}
              size={16}
              color={COLORS._AcceptedText}
            />
            <Text style={[FONTSTYLES.med12_black, { flex: 1, color: COLORS.gray }]}>Gaji Pokok</Text>
            <Text style={[FONTSTYLES.sBold14_secondary, { minWidth: 100 }]}>{props.applicationData.salary_approve_format}</Text>
          </View>
          <View>
            <Text style={[FONTSTYLES.p, { fontSize: SIZES.xSmall }]}>{props.applicationData.is_approve_salary == 'not_yet_approved' ? 'Sedang diproses' : 'Tercairkan ' + props.applicationData.salary_sent_at_moment.format('DD MMMM YYYY HH:mm')}</Text>
          </View>
        </View>
      </View>

      {
				props.applicationData.additional_salary != 0 &&
        <View style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
          <View style={styles.itemContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: SIZES.xSmall }}>
              <MaterialCommunityIcons
                name={'circle'}
                size={16}
                color={COLORS._AcceptedText}
              />
              <Text style={[FONTSTYLES.med12_black, { flex: 1, color: COLORS.gray }]}>Gaji Lemburan</Text>
              <Text style={[FONTSTYLES.sBold14_secondary, { minWidth: 100 }]}>{props.applicationData.additional_salary_format}</Text>
            </View>
            <View>
              <Text style={[FONTSTYLES.p, { fontSize: SIZES.xSmall }]}>{props.applicationData.is_approve_salary == 'not_yet_approved' ? 'Sedang diproses' : 'Tercairkan ' + props.applicationData.salary_sent_at_moment.format('DD MMMM YYYY HH:mm')}</Text>
            </View>
          </View>
        </View>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: COLORS.lightWhite,
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