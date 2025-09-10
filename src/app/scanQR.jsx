import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, TouchableOpacity, Image } from 'react-native';
// import { Camera, FlashMode } from 'expo-camera';
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, useCameraDevices, useCameraDevice, useCodeScanner, } from 'react-native-vision-camera';
import { Button, Header, Modals, PleaseWaitModal } from '../components'
import { SIZES } from '../constants';
// import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import image from '../constants/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as MediaLibrary from 'expo-media-library'
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import * as Location from 'expo-location'
import useFetch from '../hook/useFetch';
import Base from '../utils/base'
import { svg_confirmed, svg_qr } from '../assets';
import moment from 'moment';
import 'moment/locale/id'

export default function ScanQR(props) {
  var base = new Base()
  // const router = useRouter()
  // const { state } = useLocalSearchParams()
  const { width, height } = Dimensions.get('window');

	const device = useCameraDevice('back')
  // const [hasCameraPermission, setHasCameraPermission] = useState(null);
  // const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  // const [hasBarcodePermission, setHasBarcodePermission] = useState(null)
  // const [hasLocationPermission, setHasLocationPermission] = useState(null)
  const [scanned, setScanned] = useState(false);
	const [isProcess, setIsProcess] = useState(false);
	const [isShowPleaseWait, setIsShowPleaseWait] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true)
  // const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [location, setLocation] = useState(null)
  const [qrID, setQrID] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const getJobs = useFetch('GET', 'jobs?id=' + qrID, {}, false)

  // const [scanned, setScanned] = useState(false);

  const cameraRef = useRef()
	const codeScanner = useCodeScanner({
		codeTypes: ['qr', 'ean-13'],
		onCodeScanned: (codes) => {
			if(!isShowPleaseWait){
				setIsShowPleaseWait(true)
        setIsCameraActive(false)
				getJobs.setFetchUrl('jobs?id=' + codes[0].value)
        getJobs.refetch()
			}
		}
	})

  useEffect(() => {
		initPermission()
  }, []);

	useEffect(() => {
    console.log(getJobs.data.status)
		if(getJobs.data.status != null){
      if(getJobs.data.status == 'success'){
        setIsShowPleaseWait(false)
        setModalVisible(true)
      }
      else{
        alert(getJobs.data.message)
        setIsShowPleaseWait(false)
      }
		}
    else{
      setIsShowPleaseWait(false)
    }
    setIsCameraActive(true)
	}, [getJobs.data,])

  async function initPermission(){
    const status = await Camera.getCameraPermissionStatus();
    if(status != 'authorized'){
      const permission = await Camera.requestCameraPermission();
    }
  }

	function onModalSubmit(){
		setModalVisible(false)
		// postCheckLog.refetch()
		props.navigation.navigate('Maps', {
			params: {
				from: 'scanQR',
				state: props.route.params.params.state,
				qrID: getJobs.data.data.id,
				jobsName: getJobs.data.data?.name,
				companyLat: getJobs.data.data?.company.latitude,
				companyLong: getJobs.data.data?.company.longitude,
			}
		})
	}

  return (
    <View style={styles.container}>
      {/* <Stack.Screen
        options={{ header: () => null }}
      /> */}
			<View style={{ flexDirection: 'row', }}>
      	<Header
					backButton
					style={{ flex: 1, }}
					navigation={props.navigation}
					title={'Scan Kode QR ' + (props.route.params.params.state == 'check_in' ? 'Check In' : props.route.params.params.state == 'check_out' && 'Check Out')} />
			</View>

			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', }}>
      	<Camera
        	style={styles.camera}
					device={device}
          photo={true}
          isActive={isCameraActive}
          ref={cameraRef}
          codeScanner={codeScanner}/>

      	<View style={{ width: width - SIZES.medium * 10, aspectRatio: 1, borderWidth: 3, borderColor: 'white', position: 'absolute', borderRadius: 16 }}/>
			</View>

      <Modals
        svg={svg_qr}
        // title={'Proses ' + (state == 'check_in' ? 'Check In' : state == 'check_out' ? 'Check Out' : null)}
        title={getJobs.data.data?.name}
        desc={(props.route.params.params.state == 'check_in' ? 'Check In\n' : props.route.params.params.state == 'check_out' ? 'Check Out\n' : '') + moment().format('dddd, DD MMM YYYY[\n][Pk. ]HH.mm')}
        buttonTitle={'Lanjutkan'}
        visible={modalVisible}
        onPress={() => onModalSubmit()}
        cancelButton={<Button title={'Kembali'} outline onPress={() => props.navigation.goBack()} style={{ width: 150, marginTop: SIZES.medium }} />}
      />
			<PleaseWaitModal isModal={isShowPleaseWait}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    position: 'absolute',
		width: '100%',
		height: '100%',
  },
  captureButton: {
    width: 60,
    height: 60,
    // backgroundColor: 'white',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
    padding: 2,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
		height: '100%',
  },
});