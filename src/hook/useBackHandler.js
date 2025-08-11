import React, { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
// import { useRouter } from 'expo-router';

function useBackHandler(handleBackPress) {
  // const navigation = useNavigation();
  // const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Custom back button handling
        if (handleBackPress) {
          return handleBackPress();
        }

        // Default behavior: go back if possible, otherwise ask to exit
        if (router.canGoBack()) {
          router.back()
          return true;
        } else {
          Alert.alert('Exit App', 'Are you sure you want to exit?', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        }
      }
    );

    return () => backHandler.remove();
  }, [router, handleBackPress]);
}

export default useBackHandler;