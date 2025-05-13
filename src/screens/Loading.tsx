import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useAppDispatch } from "../redux/hooks";
import { asyncKeys, getAsyncLoginInfo } from "../utils/asyncStorage";
import { dispatchNavigation } from "../utils/globalFunctions";
import { colors } from "../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDetails, setDarkTheme } from "../action/commonAction";

const Loading = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    getUserInfo();
    getTheme();
  }, []);


  const getTheme = async () => {
    let value: any = await AsyncStorage.getItem(asyncKeys.is_dark_theme);
    if (JSON.parse(value) === true) {
      dispatch(setDarkTheme(true));
    } else {
      dispatch(setDarkTheme(false));
    }
  };

  const getUserInfo = async () => {
    let isGuest = await getAsyncLoginInfo();
    console.log("isGuest?.screenName", isGuest);
    
    if (isGuest?.screenName) {
      dispatchNavigation(isGuest?.screenName);
    } else {
      dispatchNavigation("LoginScreen");
    }
  };

  return <View />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
});

export default Loading;
