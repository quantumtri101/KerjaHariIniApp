// import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import messaging from '@react-native-firebase/messaging';

const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    // Notifications.setNotificationChannelAsync('default', {
    //   name: 'default',
    //   importance: Notifications.AndroidImportance.MAX,
    //   vibrationPattern: [0, 250, 250, 250],
    //   lightColor: '#FF231F7C',
    // });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      alert('You need to enable permissions in order to receive notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // token = await Notifications.getExpoPushTokenAsync({
    //   projectId: Constants.expoConfig.extra.eas.projectId,
    // });
    token = await Notifications.getDevicePushTokenAsync({
      // projectId: Constants.expoConfig.extra.eas.projectId,
      projectId: "casual-982ce",
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}

const registerForExpoPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      alert('You need to enable permissions in order to receive notifications');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    // token = await Notifications.getExpoPushTokenAsync({
    //   // projectId: Constants.expoConfig.extra.eas.projectId,
    //   projectId: "casual-982ce",
    // });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}

const fcmGetToken = async() => {
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();

  // Save the token
  // await postToApi('/users/1234/tokens', { token });
  return token
}

export {registerForExpoPushNotificationsAsync, registerForPushNotificationsAsync, fcmGetToken}