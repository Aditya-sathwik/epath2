import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  NativeModules,
  NativeEventEmitter,
  NativeAppEventEmitter,
  DeviceEventEmitter,
} from "react-native";
import PagerView from "react-native-pager-view";
import React, { useEffect, useRef, useState } from "react";
import {
  useNavigation,
  useIsFocused,
  useTheme,
} from "@react-navigation/native";
import { checkMultiple, PERMISSIONS } from "react-native-permissions";

import {
  getMovementAction,
  getMovementDetailsAction,
  locationDeleteMovementAction,
} from "../../action/movementAction";
import { icons } from "../../utils/Icon";
import Loader from "../../compoment/Loader";
import { SCREEN_WIDTH } from "../../theme/fonts";
import TopTabBar from "../../compoment/TopTabBar";
import { commonFontStyle } from "../../theme/fonts";
import { GET_MOVEMENT_ID } from "../../redux/actionTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import DriverMovementItem from "../../compoment/DriverMovementItem";
import { requestLocationPermission } from "../../utils/loactionHandler";
import { getPilotAction, getVehicleAction } from "../../action/commonAction";
import NoDataFound from "../../compoment/NoDataFound";
import ConfirmModal from "../../compoment/ConfirmModal";
import { getAsyncFCMToken } from "../../utils/asyncStorage";
import DeviceInfo from "react-native-device-info";
import { storeFcmToken } from "../../action/authAction";
import {
  displayCustomNotification,
  onDisplayNotification,
} from "../../helper/notifiactionHandler";

const DriverHomeScreen = ({ route }: any) => {
  const viewPager = useRef<any>(null);
  const { colors } = useTheme();

  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { getMovementList }: any = useAppSelector((state) => state.movement);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectItem, setSelectItem] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const { userData } = useAppSelector((state) => state.common);

  const [pages, setPages] = useState([
    { page: "Ongoing", id: 0, selected: true },
    { page: "Upcoming", id: 1, selected: false },
    { page: "Past", id: 2, selected: false },
  ]);

  useEffect(() => {
    locationServices();
  }, []);

  useEffect(() => {
    getFcmToken();
  }, [userData?.username]);

  const getFcmToken = async () => {
    const value = await getAsyncFCMToken();
    let deviceId = DeviceInfo.getDeviceId();
    console.log("value", value);
    console.log("value", userData?.username);

    if (value && userData?.username) {
      let obj = {
        data: {
          username: userData?.username,
          fcm_token: value,
          device_id: deviceId,
        },
        onSuccess: () => {},
        onFailure: () => {},
      };
      dispatch(storeFcmToken(obj));
    }
  };

  const getData = () => {
    const updateData = pages.filter((item) => item.selected == true);
    const obj = {
      data: {
        type: updateData[0].page.toLocaleLowerCase(),
      },
      params: { page: pageNumber },
      onSuccess: () => {
        setIsLoading(false);
        setPageNumber(pageNumber + 1);
        setFooterLoading(false);
      },
      onFailure: () => {
        setIsLoading(false);
        setFooterLoading(false);
      },
    };
    dispatch(getMovementAction(obj));
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [pages, isFocused]);

  useEffect(() => {
    const obj = {
      onSuccess: () => {
        setIsLoading(false);
      },
      onFailure: () => {
        setIsLoading(false);
      },
    };
    dispatch(getVehicleAction(obj));
    dispatch(getPilotAction(obj));
  }, []);

  useEffect(() => {
    if (route?.params?.isFinished && route?.params?.isFinished == true) {
      onPressTab(2);
      //@ts-ignore
      navigation.setParams({ isFinished: undefined });
    }
    if (route?.params?.isCreated && route?.params?.isCreated == true) {
      onPressTab(1);
      //@ts-ignore
      navigation.setParams({ isCreated: undefined });
    }
  }, [route?.params]);

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

  const onPressTab = (i: any) => {
    setPageNumber(1);
    let temp = Object.assign([], pages);
    temp.forEach((element: any, index: number) => {
      if (i == element.id) {
        //@ts-ignore
        temp[index].selected = true;
        // viewPager.current.setPage(i);
      } else {
        //@ts-ignore
        temp[index].selected = false;
      }
    });
    setPages(temp);
  };

  const onPressCard = (id: any) => {
    const obj = {
      id: id,
      onSuccess: (res: any) => {
        dispatch({ type: GET_MOVEMENT_ID, payload: id });
        //@ts-ignore
        navigation.navigate("DriverMovement");
      },
      onFailure: () => {},
    };
    dispatch(getMovementDetailsAction(obj));
  };

  const loadMore = () => {
    if (!onEndReachedCalled && !footerLoading) {
      setFooterLoading(true);
      setOnEndReachedCalled(true);
      getData();
    }
  };

  const onPressCancelPress = (id: any) => {
    const obj = {
      id: id,
      onSuccess: (res: any) => {
        setConfirmModal(false);
      },
      onFailure: () => {
        setConfirmModal(false);
      },
    };
    dispatch(locationDeleteMovementAction(obj));
  };

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  // const { LocationModule, LocationManagerModule } = NativeModules;
  // const [isLocation, setIsLocation] = useState(false);

  // useEffect(() => {
  //   if (isLocation) {
  //     BackgroundTimer.runBackgroundTimer(async () => {
  //       const location = await LocationManagerModule.getCurrentLocation();
  //       console.log("📍 Location:", location);
  //     }, 2000);
  //   }
  // }, [isLocation]);

  // const onPressLocation = () => {
  //   LocationManagerModule.startLocationSharing();
  //   setIsLocation(true);
  // };

  // const onPressStopLocation = () => {
  //   LocationManagerModule.stopLocationSharing();
  //   BackgroundTimer.stopBackgroundTimer();
  //   setIsLocation(false);
  // };

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onDisplayNotification({
              collapseKey: "in.epathtracking",
              data: {
                movement_id: "1399",
              },
              from: "682218916819",
              messageId: "0:1746168764061404%d1d601b8d1d601b8",
              notification: {
                android: {},
                body: "Movement ID 1399: You have been Assigned a movement on May 02, 2025 12:23 PM from A-27, Vijay Nagar 2, Yoginagar Society, Surat, Gujarat 395010, India to Yogi Chowk, Sanman Society, Yogidhara Society, Yoginagar Society, Surat, Gujarat, India",
                title: "Movement Assigned!",
              },
              originalPriority: 2,
              priority: 2,
              sentTime: 1746168764052,
              ttl: 2419200,
            });
          }}
          style={{ width: 100, height: 20 }}
        >
          <Text>start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPressStopLocation();
          }}
        >
          <Text>stop</Text>
        </TouchableOpacity>
      </View> */}
      <TopTabBar data={pages} onPressTab={onPressTab} />
      {/* <PagerView ref={viewPager} style={styles.pagerView} initialPage={0}>
       
      </PagerView> */}

      {getMovementList?.length > 0 ? (
        <FlatList
          data={getMovementList?.sort(
            (a: any, b: any) => b?.movement_id - a?.movement_id
          )}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <DriverMovementItem
                key={index}
                data={item}
                onPress={() => onPressCard(item?.movement_id)}
                onCancelPress={() => {
                  setConfirmModal(true);
                  setSelectItem(item?.movement_id);
                  // onPressCancelPress(item?.movement_id)
                }}
              />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          onMomentumScrollBegin={() => setOnEndReachedCalled(false)}
          ListFooterComponent={() => {
            if (footerLoading) {
              return <ActivityIndicator color={colors.gray79} size={"large"} />;
            } else {
              return null;
            }
          }}
        />
      ) : (
        <NoDataFound />
      )}
      <View style={styles.footerView}>
        <Text style={styles.footerText}>Add Movement</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          //@ts-ignore
          navigation.navigate("DriverAddMovement");
        }}
        style={[styles.button]}
      >
        <Image style={styles.imageIcon} source={icons.route} />
      </TouchableOpacity>

      <ConfirmModal
        isVisible={confirmModal}
        onPressCancel={() => {
          setConfirmModal(false);
        }}
        onComplete={() => {
          onPressCancelPress(selectItem);
        }}
      />
    </View>
  );
};

export default DriverHomeScreen;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    pagerView: {
      flex: 1,
    },
    imageIcon: {
      width: 30,
      height: 30,
    },
    button: {
      width: 64,
      height: 64,
      borderRadius: 64 / 2,
      alignItems: "center",
      justifyContent: "center",
      shadowRadius: 10,
      shadowColor: colors.black,
      shadowOpacity: 0.2,
      shadowOffset: { height: 10, width: 0 },
      backgroundColor: colors.white,
      zIndex: 1,
      elevation: 10,
      alignSelf: "flex-end",
      right: 30,
      bottom: 30,
      borderWidth: 1,
      borderColor: colors.graye9,
    },
    footerView: {
      alignSelf: "flex-end",
      right: SCREEN_WIDTH * 0.27,
      borderWidth: 1,
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 4,
      top: 15,
      borderColor: colors.grayd9,
    },
    footerText: {
      ...commonFontStyle(500, 12, colors.black),
    },
  });
};
