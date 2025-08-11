import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { COLORS, FONTSTYLES, SIZES } from '../../constants';
import { Skeleton } from "../../components"
// import { MaterialIcons } from '@expo/vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useFetch from '../../hook/useFetch';

export default function InfoPekerjaan({ onStateChange, data, isLoading, navigation, }) {
  const [conHeight, setConHeight] = useState(0)

  const find_dimensions = ((layout) => {
    const { x, y, width, height } = layout;
    setConHeight(height);
    onStateChange(height)
  })
  const kualifikasi = [
    'Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet,',
    'Lorem ipsum dolor sit amet,',
  ]
  const isFocused = useIsFocused();

  const [isExpanded, setIsExpanded] = useState(false);
  const [workingArea, setWorkingArea] = useState([]);
  const getCity = useFetch('GET', 'city?id=' + workingArea, {}, false)

  const getEducation = useFetch('GET', 'education?id=' + data?.criteria[0].education_id, {}, false)


  useEffect(() => {
    setWorkingArea([])
    data?.working_area.map((item, index) => (
      // console.log('CIty_ID', item.city_id)
      setWorkingArea(prevState => [...prevState, item.city.name])
      // getCityName(item.city_id)
    ))
  }, [data?.working_area])

  useEffect(() => {
    getEducation.refetch()
  }, [data])

	if(isFocused)
  	return (
    	<View style={styles.mainContainer} onLayout={(event) => find_dimensions(event.nativeEvent.layout)}>
				<View>
					<Text style={styles.detailTitle}>Detail</Text>
					{
						isLoading ?
						<Skeleton negWidth={SIZES.xxLarge * 2} height={SIZES.xSmall * 2} borderRadius={SIZES.xSmall} style={{ marginBottom: SIZES.small + 2 }} />
						:
						<Text numberOfLines={isExpanded ? undefined : 3} style={styles.detailText}>
							{data?.description}
						</Text>
					}

					{
						(data?.description != null && data?.description.length > 200) &&
						<TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ marginTop: 5, }}>
							<Text style={[FONTSTYLES.reg10_7373, { color: COLORS._tosca }]}>{!isExpanded ? 'Read more...' : 'Read less'}</Text>
						</TouchableOpacity>
					}
				</View>

      	{
        	isLoading ?
        	<Skeleton negWidth={SIZES.xxLarge * 2} height={SIZES.xSmall * 2} borderRadius={SIZES.xSmall} />
        	:
        	<View style={{ marginTop: 16, }}>
						<Text style={[styles.kualifikasiTitle, { marginTop: 0, }]}>Syarat</Text>
          	<View style={styles.kualifikasiItemContainer}>
            	<MaterialIcons name={'check-circle'} size={16} color={COLORS.secondary} />
            	<Text style={FONTSTYLES.reg10_7373}>
              	{
                	data?.criteria[0].gender == 'male' ? 'Pria' :
                	data?.criteria[0].gender == 'female' ? 'Wanita' :
                	data?.criteria[0].gender == 'both' ? 'Pria / Wanita' :
                	null
              	}
            	</Text>
          	</View>

          	<View style={styles.kualifikasiItemContainer}>
            	<MaterialIcons name={'check-circle'} size={16} color={COLORS.secondary} />
            	<Text style={FONTSTYLES.reg10_7373}>
              	Min. Pendidikan : {getEducation.data.data?.name}
            	</Text>
          	</View>

          	<View style={styles.kualifikasiItemContainer}>
            	<MaterialIcons name={'check-circle'} size={16} color={COLORS.secondary} />
            	<Text style={FONTSTYLES.reg10_7373}>
              	{/* {data?.criteria[0].education_id} */}
              	Usia : {data?.criteria[0].min_age} - {data?.criteria[0].max_age}
            	</Text>
          	</View>

        	</View>
      	}


				<View>
					<Text style={styles.kualifikasiTitle}>Kualifikasi</Text>
					{
						isLoading ?
						<Skeleton negWidth={SIZES.xxLarge * 2} height={SIZES.xSmall * 2} borderRadius={SIZES.xSmall} />
						:
						data?.qualification.map((item, index) =>
							<View key={index} style={styles.kualifikasiItemContainer}>
								<MaterialIcons name={'check-circle'} size={16} color={COLORS.secondary} />
								<Text style={FONTSTYLES.reg10_7373}>{item.name}</Text>
							</View>
						)
					}
				</View>

				<View>
					<Text style={styles.kualifikasiTitle}>Domisili Tempat Tinggal</Text>
					{
						isLoading ?
						<Skeleton negWidth={SIZES.xxLarge * 2} height={SIZES.xSmall * 2} borderRadius={SIZES.xSmall} />
						:
						<View style={styles.kualifikasiItemContainer}>
							<Text style={FONTSTYLES.reg10_7373}>
								{workingArea.join(', ')}
							</Text>
						</View>
					}
				</View>

				<View>
					{
						data?.criteria[0].other != null &&
						<View>
							<Text style={styles.kualifikasiTitle}>Kriteria</Text>
							{
								isLoading ?
								<Skeleton negWidth={SIZES.xxLarge * 2} height={SIZES.xSmall * 2} borderRadius={SIZES.xSmall} />
								:
								<View style={styles.kualifikasiItemContainer}>
									<Text style={FONTSTYLES.reg10_7373}>{data?.criteria[0].other}</Text>
								</View>
							}
						</View>
					}
				</View>

				<View>
					{
						data?.benefit != null &&
						<View>
							<Text style={styles.kualifikasiTitle}>Benefit</Text>
							{
								isLoading ?
								<Skeleton negWidth={SIZES.xxLarge * 2} height={SIZES.xSmall * 2} borderRadius={SIZES.xSmall} />
								:
								<View style={styles.kualifikasiItemContainer}>
									<Text style={FONTSTYLES.reg10_7373}>{data?.benefit}</Text>
								</View>
							}
						</View>
					}
				</View>
    	</View>
  	)
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.lightWhite,
    paddingHorizontal: SIZES.xxLarge,
    paddingVertical: SIZES.large
  },
  detailTitle: {
    ...FONTSTYLES.med10_black,
		fontWeight: 700,
		fontSize: 14,
    // marginBottom: 5
  },
  detailText: {
    ...FONTSTYLES.reg10_7373,
    lineHeight: SIZES.large,
    // marginBottom: SIZES.medium
  },
  kualifikasiTitle: {
    ...FONTSTYLES.med10_black,
    marginTop: SIZES.medium,
    marginBottom: 5,
		fontWeight: 700,
		fontSize: 14,
  },
  kualifikasiItemContainer: {
    // marginBottom: 5,
    flexDirection: 'row',
    gap: SIZES.small,
    alignItems: 'flex-start'
  }
})