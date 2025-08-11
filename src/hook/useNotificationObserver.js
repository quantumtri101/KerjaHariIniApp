// // import { useEffect } from 'react';
// import * as Notifications from 'expo-notifications';
// import { useRouter } from 'expo-router';

// export default function useNotificationObserver () {
//   let isMounted = true;
//   const router = useRouter()

//   const redirect = (notification) => {
//     // const url = notification.request.content.data?.url;
//     // if (url) {
//     //   router.push(url)
//     // }
//     router.replace('/profile')
//   }

//   Notifications.getLastNotificationResponseAsync()
//     .then(response => {
//       if (!isMounted || !response?.notification) {
//         return;
//       }
//       redirect(response?.notification);
//     });

//   const subscription = Notifications.addNotificationResponseReceivedListener(response => {
//     redirect(response.notification);
//   });

//   return () => {
//     console.log('useNotificationObserver')
//     isMounted = false;
//     subscription.remove();
//   };
// }