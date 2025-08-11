import { useKeepAwake } from "expo-keep-awake";
import { useCallback, useEffect, useRef, useState } from "react";
import { Redirect, Stack, Tabs, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { PermissionsAndroid } from "react-native";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

const onMessageReceivedForeground = async (message, type) => {
  console.log("FCM PUSH", JSON.stringify(type));
};

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  useKeepAwake();

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    // DMBold : require('../assets/fonts/DMSans-Bold.ttf'),
    // DMMedium : require('../assets/fonts/DMSans-Medium.ttf'),
    // DMRegular : require('../assets/fonts/DMSans-Regular.ttf'),
    PpRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PpMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PpSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PpBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const removeAsyncNotifRedirect = async () => {
    await AsyncStorage.removeItem("notifRedirect");
  };

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    const unsubscribe = messaging().onMessage((message) =>
      onMessageReceivedForeground(message, "Foreground")
    );

    messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log(
      //   'Notification caused app to open from background state iyaaaaaa:',
      //   JSON.stringify(remoteMessage.data.route),
      // );
      // router.push('/listLamaran')
      // navigation.navigate(remoteMessage.data.type);
      remoteMessage.data.type == "application"
        ? router.push("listLamaran") && removeAsyncNotifRedirect()
        : remoteMessage.data.type == "jobs_offer"
        ? router.push("rekomendasi") && removeAsyncNotifRedirect()
        : remoteMessage.data.type == "jobs_reminder"
        ? router.push("home") && removeAsyncNotifRedirect()
        : remoteMessage.data.type == "salary"
        ? router.push("earning") && removeAsyncNotifRedirect()
        : null;
    });

    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log("User dismissed notification", detail.notification);
          break;
        case EventType.PRESS:
          console.log(
            "User pressed notification",
            JSON.stringify(detail.notification)
          );
          router.replace("/" + detail.notification.data.route);
          break;
      }
    });

    // // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          remoteMessage.data.type == "application"
            ? await AsyncStorage.setItem("notifRedirect", "listLamaran")
            : remoteMessage.data.type == "jobs_offer"
            ? await AsyncStorage.setItem("notifRedirect", "rekomendasi")
            : remoteMessage.data.type == "jobs_reminder"
            ? await AsyncStorage.setItem("notifRedirect", "home")
            : remoteMessage.data.type == "salary"
            ? await AsyncStorage.setItem("notifRedirect", "earning")
            : null;
          // setInitialRouteName(remoteMessage.data.route); // e.g. "Settings"
        }
        // setLoading(false);
      });

    return unsubscribe;
  }, []);

  if (!fontsLoaded) return null;

  return (
    <Stack
      onLayout={onLayoutRootView}
      screenOptions={{
        animation: "none",
      }}
    >
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
