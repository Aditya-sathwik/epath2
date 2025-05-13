//import liraries
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ReactNativeModal from "react-native-modal";
import { hp, wp, commonFontStyle } from "../../theme/fonts";

import { DrawerContentScrollView } from "@react-navigation/drawer";
import {
  LogOutIcon,
  ProfileIcon,
  RightArrow,
  SettingIcon,
  ThemeIcon,
} from "../../assets/Icons";
import { AppStyles } from "../../theme/appStyles";
import { useNavigation, useTheme } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { clearAsync } from "../../utils/asyncStorage";
import { USER_LOGOUT } from "../../redux/actionTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { dispatchNavigation } from "../../utils/globalFunctions";
import { getCurrentUserAction, setDarkTheme } from "../../action/commonAction";
import { icons } from "../../utils/Icon";
import DeviceInfo from "react-native-device-info";
import { deleteFcmToken } from "../../action/authAction";

const AgencyCustomDrawer = ({ props }: any) => {
  const { colors } = useTheme();
  const [isDarkMode, setIsDarktMode] = useState(false);
  const { isDarkTheme } = useAppSelector((state) => state.common);

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const drawerItem: any = [];
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.common);
  // console.log(userData)

  useEffect(() => {
    setIsDarktMode(isDarkTheme);
  }, [isDarkTheme]);

  useEffect(() => {
    if (!userData) {
      dispatch(getCurrentUserAction());
    }
  });
  
  const logout = () => {
    let deviceId = DeviceInfo.getDeviceId();
    let obj = {
      data: {
        username: userData?.username,
        device_id: deviceId,
      },
      onSuccess: () => {
        dispatch({ type: USER_LOGOUT });
        clearAsync();
        dispatchNavigation("LoginScreen");
      },
      onFailure: () => {},
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
      <View style={styles.headerDrawer}>
        <Image
          style={styles.avatarIcon}
          source={require("../../assets/Avatar.png")}
        />
        <View>
          <Text style={{ ...commonFontStyle(500, 14, colors.black1d) }}>
            {userData?.username}
          </Text>
          <Text style={{ ...commonFontStyle(400, 12, colors.gray5d) }}>
            {userData?.email}
          </Text>
        </View>
      </View>
      {/* <View style={styles.hoLine} /> */}
      {drawerItem.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.screen)}
            style={styles.drawerItem}
          >
            {item.icon()}
            <View style={AppStyles.flex}>
              <Text
                style={{
                  ...commonFontStyle(400, 14, colors.black1d),
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
      <TouchableOpacity
        onPress={() => navigation.navigate("PrivacyPolicy")}
        style={styles.drawerItem}
      >
        <Image
          source={icons.information}
          style={{ width: 16, height: 16, tintColor: colors.black }}
        />
        <View style={AppStyles.flex}>
          <Text
            style={{
              ...commonFontStyle(400, 14, colors.black1d),
              marginLeft: 10,
            }}
          >
            {"Privacy Policy and Terms"}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={logout}>
        <LogOutIcon />
        <Text
          style={{
            ...commonFontStyle(400, 14, colors.black1d),
            marginLeft: 10,
          }}
        >
          {"Log out"}
        </Text>
      </TouchableOpacity>

      <View style={styles.rowStyle}>
        <Text style={styles.darkTextStyle}>{"Dark Mode"}</Text>
        <Switch value={isDarkMode} onValueChange={() => onChangeTheme()} />
      </View>
      <View style={[styles.hoLine, { marginTop: hp(1) }]} />
    </DrawerContentScrollView>
  );
};

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

export default AgencyCustomDrawer;
