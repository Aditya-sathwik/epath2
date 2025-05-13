//import liraries
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { hp, wp, commonFontStyle, SCREEN_HEIGHT } from "../../theme/fonts";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { RightArrow } from "../../assets/Icons";
import { AppStyles } from "../../theme/appStyles";
import { useNavigation, useTheme } from "@react-navigation/native";
import { icons } from "../../utils/Icon";
import { USER_LOGOUT } from "../../redux/actionTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { asyncKeys, clearAsync } from "../../utils/asyncStorage";
import { dispatchNavigation } from "../../utils/globalFunctions";
import { getCurrentUserAction, setDarkTheme } from "../../action/commonAction";
import DeviceInfo from "react-native-device-info";
import { deleteFcmToken } from "../../action/authAction";
import Loader from "../Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};
const DriverCustomDrawer = ({ props }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkTheme } = useAppSelector((state) => state.common);

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  const drawerItem = [
    {
      title: "Privacy Policy and Terms",
      screen: "PrivacyPolicy",
      icon: icons.information,
      onPress: () => navigation.navigate("PrivacyPolicy"),
    },
    {
      title: "Log out",
      screen: "ThemeScreen",
      icon: icons.exit,
      onPress: () => logout(),
    },
  ];
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.common);
  const [isDarkMode, setIsDarktMode] = useState(false);

  useEffect(() => {
    setIsDarktMode(isDarkTheme);
  }, [isDarkTheme]);

  // console.log(userData)
  useEffect(() => {
    if (!userData) {
      dispatch(getCurrentUserAction());
    }
  });
  const logout = () => {
    setIsLoading(true);
    let deviceId = DeviceInfo.getDeviceId();
    let obj = {
      data: {
        username: userData?.username,
        device_id: deviceId,
      },
      onSuccess: () => {
        setIsLoading(false);
        clearAsync();
        dispatchNavigation("LoginScreen");
        dispatch({ type: USER_LOGOUT });
      },
      onFailure: () => {
        setIsLoading(false);
      },
    };
    dispatch(deleteFcmToken(obj));
  };

  const onChangeTheme = () => {
    dispatch(setDarkTheme(!isDarkMode));
  };
  return (
    <DrawerContentScrollView
      style={{ backgroundColor: colors.white }}
      {...props}
    >
      <Loader visible={isLoading} />
      <View style={styles.headerDrawer}>
        <Image
          style={styles.avatarIcon}
          source={require("../../assets/Avatar.png")}
        />
        <View>
          <Text style={{ ...commonFontStyle(700, 14, colors.black) }}>
            {userData?.username}
          </Text>
        </View>
      </View>

      <View style={styles.hoLine} />
      {drawerItem.map((item, index) => {
        return (
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={item?.onPress}
            key={index}
          >
            {/* {item.icon()} */}
            <Image
              source={item.icon}
              style={{ width: 16, height: 16, tintColor: colors.black }}
            />
            <View style={AppStyles.flex}>
              <Text
                style={{
                  ...commonFontStyle(400, 14, colors.black),
                  marginLeft: 10,
                }}
              >
                {item.title}
              </Text>
            </View>
            {item.title == "Theme" && <RightArrow />}
          </TouchableOpacity>
        );
      })}
      <View style={styles.rowStyle}>
        <Text style={styles.darkTextStyle}>{"Dark Mode"}</Text>
        <Switch value={isDarkMode} onValueChange={() => onChangeTheme()} />
      </View>
      <View style={[styles.hoLine, { marginTop: hp(1) }]} />

      <View style={{ marginTop: SCREEN_HEIGHT * 0.52 }}>
        <Image source={icons.bpolicelogo} style={styles.logoStyle} />
        <Text style={styles.logoText}>Bangalore Traffic Police</Text>
        {/* <Text style={styles.powText}>Powered by</Text> */}
        {/* <Image source={icons.arcadis_logo_black} style={styles.powImage} /> */}
      </View>
      <SafeAreaView />
    </DrawerContentScrollView>
  );
};

export default DriverCustomDrawer;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    headerLeft: {
      paddingHorizontal: hp(2),
    },
    headerDrawer: {
      flexDirection: "row",
      marginVertical: hp(2),
      alignItems: "center",
      paddingHorizontal: hp(3),
    },
    avatarIcon: {
      height: 40,
      width: 40,
      marginRight: 10,
    },
    hoLine: {
      height: 1,
      backgroundColor: colors.graye9,
      marginHorizontal: hp(2),
      marginBottom: hp(1),
    },
    drawerItem: {
      flexDirection: "row",
      paddingHorizontal: hp(3),
      paddingVertical: hp(1),
    },
    iconStyle: {
      width: 30,
      height: 30,
    },
    powImage: {
      resizeMode: "contain",
      height: 20,
      alignSelf: "center",
    },
    powText: {
      ...commonFontStyle(500, 9, colors.black),
      alignSelf: "center",
      marginTop: hp(2),
    },
    logoText: {
      ...commonFontStyle(500, 16, colors.black),
      alignSelf: "center",
    },
    logoStyle: {
      width: 60,
      height: 60,
      alignSelf: "center",
      marginBottom: 10,
    },
    rowStyle: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: wp(5),
      marginTop: hp(3),
      justifyContent: "space-between",
    },
    darkTextStyle: {
      ...commonFontStyle(500, 14, colors.black),
    },
  });
};
