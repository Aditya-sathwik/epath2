import {
  Alert,
  Linking,
  LogBox,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./src/redux";
import Toast from "react-native-toast-message";
import { colors } from "./src/theme/colors";
import { hp, commonFontStyle, SCREEN_WIDTH } from "./src/theme/fonts";
import RootContainer from "./src/navigation/mainNavigator";
import * as Sentry from "@sentry/react-native";
import ToastMessage from "./src/compoment/ToastMessage";
import messaging from "@react-native-firebase/messaging";
import { setAsyncFCMToken } from "./src/utils/asyncStorage";
import { infoToast } from "./src/utils/globalFunctions";
import { api } from "./src/utils/apiConstants";
import VersionCheck from "react-native-version-check";
import { NetInfoProvider } from "./src/helper/NetInfoProvider";

// import SplashScreen from 'react-native-splash-screen';

type Props = {};

LogBox.ignoreAllLogs();

const App = (props: Props) => {
  useEffect(() => {
    Sentry.init({
      dsn: "https://af6d368389edec751701374856caea9c@o4506383777267712.ingest.us.sentry.io/4509207744937986",
      enableNative: true, // Ensures native crash reporting
      enableAutoSessionTracking: true,
      debug: true, // Set to false in production
    });
  }, []);

  useEffect(() => {
    checkVersionApp();
    // SplashScreen.hide();
  }, []);

  const toastConfig = {
    success: ({ text1, text2, type, props, ...rest }: any) =>
      type === "success" && (
        <View style={styles.textStyleToastSuccess}>
          <Text style={styles.textStyleToast}>{text1}</Text>
        </View>
      ),
    error: ({ text1, text2, type, props, ...rest }: any) => {
      if (type === "error") {
        return (
          <View style={styles.toastStyle}>
            <Text style={styles.textStyleToast}>{text1}</Text>
          </View>
        );
      }
    },
  };

  // useEffect(() => {
  //   Sentry.init({
  //     dsn: "https://8e3a80b46e7ff7574971398027b8c136@o4506383777267712.ingest.sentry.io/4506383781330944",
  //     // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  //     // We recommend adjusting this value in production.
  //     tracesSampleRate: 1.0,
  //   });
  // }, []);

  const checkVersionApp = async () => {
    if (Platform.OS == "ios") {
      // fetch(api.BASE_URL + api.appDetails, { headers: { Accept: "application/json", "Content-Type": "application/json", }, })
      //   .then(response => response.json())
      //   .then(json => {
      //     if (json?.data?.app_version?.toFixed(0) !== VersionCheck.getCurrentVersion().toFixed(0)) {
      //       Alert.alert('New Update', 'For an improved user experience, please update your app.', [
      //         { text: 'OK', onPress: () => Linking.openURL('https://apps.apple.com/in/app/btp-astram/id6736525283') },
      //       ]);
      //     }
      //   }).catch(error => { console.error(error); });
    } else {
      VersionCheck.needUpdate().then(async (res) => {
        if (res.isNeeded) {
          Alert.alert(
            "New Update",
            "For an improved user experience, please update your app.",
            [{ text: "OK", onPress: () => Linking.openURL(res.storeUrl) }]
          );
        }
      });
    }
  };

  return (
    <Provider store={store}>
      <NetInfoProvider>
        <View style={{ flex: 1 }}>
          <RootContainer />
          <Toast
            // ref={ref => Toast.setRef(ref)}
            config={toastConfig}
            position="bottom"
          />

          {/* <ToastMessage /> */}
        </View>
      </NetInfoProvider>
    </Provider>
  );
};

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  toastStyle: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 20,
    borderRadius: 5,
    borderLeftWidth: 6,
    borderLeftColor: "red",
    borderWidth: 1.5,
    borderColor: "red",
    width: SCREEN_WIDTH - hp(6),
  },
  textStyleToastSuccess: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 20,
    borderRadius: 5,
    borderLeftWidth: 6,
    borderLeftColor: "green",
    borderWidth: 1.5,
    borderColor: "green",
    width: SCREEN_WIDTH - hp(6),
  },
  textStyleToast: {
    // marginLeft: hp(2),
    ...commonFontStyle(700, 14, "#000"),
  },
});

// #1

// /Users/gauravjain/Documents/NAHI-new/node_modules/react-native-background-actions/android/src/main/AndroidManifest.xml

// line number 4 replace this line

/* <service
  android:name=".RNBackgroundActionsTask"
  android:foregroundServiceType="shortService"
/>; */

// https://github.com/Rapsssito/react-native-background-actions/pull/208/commits/e19205b3fbe7a05184150f9551e720a5f640c46d

// #2

// /Users/gauravjain/Documents/NAHI-new/node_modules/react-native-background-actions/android/src/main/java/com/asterinet/react/bgactions/RNBackgroundActionsTask.java

// replace this onStartCommand method

// @Override
//     public int onStartCommand(Intent intent, int flags, int startId) {
//         final Bundle extras = intent.getExtras();
//         if (extras == null) {
//             throw new IllegalArgumentException("Extras cannot be null");
//         }
//         final BackgroundTaskOptions bgOptions = new BackgroundTaskOptions(extras);
//         createNotificationChannel(bgOptions.getTaskTitle(), bgOptions.getTaskDesc()); // Necessary creating channel for API 26+
//         // Create the notification
//         final Notification notification = buildNotification(this, bgOptions);

//         startForeground(SERVICE_NOTIFICATION_ID, notification);

//         HeadlessJsTaskConfig taskConfig = this.getTaskConfig(intent);

//         if (taskConfig != null) {
//             this.stopForeground(false);
//             this.startTask(taskConfig);
//         }

//         return START_NOT_STICKY;
//     }

// https://github.com/Rapsssito/react-native-background-actions/blob/318375c7a57507f6266c151255509210f42bf85a/android/src/main/java/com/asterinet/react/bgactions/RNBackgroundActionsTask.java#L92

//ios me run YGNodeConstRef change YGNodeRef add in RNDateTimePickerShadowView
//ios me add pod file FlipperTransportType "#include <functional>"
