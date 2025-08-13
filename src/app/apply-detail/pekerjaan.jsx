import { StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { COLORS, FONTSTYLES, SIZES } from '../../constants';
// import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id'
import useFetch from '../../hook/useFetch';

export default function InfoPekerjaan(props) {
  const [conHeight, setConHeight] = useState(0)
  const getCheckLog = useFetch('GET', 'check-log?jobs_id=' + props.jobsData.id, {})
  const kualifikasi = [
    'Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet,',
  ]
  const isFocused = useIsFocused();
  const [isExpanded, setIsExpanded] = useState(false);



  const list = [
    ['Jadwal Briefing', 'Selasa, 2 Juni 2022 Pk. 09.00'],
    ['Lokasi Briefing', 'Hotel Marriot Surabaya\nJl. A. Yani No. 1, Surabaya'],
    ['Penanggung\nJawab', 'Bp. Adi Yuwono\n031 0123 1323'],
    ['Jadwal Kerja', 'Selasa, 2 Juni 2022 Pk. 09.00'],
    ['Lokasi Kerja', 'Hotel Marriot Surabaya\nJl. A. Yani No. 1, Surabaya'],
  ]

	if(isFocused)
  return (
    <View style={styles.mainContainer}>

      {
        (props.jobsData.briefing != null && props.jobsData.briefing.length > 0) &&
        <View>
          <View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
            <Text style={[FONTSTYLES.p_12, { width: 128, lineHeight: 24 }]}>Jadwal Briefing</Text>
            <Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, lineHeight: 24 }]}>
              {moment(props.jobsData.briefing[0].schedule).format('dddd, D MMMM YYYY [Pk. ]HH.mm')}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
            <Text style={[FONTSTYLES.p_12, { width: 128, lineHeight: 24 }]}>Lokasi Briefing</Text>
            <Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, lineHeight: 24 }]}>
              {props.jobsData.briefing[0].location}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
            <Text style={[FONTSTYLES.p_12, { width: 128, lineHeight: 24 }]}>Penanggung Jawab</Text>
            <Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, lineHeight: 24 }]}>
              {props.jobsData.briefing[0].pic_name}
              {'\n'}
              {props.jobsData.briefing[0].pic_phone}
            </Text>
          </View>
        </View>
      }


      <View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
        <Text style={[FONTSTYLES.p_12, { width: 128, lineHeight: 24 }]}>Jadwal Kerja</Text>
        <Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, lineHeight: 24 }]}>
          {props.jobsData.shift[0].start_date_moment.format('dddd, D MMMM YYYY [Pk. ]HH.mm')}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: SIZES.small }}>
        <Text style={[FONTSTYLES.p_12, { width: 128, lineHeight: 24 }]}>Lokasi Kerja</Text>
        <Text style={[FONTSTYLES.med12_black, { flex: 2, color: COLORS.secondary, lineHeight: 24 }]}>
          {props.jobsData.company.address}
        </Text>
      </View>

      {
				(props.status == 'working' || props.status == 'done') &&
        <View>

          <View style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
            <TouchableNativeFeedback onPress={() => { }}>
              <View style={styles.itemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: SIZES.xSmall }}>
                  <MaterialCommunityIcons
                    name={'qrcode-scan'}
                    size={40}
                    color={COLORS._AcceptedText}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[FONTSTYLES.sBold12_secondary]}>Check-In Kerja</Text>
                    <Text style={[FONTSTYLES.p_12, { color: COLORS.secondary }]}>
                      {getCheckLog.data.data == null ? "-" : getCheckLog.data.data[0]?.date_format}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
            <TouchableNativeFeedback onPress={() => { }}>
              <View style={styles.itemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: SIZES.xSmall }}>
                  <MaterialCommunityIcons
                    name={'qrcode-scan'}
                    size={40}
                    color={COLORS.rockBlue}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[FONTSTYLES.sBold12_secondary]}>Check-Out Kerja</Text>
                    <Text style={[FONTSTYLES.p_12, { color: COLORS.secondary }]}>
                      {getCheckLog.data.data == null ? "-" : getCheckLog.data.data[1]?.date_format}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>

        </View>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
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