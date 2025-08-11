import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, TouchableOpacity, Image } from 'react-native';
import RNFS from 'react-native-fs';
// import { Camera, FlashMode } from 'expo-camera';
// import { Stack, useRouter } from 'expo-router';
import { Header, HeaderResume, } from '../../components'
import { COLORS, SIZES } from '../../constants';
// import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera, useCameraDevices, useCameraDevice, } from 'react-native-vision-camera';
import image from '../../constants/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Base from "../../utils/base";
// import * as MediaLibrary from 'expo-media-library'

export default function CameraScreen(props) {
	var base = new Base()
  // const router = useRouter()
	const device = useCameraDevice('back')
  // const [hasCameraPermission, setHasCameraPermission] = useState(null);
  // const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  // const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(false);
	const [imageBase64, setImageBase64] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef()

  useEffect(async () => {
    // (async () => {
    //   const { status } = await Camera.requestCameraPermissionsAsync();
    //   setHasCameraPermission(status);
    // })();
    // (async () => {
    //   const cameraPermission = await Camera.requestCameraPermissionsAsync();
    //   const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    //   setHasCameraPermission(cameraPermission.status === "granted");
    //   setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    // })();


		const status = await Camera.getCameraPermissionStatus();
		if(status != 'authorized'){
			const permission = await Camera.requestCameraPermission();
		}

		// if(props.route.params.reviewResume)
		// 	AsyncStorage.setItem('lastResumePage', 'KTPCamera')
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const file = await cameraRef.current.takePhoto({
				flash: flashMode,
			});
			// const response = await RNFS.readFile(`file://${file.path}`, 'base64')
      setCapturedPhoto(file);
			// setImageBase64(await base.toDataURLPromise('file://' + file.path))
    }
  };

  function onGoBack(){
    props.navigation.goBack()
		props.route.params.onGoBack()
	}

  const confirmCapture = async () => {
    // const asset = await MediaLibrary.createAssetAsync(capturedPhoto.uri)
    if(props.route.params.reviewResume != null || props.route.params.editResume != null){
      if(props.route.params.reviewResume)
        await AsyncStorage.setItem("id_image", 'file://' + capturedPhoto.path)
      props.navigation.navigate('Resume', {screen : 'FaceRecognition', params: {editResume: props.route.params.editResume, reviewResume: props.route.params.reviewResume, id_image: 'file://' + capturedPhoto.path, onGoBack: () => onGoBack(), }, })
    }
    else{
      await AsyncStorage.setItem("id_image", 'file://' + capturedPhoto.path)
      props.navigation.navigate('Resume', {screen : 'FaceRecognition', params: {}, })
    }
  }

//   if (hasCameraPermission === null) {
//     return <View />;
//   }
//
//   if (hasCameraPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {/* <Stack.Screen
        options={{ header: () => null }}
      /> */}
			<View style={{ flexDirection: 'row', }}>
      	<Header backButton title={'KTP'} style={{ flex: 1, }} navigation={props.navigation}/>
			</View>

      {
				capturedPhoto ?
        	<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', }}>
          	<View style={styles.camera}>
            	<Image source={{ uri: `file://${capturedPhoto.path}`, }} style={styles.previewImage} />
            	<View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', width: width, justifyContent: 'space-between', padding: SIZES.xxLarge, alignItems: 'center' }}>
              	<View style={[styles.captureButton, { height: 80, width: 80 }]}>
                	<TouchableNativeFeedback onPress={() => setCapturedPhoto(null)}>
                  	<View style={{ backgroundColor: 'white', flex: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
                    	<MaterialCommunityIcons name={'close'} size={32} style={{ color: COLORS.black_12, }}/>
                  	</View>
                	</TouchableNativeFeedback>
              	</View>
              	<View style={[styles.captureButton, { height: 80, width: 80 }]}>
                	<TouchableNativeFeedback onPress={() => confirmCapture()}>
                  	<View style={{ backgroundColor: 'white', flex: 1, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
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
								<TouchableNativeFeedback onPress={() => setFlashMode(!flashMode)}>
									<View style={{ backgroundColor: 'white', flex: 1, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
										<MaterialCommunityIcons name={!flashMode ? 'flashlight-off' : 'flashlight'} size={24} />
									</View>
								</TouchableNativeFeedback>
							</View>
						</View>

            <View style={{ width: width - 48, aspectRatio: 850 / 520, borderWidth: 3, borderColor: 'white',  borderRadius: 16 }}>
            </View>
          </View>
      }
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
    // flex: 1,
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