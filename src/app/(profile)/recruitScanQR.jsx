import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, TouchableOpacity, Image } from 'react-native';
import { Camera, useCameraDevices, useCameraDevice, useCodeScanner, } from 'react-native-vision-camera';

import { Header } from '../../components'
import { SIZES } from '../../constants';
import PleaseWaitModal from '../../components/common/PleaseWaitModal'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import image from '../../constants/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFetch from '../../hook/useFetch'
import Base from '../../utils/base'

export default function RecruitScanQR(props) {
  var base = new Base()
  const { width, height } = Dimensions.get('window');
	const device = useCameraDevice('back')
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isPleaseModalShow, setIsPleaseWaitShow] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(true)
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

  return (
    <View style={styles.container}>
      <Header backButton title={'Scan Kode QR'} navigation={props.navigation}/>
      <Camera
        style={styles.camera}
				device={device}
        photo={true}
				isActive={isCameraActive}
        ref={cameraRef}
				codeScanner={codeScanner}/>
      <View style={{ width: width - SIZES.medium * 10, aspectRatio: 1, borderWidth: 3, borderColor: 'white', position: 'absolute', borderRadius: 16 }}>
      </View>
      <PleaseWaitModal isModal={isPleaseModalShow}/>
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