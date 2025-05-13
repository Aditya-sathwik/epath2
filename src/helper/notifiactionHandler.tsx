import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import { navigationRef } from "../navigation/mainNavigator";
import { GET_MOVEMENT_ID } from "../redux/actionTypes";
import store from "../redux";
import { getMovementDetailsAction } from "../action/movementAction";

export async function onDisplayNotification(message: any) {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });
  notifee.displayNotification({
    title: message?.notification?.title,
    body: message?.notification?.body,
    data: message?.data,
    android: {
      channelId,
      pressAction: {
        id: "default",
        launchActivity: "default",
      },
    },
  });
}

export async function displayCustomNotification(title, body) {
  onDisplayNotification({
    message: { notification: { title: title, body: body } },
  });
}

export const onMessage = () => {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log("A new FCM message arrived! ACTIVE APP", remoteMessage);
    onDisplayNotification(remoteMessage);
  });
  return unsubscribe;
};

// When app is background and click to notifiaction  redirect to screen
export const onBackgroundNotificationPress = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from BACKGROUND state:",
      remoteMessage
    );
    if (remoteMessage) {
      navigateToOrderDetails(remoteMessage);
    }
  });
};

// When app is open and click to notifiaction redirect to screen
export const onNotificationPress = () => {
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("remote Message KILL state", remoteMessage);
        navigateToOrderDetails(remoteMessage);
      }
    });
};

// When app is open click to notification redirect to screen
export const openAppNotifiactionEvent = async () => {
  return notifee.onForegroundEvent(async ({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log("User dismissed notification", detail.notification);
        break;
      case EventType.PRESS:
        console.log("User pressed notification", detail.notification);
        navigateToOrderDetails(detail.notification);
        break;
    }
  });
};

// navigation to scrren by notifiaction press
export const navigateToOrderDetails = (remoteMessage: any) => {
  let id = remoteMessage?.data?.movement_id;
  if (id) {
    const obj = {
      id: id,
      onSuccess: (res: any) => {
        store.dispatch({ type: GET_MOVEMENT_ID, payload: id });
        //@ts-ignore
        navigationRef.navigate("DriverMovement");
      },
      onFailure: () => {},
    };
    store.dispatch(getMovementDetailsAction(obj));
  }
};

export const onBackgroundEvent = () => {
  notifee.onBackgroundEvent(async ({ type, detail }: any) => {
    console.log("detail", detail);
    navigateToOrderDetails(detail.notification);
    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS) {
      // Remove the notification
      await notifee.cancelNotification(detail.notification.id);
    }
  });
};
