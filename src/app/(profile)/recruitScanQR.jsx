import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, TouchableOpacity, Image } from 'react-native';
import { Camera, useCameraDevices, useCameraDevice, useCodeScanner, } from 'react-native-vision-camera';

// import { Camera, FlashMode } from 'expo-camera';
// import { Stack, useRouter } from 'expo-router';
import { Header } from '../../components'
import { SIZES } from '../../constants';
import PleaseWaitModal from '../../components/common/PleaseWaitModal'
// import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import image from '../../constants/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFetch from '../../hook/useFetch'
import Base from '../../utils/base'
// import * as MediaLibrary from 'expo-media-library'
// import { BarCodeScanner } from 'expo-barcode-scanner';

export default function RecruitScanQR(props) {
  var base = new Base()
  // const router = useRouter()
  const { width, height } = Dimensions.get('window');
	const device = useCameraDevice('back')
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  // const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isPleaseModalShow, setIsPleaseWaitShow] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(true)
  // const [scanned, setScanned] = useState(false);
  const getJobs = useFetch('GET', 'jobs', {}, false)

  const cameraRef = useRef()
	const codeScanner = useCodeScanner({
		codeTypes: ['qr', 'ean-13'],
		onCodeScanned: (codes) => {
      if(!isPleaseModalShow){
        setIsPleaseWaitShow(true)
        setIsCameraActive(false)
        getJobs.setFetchUrl('jobs?api_type=offering&api_type2=recruitScanQR&id=' + codes[0].value)
        getJobs.refetch()
      }
		}
	})

  useEffect(() => {
    // (async () => {
    //   const { status } = await Camera.requestCameraPermissionsAsync();
    //   setHasCameraPermission(status);
    // })();
    // (async () => {
    //   const cameraPermission = await Camera.requestCameraPermissionsAsync();
    //   const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    //   const barcodeScannerPermission = await BarCodeScanner.requestPermissionsAsync();
    //   setHasCameraPermission(cameraPermission.status === "granted");
    //   setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    //   setHasPermission(barcodeScannerPermission === 'granted');
    // })();
    // const getBarCodeScannerPermissions = async () => {
    //   const { status } = await BarCodeScanner.requestPermissionsAsync();
    //   setHasPermission(status === 'granted');
    // }
    // getBarCodeScannerPermissions();

    initPermission()
  }, []);

  useEffect(() =>  {
    if(getJobs.data.status != null){
      if(getJobs.data.status == 'success'){
        if(getJobs.data.data != null)
          props.navigation.navigate('JobDetail', {screen: 'JobDetailIndex', params: {from: 'rekomendasi', id: getJobs.data.data.id,}, })
        else{
          alert('Kode QR tidak dapat dibaca!\nMohon dipastikan kode QR yang digunakan adalah kode QR pekerjaan')
          setIsCameraActive(true)
        }
      }
      else{
        alert(getJobs.data.message)
        setIsCameraActive(true)
      }
    }
    else
      setIsCameraActive(true)
    setTimeout(() => {
      setIsPleaseWaitShow(false)
    }, 1000)
  }, [getJobs.data, ])

  async function initPermission(){
    const status = await Camera.getCameraPermissionStatus();
    if(status != 'authorized'){
      const permission = await Camera.requestCameraPermission();
    }
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(options = { base64: true });
      setCapturedPhoto(photo);
      // AsyncStorage.setItem('id_image_base64', photo.base64)
    }
  };


  const handleBarCodeScanned = (codes) => {
    
  };

  const confirmCapture = async () => {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto.uri)
    await AsyncStorage.setItem('id_image', JSON.stringify(asset))
    // await MediaLibrary.saveToLibraryAsync(capturedPhoto.uri)
		props.navigation.navigate('Resume', {screen: 'FaceRecognition', params: {}})
    // router.push('/resume/faceRecognition')
  }

  

  return (
    <View style={styles.container}>
      {/* <Stack.Screen
        options={{ header: () => null }}
      /> */}
      <Header backButton title={'Scan Kode QR'} navigation={props.navigation}/>
      <Camera
        style={styles.camera}
				device={device}
        photo={true}
				isActive={isCameraActive}
        ref={cameraRef}
				codeScanner={codeScanner}/>
        {/* <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', width: width, justifyContent: 'space-between', padding: SIZES.xxLarge, alignItems: 'center' }}>
          <View style={{ height: 60, width: 60, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: 8, opacity: 0 }}>
            <TouchableOpacity onPress={() => { }}>
              <Image source={image.headerLogo} resizeMode='center' />
            </TouchableOpacity>
          </View>
          <View style={[styles.captureButton, { height: 100, width: 100 }]}>
            <TouchableNativeFeedback onPress={() => handleCapture()}>
              <View style={{ backgroundColor: 'white', flex: 1, borderRadius: 100 }} />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.captureButton}>
            <TouchableNativeFeedback onPress={() => setFlashMode(flashMode == FlashMode.torch ? FlashMode.off : FlashMode.torch)}>
              <View style={{ backgroundColor: 'white', flex: 1, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name={flashMode == FlashMode.torch ? 'flashlight-off' : 'flashlight'} size={24} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View> */}
      <View style={{ width: width - SIZES.medium * 10, aspectRatio: 1, borderWidth: 3, borderColor: 'white', position: 'absolute', borderRadius: 16 }}>
      </View>
      <PleaseWaitModal isModal={isPleaseModalShow}/>
      {/* {capturedPhoto ? (
        <>
          <View style={styles.camera}>
            <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />
            <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', width: width, justifyContent: 'space-between', padding: SIZES.xxLarge, alignItems: 'center' }}>
              <View style={[styles.captureButton, { height: 80, width: 80 }]}>
                <TouchableNativeFeedback onPress={() => setCapturedPhoto(null)}>
                  <View style={{ backgroundColor: 'white', flex: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name={'close'} size={32} />
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View style={[styles.captureButton, { height: 80, width: 80 }]}>
                <TouchableNativeFeedback onPress={() => confirmCapture()}>
                  <View style={{ backgroundColor: 'white', flex: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name={'check'} size={32} />
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>
        </>
      )
        :
        (
          <>
            <Camera style={styles.camera} type={cameraType} ratio={'4:2'} flashMode={flashMode} ref={cameraRef}>
              <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', width: width, justifyContent: 'space-between', padding: SIZES.xxLarge, alignItems: 'center' }}>
                <View style={{ height: 60, width: 60, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: 8, opacity: 0 }}>
                  <TouchableOpacity onPress={() => { }}>
                    <Image source={image.headerLogo} resizeMode='center' />
                  </TouchableOpacity>
                </View>
                <View style={[styles.captureButton, { height: 100, width: 100 }]}>
                  <TouchableNativeFeedback onPress={() => handleCapture()}>
                    <View style={{ backgroundColor: 'white', flex: 1, borderRadius: 100 }} />
                  </TouchableNativeFeedback>
                </View>
                <View style={styles.captureButton}>
                  <TouchableNativeFeedback onPress={() => setFlashMode(flashMode == FlashMode.torch ? FlashMode.off : FlashMode.torch)}>
                    <View style={{ backgroundColor: 'white', flex: 1, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialCommunityIcons name={flashMode == FlashMode.torch ? 'flashlight-off' : 'flashlight'} size={24} />
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            </Camera>
            <View style={{ width: width - 48, aspectRatio: 850 / 520, borderWidth: 3, borderColor: 'white', position: 'absolute', borderRadius: 16 }}>
            </View>
          </>
        )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});