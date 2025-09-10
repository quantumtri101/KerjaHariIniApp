import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import { StackActions } from '@react-navigation/native';
import { COLORS, SIZES } from "../constants";
import { Alert, Button, Header, Modals } from '../components/common'
// import { Stack, useLocalSearchParams, useRouter } from "expo-router";
// import * as Location from 'expo-location'
import { calculateDistance } from "../utils";
// import { Feather } from '@expo/vector-icons'
import Feather from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import useFetch from "../hook/useFetch";
import { svg_qr } from "../assets";
import moment from "moment";
// import Icons from '@expo/vector-icons/MaterialCommunityIcons'
import 'moment/locale/id'


export default function Maps(props) {
  // const router = useRouter()
  // const { from, state, qrID, jobsName, companyLat, companyLong } = useLocalSearchParams()
  const [disabledProceed, setDisableProceed] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  })
  const [targetlocation, setTargetLocation] = useState({
    latitude: 0,
    longitude: 0,
  })

  // const [hasLocationPermission, setHasLocationPermission] = useState(null)

  const postCheckLog = useFetch('POST', 'check-log/action', {
    id: props.route.params.params.qrID,
    latitude: location.latitude,
    longitude: location.longitude,
  }, false)

  useEffect(() => {
		setTargetLocation({
			latitude: parseFloat(props.route.params.params.companyLat),
			longitude: parseFloat(props.route.params.params.companyLong),
		})

		Geolocation.requestAuthorization()
		Geolocation.getCurrentPosition(info => {
			setLocation({
				latitude: parseFloat(info.coords.latitude),
				longitude: parseFloat(info.coords.longitude),
			})
		})
    // setTimeout(() => {
      // getLocation()
      // checkRadius()
      // location.latitude == 0 && getLocation()
    // }, 500);
  }, [])

  useEffect(() => {
		if(location.latitude != 0 && location.longitude != 0 && targetlocation.latitude != 0 && targetlocation.longitude != 0)
    	getLocation()
  }, [location, targetlocation,])

  useEffect(() => {
    if(postCheckLog.data.status != null){
      if (postCheckLog.data.status == 'success') {
        setModalVisible(true)
      } 
      else
        alert(postCheckLog.data.message)
    }
  }, [postCheckLog.data])

  function getLocation(){
		const distance = calculateDistance(location.latitude, location.longitude, targetlocation.latitude, targetlocation.longitude)
		setDisableProceed(distance > 500)
	}

  function onSuccessModalAction(){
    setModalVisible(false)
    props.navigation.dispatch(
      StackActions.replace('Home', {screen: 'HomeTab', params: {}})
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ zIndex: 9999, }}>
        <Header
          backButton
					navigation={props.navigation}
          title={props.route.params.params.from == 'scanQR' ? 'Konfirmasi Lokasi Anda' : 'Lokasi Kerja'}
          rightIcon={<Feather name="refresh-ccw" size={SIZES.xLarge} />}
          rightIconOnPress={() => getLocation()}
        />
      </View>
      <View style={styles.container}>
        {
					(props.route.params.params.from == 'scanQR' && disabledProceed) &&
          <View style={{ padding: SIZES.medium, position: 'absolute', top: 0, zIndex: 9999 }}>
            <Alert.Error text={'Anda berada di luar area kerja.'} />
          </View>
        }
				{
					(location.latitude != 0 && location.longitude != 0 && targetlocation.latitude != 0 && targetlocation.longitude != 0) &&
					<MapView
						style={styles.map}
						//specify our coordinates.
						initialRegion={{
							latitude: props.route.params.params.from == 'scanQR' ? location.latitude : targetlocation.latitude,
							longitude: props.route.params.params.from == 'scanQR' ? location.longitude : targetlocation.longitude,
							latitudeDelta: 0,
							longitudeDelta: 0.003,
						}}>
						{
							props.route.params.params.from == 'scanQR' &&
							<Marker
								coordinate={location}
								pinColor={COLORS.primary}
								style={{ alignItems: 'center' }}>
								<Text style={styles.pinLabelContainer}>Lokasi Anda</Text>
								<Icons name="map-marker" size={SIZES.xxLarge * 1.5} color={COLORS.primary} />
							</Marker>
						}

						<Marker
							coordinate={targetlocation}
							pinColor={COLORS.primary}
							style={{ alignItems: 'center' }}>
							<Text style={styles.pinLabelContainer}>Lokasi Kerja</Text>
							<Icons name="map-marker" size={SIZES.xxLarge * 1.5} color={COLORS.primary_half} />
						</Marker>

						<Circle
							center={targetlocation}
							radius={500}
							strokeColor={COLORS.primary}
							strokeWidth={2}
							fillColor={COLORS.primary_half}/>

					</MapView>
				}

      </View>
      {
				props.route.params.params.from == 'scanQR' &&
        <View style={{ padding: SIZES.medium, backgroundColor: COLORS.white }}>
          <Button title={props.route.params.params.state == 'check_in' ? 'Check In' : props.route.params.params.state == 'check_out' ? 'Check Out' : ''} onPress={() => postCheckLog.refetch()} disable={disabledProceed} />
        </View>
      }
      <Modals
        svg={svg_qr}
        title={props.route.params.params.jobsName}
        desc={'Berhasil ' + (props.route.params.params.state == 'check_in' ? 'Check In\n' : props.route.params.params.state == 'check_out' ? 'Check Out\n' : '') + moment().format('dddd, DD MMM YYYY[\n][Pk. ]HH.mm')}
        buttonTitle={'Kembali'}
        visible={modalVisible}
        onPress={() => onSuccessModalAction()}/>
    </View>
  );
}

//create our styling code:
const styles = StyleSheet.create({
  container: {
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pinLabelContainer: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium / 2,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium / 4,
    color: COLORS.black_12,
  }
});