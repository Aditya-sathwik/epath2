/**
 * @format
 */
import "react-native-gesture-handler";
// import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import notifee, { EventType } from "@notifee/react-native";

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { onBackgroundEvent } from "./src/helper/notifiactionHandler";

const config = {
    config: {
        alert: true,
        onServiceErrorCallBack: function () {
        },
    }
};

//   ReactNativeForegroundService.register(config);
// ReactNativeForegroundService.register();

onBackgroundEvent();

AppRegistry.registerComponent(appName, () => App);
