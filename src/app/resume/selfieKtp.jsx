import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, TouchableOpacity, Image } from 'react-native';
import RNFS from 'react-native-fs';
// import { Camera, FlashMode } from 'expo-camera';
// import { Stack, useRouter } from 'expo-router';
import { Header, HeaderResume, } from '../../components'
import { SIZES, COLORS } from '../../constants';
import useFetch from "../../hook/useFetch";
import ModalPreloader from "../../components/common/PleaseWaitModal";
// import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import image from '../../constants/image';
import Base from "../../utils/base";
import { LocalSvg } from 'react-native-svg/css';
import { png_frame_face, png_frame_ktp, png_frame_selfie, svg_frame_face, svg_frame_ktp } from '../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, useCameraDevices, useCameraDevice, } from 'react-native-vision-camera';
// import * as MediaLibrary from 'expo-media-library'


export default function SelfieKTP(props) {
	var base = new Base()
	const { width, height } = Dimensions.get('window');
  // const router = useRouter()
	const device = useCameraDevice('front')
  // const [hasCameraPermission, setHasCameraPermission] = useState(null);
  // const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  // const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [flashMode, setFlashMode] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
	const [isModal, setIsModal] = useState(false);
	const [imageBase64, setImageBase64] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
	const [resumeData, setResumeData] = useState({});
  const cameraRef = useRef()
	const [postResumeQuery, setPostResumeQuery] = useState({});

	const getResume = useFetch("GET", "resume", {});
	const postResume = useFetch("POST", "resume/edit", {}, false);

  useEffect(() => {
    initPermission()
    setCameraActive(true)
  }, []);

	useEffect(() => {
		setIsModal(false)
		if(getResume.data.status != null){
			if(getResume.data.status == "success"){
				setResumeData(getResume.data.data)
			}
			else
				base.alertSnackbar(getResume.data.message)
		}
	}, [getResume.data]);

	useEffect(() => {
		setIsModal(false)
		if(postResume.data.status != null){
			if(postResume.data.status == "success"){
        props.navigation.goBack()
				props.route.params.onGoBack()
        setCameraActive(false)
			}
			else
				base.alertSnackbar(postResume.data.message)
		}
	}, [postResume.data]);

  async function initPermission(){
    const status = await Camera.getCameraPermissionStatus();
    if(status != 'authorized'){
      const permission = await Camera.requestCameraPermission();
    }
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const file = await cameraRef.current.takePhoto({
				flash: flashMode ? 'on' : 'off',
			});
			setCapturedPhoto(file);
    }
  };

  const confirmCapture = async() => {
		if(props.route.params.reviewResume){
      await AsyncStorage.setItem("selfie_image", 'file://' + capturedPhoto.path)
      props.navigation.goBack()
      props.route.params.onGoBack()
      setCameraActive(false)
			// props.navigation.navigate('Resume', {screen : 'Review', params: {id_image: props.route.params.id_image, selfie_image: 'file://' + capturedPhoto.path,}, })
    }
		else if(props.route.params.editResume){
			setIsModal(true)
			var obj = JSON.parse(JSON.stringify(resumeData))
			obj.id_image = await base.toDataURLPromise(props.route.params.id_image)
			obj.selfie_image = await base.toDataURLPromise('file://' + capturedPhoto.path)
			postResume.setRefetch(obj)
		}
    else{
      await AsyncStorage.setItem("selfie_image", 'file://' + capturedPhoto.path)
			props.navigation.navigate('Resume', {screen : 'Review', params: {}, })
      setCameraActive(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* <Stack.Screen
        options={{header: () => null}}
      /> */}
			<View style={{ flexDirection: 'row', }}>
        <Header backButton title={'KTP Selfie'} style={{ flex: 1, }} navigation={props.navigation}/>
			</View>

        {
          capturedPhoto ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', }}>
              <View style={styles.camera}>
                <Image source={{ uri: `file://${capturedPhoto.path}` }} style={styles.previewImage} />
                <View style={{position: 'absolute', bottom: 0, flexDirection: 'row', width: width, justifyContent: 'space-between', padding: SIZES.xxLarge, alignItems: 'center'}}>
                  <View style={[styles.captureButton, {height: 80, width: 80}]}>
                    <TouchableNativeFeedback onPress={() => setCapturedPhoto(null)}>
                      <View style={{backgroundColor: 'white', flex: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}}>
                        <MaterialCommunityIcons name={'close'} size={32} style={{ color: COLORS.black_12, }}/>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                  <View style={[styles.captureButton, {height: 80, width: 80}]}>
                    <TouchableNativeFeedback onPress={() => confirmCapture()}>
                      <View style={{backgroundColor: 'white', flex: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center'}}>
                        <MaterialCommunityIcons name={'check'} size={32} style={{ color: COLORS.black_12, }}/>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                </View>
              </View>
            </View>
          :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', }}>
              <Camera style={styles.camera}
                device={device}
                photo={true}
                isActive={true}
                ref={cameraRef}/>

              <View style={{position: 'absolute', bottom: 0, flexDirection: 'row', width: width, justifyContent: 'space-between', padding: SIZES.xxLarge, alignItems: 'center'}}>
                <View style={{height: 60, width: 60, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius :8, opacity: 0}}>
                  <TouchableOpacity onPress={() => {}}>
                    <Image source={image.headerLogo} resizeMode='center'/>
                  </TouchableOpacity>
                </View>
                <View style={[styles.captureButton,{height: 100, width: 100}]}>
                  <TouchableNativeFeedback onPress={() => handleCapture()}>
                    <View style={{backgroundColor: 'white', flex: 1, borderRadius: 100}}/>
                  </TouchableNativeFeedback>
                </View>
                <View style={[styles.captureButton, {opacity: 0}]}>
                  <TouchableNativeFeedback onPress={() => setFlashMode(!flashMode)}>
                    <View style={{backgroundColor: 'white', flex: 1, borderRadius: 30, alignItems: 'center', justifyContent: 'center'}}>
                      <MaterialCommunityIcons name={!flashMode ? 'flashlight-off' : 'flashlight'} size={24}/>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>

              <View style={{position: 'absolute', width: width, height: width, alignItems: 'stretch', justifyContent:'center'}}>
                <Image source={png_frame_selfie} resizeMethod='scale' resizeMode='stretch' style={{width: '100%', height: '100%'}}/>
              </View>
            </View>
        }
			<ModalPreloader isModal={isModal}/>
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