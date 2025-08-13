import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { Stack } from 'expo-router'
import MapView, { MapMarker, PROVIDER_GOOGLE } from 'react-native-maps'
import { SIZES } from '../../constants'
import { Header } from '../../components/common'
// import * as Location from 'expo-location'

export default function LokasiKerja(props) {
  const [location, setLocation] = useState(null)
  // const [hasLocationPermission, setHasLocationPermission] = useState(null)

  useEffect(async () => {
    // const locationPermission = await Location.requestForegroundPermissionsAsync()
		// setHasLocationPermission(locationPermission === 'granted')
  },[])

  return (
    <View>
      {/* <Stack.Screen
        options={{
          header: () => null
        }}
      /> */}
      <View style={{ flex: 1, backgroundColor: 'white', }}>

				<View style={{ zIndex: 9999, backgroundColor: 'white', }}>
          <Header backButton title={'Detail Lamaran'} navigation={props.navigation}/>
        </View>

        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}/>
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    // width: '100%',
    // height: '100%',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // position: 'absolute'
  }
})