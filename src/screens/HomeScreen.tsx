import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AgenciesIcon,
  DriverIcon,
  MovementIcon,
  VehicalIcon,
} from "../assets/Icons";
import { colors } from "../theme/colors";
import { AppStyles } from "../theme/appStyles";
import { SCREEN_WIDTH, hp } from "../theme/fonts";
import { commonFontStyle } from "../theme/fonts";
import { useIsFocused, useNavigation, useTheme } from "@react-navigation/native";
import { FloatingButton } from "../compoment/FloatingButton";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  getAgenciesAction,
  getCurrentUserAction,
  getPilotAction,
  getUserDetails,
  getVehicleAction,
} from "../action/commonAction";
import { requestLocationPermission } from "../utils/loactionHandler";
import { PERMISSIONS, checkMultiple } from "react-native-permissions";
import { getAsyncFCMToken, getAsyncLoginInfo } from "../utils/asyncStorage";
import DeviceInfo from "react-native-device-info";
import { storeFcmToken } from "../action/authAction";
type Props = {};

const HomeScreen = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const isFocused = useIsFocused();

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
      const { userData } = useAppSelector((state) => state.common);
  
  const Items = [
    {
      name: "Movements",
      icon: () => <MovementIcon />,
      onClickScreen: "MovementScreen",
    },
    {
      name: "Agencies",
      icon: () => <AgenciesIcon />,
      onClickScreen: "AgenciesScreen",
    },
    {
      name: "Pilot",
      icon: () => <DriverIcon />,
      onClickScreen: "DriversScreen",
    },
    {
      name: "Vehicles",
      icon: () => <VehicalIcon />,
      onClickScreen: "VehiclesScreen",
    },
  ];
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const onPress = () => {
    setModalOpen((curr: any) => !curr);
  };

  useEffect(() => {
    const obj = {
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getVehicleAction(obj));
    dispatch(getPilotAction(obj));
    dispatch(getAgenciesAction(obj));
  }, []);

  useEffect(() => {
    locationServices();
  }, []);


  const userDeatils=()=>{
    const obj = {
    onSuccess: async (groups: any) => {},
    onFailure: () => {
    },
  };
  dispatch(getUserDetails(obj));
}


  useEffect(() => {
    if (!userData) {
      dispatch(getCurrentUserAction());
    }
  },[isFocused]);

  useEffect(() => {
    getFcmToken();
  }, [userData?.username]);



  const getFcmToken=async()=>{
    const value = await getAsyncFCMToken()   
    let deviceId = DeviceInfo.getDeviceId();

    if(value && userData?.username){
      let obj = {
        data: {
          username: userData?.username,
          fcm_token:  value,
          device_id: deviceId,
        },
        onSuccess: () => { },
        onFailure: () => {
        },
      };
      dispatch(storeFcmToken(obj));
    }
}


  const locationServices = async () => {
    if (Platform.OS === "android") {
      checkMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]).then(
        async (statuses) => {
          if (
            statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === "granted"
          ) {
            await requestLocationPermission(
              (location) => {},
              (error) => {}
            );
          } else {
            Alert.alert(
              "Location Permission Required",
              "ePath collects location data to enable The app needs the access to the user’s location to track and prioritize the registered user’s movement by Bengaluru Traffic Police, only when the app is in use even the app is closed or not in use.",
              [
                {
                  text: "DENY",
                  onPress: () => console.log("Ask me later pressed"),
                },
                {
                  text: "ACCEPT",
                  onPress: async () =>
                    await requestLocationPermission(
                      (location) => {},
                      (error) => {}
                    ),
                  style: "cancel",
                },
              ]
            );
          }
        }
      );
    } else {
      await requestLocationPermission(
        (location) => {},
        (error) => {}
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ flex: 1, paddingHorizontal: hp(2) }}
        numColumns={2}
        data={Items}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.cardView}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(item.onClickScreen);
                }}
                style={styles.innerView}
              >
                {item.icon()}
                <Text style={styles.btnText}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <FloatingButton onAgenice={false} onPress={() => onPress()} />
    </View>
  );
};

export default HomeScreen;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    cardView: {
      backgroundColor: colors.white,
      marginTop: hp(4),
      marginLeft: hp(2),
    },
    innerView: {
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.36,
      shadowRadius: 6.68,

      elevation: 11,
      borderWidth: 0.5,
      borderColor: colors.grayc2,
      borderRadius: 10,
      width: (SCREEN_WIDTH - hp(10)) / 2,
      backgroundColor: colors.white,
      alignItems: "center",
      paddingVertical: 30,
    },
    btnText: {
      ...commonFontStyle(600, 20, colors.black33),
      marginTop: 5,
    },
    image: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
  });
};
