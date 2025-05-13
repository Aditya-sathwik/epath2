import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import React, { FC, useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import Loader from "../compoment/Loader";
import StackNavigator from "./StackNavigator";
import { StatusBar, useColorScheme } from "react-native";
import { colors, dark_colors } from "../theme/colors";
import {
  onBackgroundEvent,
  onBackgroundNotificationPress,
  onMessage,
  onNotificationPress,
  openAppNotifiactionEvent,
} from "../helper/notifiactionHandler";

export const navigationRef = createNavigationContainerRef();

let DarkThemeColors = {
  colors: {
    ...colors,
  },
};

let DefaultThemeColor = {
  colors: {
    ...dark_colors,
  },
};

const RootContainer: FC = () => {
  const { isLoading } = useAppSelector((state) => state.common);

  useEffect(() => {
    onMessage();
    onBackgroundNotificationPress();
    openAppNotifiactionEvent();
    onNotificationPress();
    onBackgroundEvent();
  }, []);

  const theme = useColorScheme();

  const { isDarkTheme } = useAppSelector((state) => state.common);

  return (
    <NavigationContainer
      theme={!isDarkTheme ? DarkThemeColors : DefaultThemeColor}
      ref={navigationRef}
    >
      <StatusBar barStyle={!isDarkTheme ? "light-content" :"dark-content" } backgroundColor={colors.white} />
      {/* <Loader visible={isLoading} /> */}
      <StackNavigator />
    </NavigationContainer>
  );
};
export default RootContainer;
