import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation, useTheme } from "@react-navigation/native";

import { colors } from "../../theme/colors";
import { AppStyles } from "../../theme/appStyles";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { commonFontStyle } from "../../theme/fonts";
import { SCREEN_WIDTH, hp } from "../../theme/fonts";
import { FloatingButton } from "../../compoment/FloatingButton";
import { requestLocationPermission } from "../../utils/loactionHandler";
import { DriverIcon, MovementIcon, VehicalIcon } from "../../assets/Icons";
import { getAgenciesAction, getPilotAction, getVehicleAction } from "../../action/commonAction";
import { PERMISSIONS, checkMultiple } from "react-native-permissions";
import { getAsyncFCMToken } from "../../utils/asyncStorage";
import { storeFcmToken } from "../../action/authAction";
import DeviceInfo from "react-native-device-info";

type Props = {};

const AgencyHomeScreen = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
    const { userData } = useAppSelector((state) => state.common);
  
  const Items = [
    {
      name: "Movements",
      icon: () => <MovementIcon />,
      onClickScreen: "AgencyMovementScreen",
    },
    {
      name: "Vehicles",
      icon: () => <VehicalIcon />,
      onClickScreen: "VehiclesScreen",
    },
    {
      name: "Pilot",
      icon: () => <DriverIcon />,
      onClickScreen: "DriversScreen",
    },
  ];
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

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
  }, []);


  useEffect(()=>{
    getFcmToken()
  },[userData?.username])


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
          onSuccess: () => {},
          onFailure: () => {
          },
        };
        dispatch(storeFcmToken(obj));
      }
  }

  useEffect(() => {
    const obj = {
      isShow:true,
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAgenciesAction(obj));
  }, []);

  

  useEffect(() => {
    locationServices();
  }, []);

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
        data={Items}
        numColumns={2}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.cardView}>
              <TouchableOpacity
                onPress={() => {
                  //@ts-ignore
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
      <FloatingButton onAgenice={true} onPress={onPress} />
    </View>
  );
};

export default AgencyHomeScreen;

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
    contentContainerStyle: {
      flex: 1,
      paddingHorizontal: hp(2),
    },
  });
};
