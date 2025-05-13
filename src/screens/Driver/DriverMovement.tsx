import {
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  NativeEventEmitter,
  NativeModules,
  AppState,
} from "react-native";
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from "@sayem314/react-native-keep-awake";
import axios from "axios";
import moment from "moment";
import ReactNativeModal from "react-native-modal";
import React, { useEffect, useRef, useState } from "react";
import Geolocation from "react-native-geolocation-service";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
// import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import BackgroundService from "react-native-background-actions";
import BackgroundTimer from "react-native-background-timer";

import {
  SCREEN_HEIGHT,
  commonFontStyle,
  fontSize,
  hp,
  wp,
} from "../../theme/fonts";
import MapView, {
  Marker,
  Polyline,
  AnimatedRegion,
  MarkerAnimated,
  PROVIDER_GOOGLE,
  Circle,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import Data from "../../Data";
import { icons } from "../../utils/Icon";
import Loader from "../../compoment/Loader";
import PastBottomView from "../../compoment/PastBottomView";
import DriversSOSModal from "../../compoment/DriversSOSModal";
import { GOOGLE_MAP_API_KEY, api } from "../../utils/apiConstants";
import { updateMovementAction } from "../../action/movementAction";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import DriversMovementModal from "../../compoment/DriversMovementModal";
import { LATITUDE_DELTA, LONGITUDE_DELTA } from "../../utils/commonFunction";
import DriversMovementFinishedModal from "../../compoment/DriversMovementFinishedModal";
import {
  getPilotDetailsAction,
  getAgenciesDetailsAction,
} from "../../action/commonAction";
import {
  infoToast,
  calculateDistance,
  calculateDuration,
  reduceCoordinates,
  hasDeviatedFromRoute,
  parseRouteCoordinates,
  filterPlacesAlongRoute,
  calculateTotalDistance,
  findingCurrentLocationOnRoute,
  getDistanceByMeter,
  calculateSpeeds,
  findNearbyLocations,
  findNearest,
  errorToast,
} from "../../utils/globalFunctions";
import {
  requestLocationPermission,
  getBackgroudLocationPermissions,
} from "../../utils/loactionHandler";
import Tts from "react-native-tts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  asyncKeys,
  getAsyncAttendanceIDs,
  getAsyncLocation,
  removeAsyncAttendanceIDs,
  setAsyncAttendanceIDs,
  setAsyncLocation,
} from "../../utils/asyncStorage";
import { GET_CURRENT_LOCATION } from "../../redux/actionTypes";
import { useNetInfo } from "../../helper/NetInfoProvider";
import {
  displayCustomNotification,
  onDisplayNotification,
} from "../../helper/notifiactionHandler";

type Props = {};

type latLongProps = {
  latitude: number | string;
  longitude: number | string;
};
const { LocationModule, LocationManagerModule } = NativeModules;

const locationEmitter =
  Platform.OS == "android" && new NativeEventEmitter(LocationModule);

const DriverMovement = (props: Props) => {
  const { params }: any = useRoute();
  const { getMovementDetails } = useAppSelector((state) => state.movement);
  const { getPilotDetailsData, getAgenciesDetailsData } = useAppSelector(
    (state) => state.common
  );
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const currentMovement = useRef<any>();
  const mapRef = React.useRef<MapView | null>(null);
  const markerRef = React.useRef<null>(null);

  currentMovement.current = params?.data ? params?.data : getMovementDetails;
  const user = params?.data ? params?.data?.userType : "pilot";
  const [isMapReady, setIsMapReady] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [places, setPlaces] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jnTooltipData, setJnTooltipData] = useState<any>(null);
  const [isSpeedAlertOpen, setIsSpeedAlertOpen] = useState(false);
  const [isSpeedSOSOpen, setIsSpeedSOSOpen] = useState(false);
  const [speedAlertMsg, setSpeedAlertMsg] = useState({});
  const [speedSOSMsg, setSpeedSOSMsg] = useState({});
  const [alertsList, setAlertList] = useState<any>([]);
  const [sosList, setSOSList] = useState<any>([]);
  const [callSOSVisible, setCallSOSVisible] = useState(false);
  const [driversSOSModal, setDriversSOSModal] = useState(false);
  const [showFullAlertsList, setShowFullAlertsList] = useState(false);
  const [showFullSOSsList, setShowFullSOSList] = useState(false);
  const [driversMovementFinishedModal, setDriversMovementFinishedModal] =
    useState(false);
  const [region, setRegion] = useState<any>({
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    latitude: 12.972442,
    longitude: 77.580643,
  });
  const [coordinate, setCoordinate] = useState<any>({});
  const currentMarkerRotation = useRef<any>(0);
  const originRef = useRef(null);

  const newRouteisDoneRef = useRef(false);
  const newRoutesObjectRef = useRef<any>(false);

  const [completedPath, setCompletedPath] = useState<any>([]);
  const actualCompletedRouteRef = useRef<any>([]);

  const [currenctNewVehicleRoute, setCurrenctNewVehicleRoute] = useState([]);
  const currentNewVehicleRouteRef = useRef([]);
  const isCheckSocketIsConneted = useRef(false);
  const isShowReachedRef = useRef(true);

  const [vehicleRoute, setVehicleRoute] = useState([]);

  const socketEndpoint = api.SOCKET_ENDPOINT;

  const socketRef = useRef<any>(null);
  const isConnected = useNetInfo(); // Get network status
  const { getCurrentLocation } = useAppSelector((state) => state.movement);

  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [initialLocation, setInitialLocation] = useState<any>({
    latitude: 12.972442,
    longitude: 77.580643,
  });
  const existingArrayRef = useRef<any>([]);
  const existingObjectRef = useRef<any>({});
  const prevLocation = useRef<any>(null);

  const junctionRef = useRef(true);
  const stoppointRef = useRef(true);
  const endpointRef = useRef(true);
  const deltaValueRef = useRef({
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const isRunningClose = useRef(false);

  let subscription;

  const netInfoCheck = async () => {
    const storedId = await getAsyncAttendanceIDs();
    if (storedId) {
      if (
        isConnected &&
        !socketRef.current &&
        socketRef?.current?.readyState !== WebSocket.OPEN
      ) {
        if (Platform.OS == "android") {
          // errorToast("netInfoCheck ✅");
          openSocketConnection();
          // BackgroundTimer.stopBackgroundTimer();
          // LocationModule.startListening();
          // NativeModules.LocationModule.startLocation();
          // everyTimeGetLocation();
          // startWebSocketCalls()
        } else {
          openSocketConnection();
        }
      }
    }
  };

  useEffect(() => {
    if (user === "pilot" && Platform.OS == "android") {
      netInfoCheck();
    }
  }, [
    isConnected,
    socketRef?.current,
    socketRef?.current?.readyState,
    isCheckSocketIsConneted.current,
    user,
  ]);
  const appState = useRef(AppState.currentState);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription1 = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription1.remove();
    };
  }, []);

  const ListIcon = ({ icon, value, viewStyle, iconStyle, iconShow }: any) => {
    return (
      <View
        style={[
          { flexDirection: "row", alignItems: "center", marginBottom: 10 },
          viewStyle,
        ]}
      >
        {iconShow && (
          <Image style={[styles.listicon, iconStyle]} source={icon} />
        )}
        <Text style={styles.listText}>{value}</Text>
      </View>
    );
  };

  const lineColor =
    currentMovement?.current?.status == "ongoing"
      ? colors.main3f
      : currentMovement?.current?.status == "upcoming"
      ? colors.map_line
      : colors.grayab2;

  useEffect(() => {
    async function getPermission() {
      if (user === "pilot") {
        await requestLocationPermission(
          async (coords: any) => {
            console.log("coords", coords);

            setInitialLocation({
              latitude: coords.latitude || 12.972442,
              longitude: coords.longitude || 77.580643,
            });
            setCoordinate(
              new AnimatedRegion({
                latitude: coords.latitude || 12.972442,
                longitude: coords.longitude || 77.580643,
              })
            );
            getBackgroudLocationPermissions();
          },
          () => {}
        );
      }
    }
    getPermission();
  }, [user]);

  // useEffect(() => {
  //   if (currentLocation) {
  //     setNewData(currentLocation);
  //   }
  // }, [currentLocation]);

  useEffect(() => {
    const watchId = startWatchingPosition();

    return () => {
      // Clear the watch position when the component is unmounted
      Geolocation.clearWatch(watchId);
      Tts.stop();
    };
  }, []);

  const startWatchingPosition = () => {
    const successCallback = (location: any) => {
      if (currentMovement?.current?.status == "ongoing" && user == "pilot") {
        let coords = {
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude,
          timestamp: new Date().toISOString(),
        };
        if (
          !prevLocation.current ||
          prevLocation.current.latitude !== coords.latitude ||
          prevLocation.current.longitude !== coords.longitude
        ) {
          let newCoords = [...existingArrayRef.current, coords];
          prevLocation.current = coords;
          existingArrayRef.current = newCoords;
          let output: any = {};
          newCoords.forEach((obj) => {
            if (!output[obj.timestamp]) {
              output[obj.timestamp] = [];
            }
            output[obj.timestamp].push({
              lat: obj?.latitude,
              lng: obj?.longitude,
            });
          });
          existingObjectRef.current = {
            ...existingObjectRef.current,
            ...output,
          };
        }
        ///////////////////////////////////////////
      }
      // You can update your state or perform any other actions with the new position data here
    };

    const errorCallback = (error: any) => {
      console.log(`Error getting location: ${error.message}`);
      // Handle errors here
    };

    const watchId = Geolocation.watchPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      distanceFilter: 1, // Update every 10 meters
      interval: 2000,
      fastestInterval: 2000,
      showLocationDialog: true,
    });

    return watchId; // Return the watchId so it can be used for clearing the watch later
  };

  useEffect(() => {
    const getCompleted = () => {
      if (
        currenctNewVehicleRoute?.length &&
        currentLocation?.latitude &&
        currentLocation?.longitude
      ) {
        // const routeFeature = turf.lineString(turfRoute);
        const nearestPointOnRoute: any = findingCurrentLocationOnRoute(
          currentLocation,
          currenctNewVehicleRoute
        );
        // Calculate the distance between the user's location and the nearest point on the route

        const index = currenctNewVehicleRoute.findIndex((latLng: any) => {
          return (
            latLng.latitude == nearestPointOnRoute.latitude &&
            latLng.longitude == nearestPointOnRoute.longitude
          );
        });

        if (index !== -1) {
          const tempCompletedPath = currenctNewVehicleRoute.slice(0, index + 1);
          if (user === "pilot") {
            actualCompletedRouteRef.current = tempCompletedPath;
            setCompletedPath(tempCompletedPath);
          }
        }
      }
    };

    getCompleted();
  }, [user, currenctNewVehicleRoute, currentLocation]);

  const fitToCoordinatesToMap = (waypoints: any) => {
    if (mapRef.current && waypoints?.length > 0) {
      mapRef.current.fitToCoordinates(waypoints, {
        edgePadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (user === "authority") {
      const obj = {
        params: params?.data?.agency_id,
        onSuccess: () => {},
        onFailure: () => {},
      };
      dispatch(getAgenciesDetailsAction(obj));
      const obj1 = {
        params: params?.data?.pilot_id,
        onSuccess: () => {},
        onFailure: () => {},
      };
      dispatch(getPilotDetailsAction(obj1));
    }
    if (user === "agency") {
      const obj1 = {
        params: params?.data?.pilot_id,
        onSuccess: () => {},
        onFailure: () => {},
      };
      dispatch(getPilotDetailsAction(obj1));
    }
    if (currentMovement?.current?.junction_eta) {
      setPlaces(JSON.parse(currentMovement?.current?.junction_eta));
    }
    // Clean up the interval and close the WebSocket connection on component unmount
    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN &&
        currentMovement?.current?.status == "ongoing"
      ) {
        // socketRef.current.close();
        // isCheckSocketIsConneted.current = false;
        if (user === "pilot") {
          deactivateKeepAwake();
        }
      }
    };
  }, []);

  useEffect(() => {
    let intId: any = null;
    if (user === "pilot" && currentMovement?.current?.status == "ongoing") {
      activateKeepAwake();
      if (currentMovement?.current?.actual_poly_coordinatess_timestamp) {
        existingObjectRef.current =
          currentMovement?.current?.actual_poly_coordinatess_timestamp;
      }
    }
    if (currentMovement?.current?.junction_eta) {
      setPlaces(JSON.parse(currentMovement?.current?.junction_eta));
    }

    if (currentMovement?.current?.expected_poly_coordinates) {
      newRoutesObjectRef.current = {
        route: JSON.parse(
          currentMovement?.current?.expected_poly_coordinates
        ).map((i: any) => {
          return {
            latitude: i.lat,
            longitude: i.lng,
          };
        }),
        distance: currentMovement?.current.travel_distance,
        duration: currentMovement?.current.estimated_travel_time,
        endTime: currentMovement?.current.planned_end_time,
        places: JSON.parse(currentMovement?.current.junction_eta),
      };
    }

    setRegion({
      ...region,
      latitude: currentMovement?.current?.origin_lat,
      longitude: currentMovement?.current?.origin_lng,
    });

    let loactionOfDriver = {
      latitude:
        currentMovement?.current?.current_lat || initialLocation.latitude,
      longitude:
        currentMovement?.current?.current_lng || initialLocation.longitude,
    };

    let startPoint = {
      latitude: currentMovement.current.origin_lat,
      longitude: currentMovement.current.origin_lng,
    };

    let endPoint = {
      latitude: currentMovement.current.dest_lat,
      longitude: currentMovement.current.dest_lng,
    };
    const midPoint = {
      latitude: (startPoint.latitude + endPoint.latitude) / 2,
      longitude: (startPoint.longitude + endPoint.longitude) / 2,
    };

    if (currentMovement?.current?.status == "ongoing") {
      setRegion({ ...region, ...loactionOfDriver });
    } else {
      let data: any = [];
      if (
        currentMovement?.current?.stop_lat !== null &&
        currentMovement?.current?.stop_lng !== null
      ) {
        let stopPoint = {
          latitude: currentMovement?.current?.stop_lat,
          longitude: currentMovement?.current?.stop_lng,
        };
        data = [startPoint, endPoint, stopPoint, midPoint];
      } else {
        data = [startPoint, endPoint, midPoint];
      }
      setTimeout(() => {
        fitToCoordinatesToMap(data);
      }, 1300);
    }

    if (
      user !== "pilot" &&
      currentMovement?.current?.sos_msg &&
      currentMovement?.current?.sos_msg?.length
    ) {
      let tempLists: any = [];
      currentMovement?.current?.sos_msg?.forEach((alert: any) => {
        let location = alert?.locationName;
        let time = moment(alert?.time)
          .tz("Asia/Kolkata")
          .format("hh:mm A, DD,MM,YYYY");
        let vehicleNumber = alert?.vehicle_number;
        let mID = alert?.movement_id;
        tempLists.push({
          location: location,
          time: time,
          vehicleNumber: vehicleNumber,
          mID: mID,
        });
      });
      setSOSList([...tempLists]);
    }
    if (
      currentMovement?.current?.alert_msg &&
      currentMovement?.current?.alert_msg?.length
    ) {
      let tempList: any = [];
      currentMovement?.current?.alert_msg?.forEach((alert: any) => {
        let location = alert?.locationName;
        let time = moment(alert?.time)
          .tz("Asia/Kolkata")
          .format("hh:mm A, DD,MM,YYYY");
        let vehicleNumber = alert?.vehicle_number;
        let mID = alert?.movement_id;
        tempList.push({
          location: location,
          time: time,
          vehicleNumber: vehicleNumber,
          mID: mID,
        });
      });
      setAlertList([...tempList]);
    }

    if (currentMovement?.current?.status == "ongoing") {
      // openSocketConnection();
      if (currentMovement?.current?.expected_poly_coordinates) {
        let expected_poly_coordinates_list = JSON.parse(
          currentMovement?.current?.expected_poly_coordinates
        ).map((coord: { lat: number; lng: number }) => {
          return { latitude: coord.lat, longitude: coord.lng };
        });
        setCurrenctNewVehicleRoute(expected_poly_coordinates_list);
        setVehicleRoute(expected_poly_coordinates_list);
        currentNewVehicleRouteRef.current = expected_poly_coordinates_list;
      }
      if (currentMovement?.current?.actual_poly_coordinatess) {
        let actual_poly_coordinatess_list = JSON.parse(
          currentMovement?.current?.actual_poly_coordinatess
        ).map((coord: { lat: number; lng: number }) => {
          return { latitude: coord.lat, longitude: coord.lng };
        });
        setCompletedPath(actual_poly_coordinatess_list);
        actualCompletedRouteRef.current = actual_poly_coordinatess_list;
      }
    }
    intId = setInterval(() => {
      getLocation();
    }, 2000);
    return () => {
      clearInterval(intId);
    };
  }, [currentMovement.current]);

  // ✅ Offline stored locations ko bheje jab internet aaye
  const sendOfflineStoredLocations = async () => {
    try {
      let offlineData = await AsyncStorage.getItem(asyncKeys.offlineLocations);
      let offlineDataTime = await AsyncStorage.getItem(
        asyncKeys.offlineLocationsTime
      );
      const storedId = await getAsyncAttendanceIDs();
      const getLocationData = await getAsyncLocation();
      let locations = offlineData ? JSON.parse(offlineData) : [];
      let locationsTime = offlineDataTime ? JSON.parse(offlineDataTime) : [];

      if (
        locations.length > 0 &&
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        let new_routes_list = newRoutesObjectRef?.current?.route?.map(
          (i: any) => {
            return { lat: i?.latitude, lng: i?.longitude };
          }
        );

        const data = {
          type: "POST",
          movement_id: storedId,
          current_lat:
            Number(getLocationData?.latitude) ||
            Number(getCurrentLocation?.latitude),
          current_lng:
            Number(getLocationData?.longitude) ||
            Number(getCurrentLocation?.longitude),
          sos: "no",
          new_routes: JSON.stringify({
            ...newRoutesObjectRef.current,
            route: new_routes_list,
          }),
          movement_status: currentMovement?.current?.movement_status,
          actual_poly_coordinatess: JSON.stringify(locations),
          actual_poly_coordinatess_timestamp: JSON.stringify(locationsTime),
        };
        const jsonData = JSON.stringify(data);
        socketRef.current.send(jsonData);
        console.log("📤 Sent offline location:", JSON.stringify(data));
        await AsyncStorage.removeItem(asyncKeys.offlineLocations); // Data successfully send hone ke baad clear kare
      }
    } catch (error) {
      console.error("❌ Error sending offline locations:", error);
    }
  };

  const openSocketConnection = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    socketRef.current = new WebSocket(socketEndpoint);

    socketRef.current.onopen = () => {
      // onDisplayNotification({
      //   collapseKey: "in.epathtracking",
      //   data: {
      //     movement_id: "1399",
      //   },
      //   from: "682218916819",
      //   messageId: "0:1746168764061404%d1d601b8d1d601b8",
      //   notification: {
      //     android: {},
      //     body: "SOCKET OPENED",
      //     title: "WebSocket SOCKET OPENED!",
      //   },
      //   originalPriority: 2,
      //   priority: 2,
      //   sentTime: 1746168764052,
      //   ttl: 2419200,
      // });
      console.log("SOCKET OPENED");
      sendOfflineStoredLocations();
      isCheckSocketIsConneted.current = true;
    };

    socketRef.current.onclose = async (event: any) => {
      console.log("SOCKET CLOSED");
      isCheckSocketIsConneted.current = false;
      const storedId = await getAsyncAttendanceIDs();
      if (storedId) {
        setTimeout(() => {
          openSocketConnection();
        }, 1000);
      }
    };

    socketRef.current.onmessage = async (event: any) => {
      const receivedData = JSON.parse(event.data);
      console.log("====================================");
      console.log("receivedData", receivedData);
      console.log("====================================");
      const storedId = await getAsyncAttendanceIDs();
      if (storedId) {
        if (!receivedData?.data_received) {
          if (appStateVisible == "active") {
            storedId && onReStartApp();
          } else {
            onDisplayNotification({
              collapseKey: "in.epathtracking",
              data: {
                movement_id: storedId,
              },
              from: "682218916819",
              messageId: "0:1746168764061404%d1d601b8d1d601b8",
              notification: {
                android: {},
                body: "Location Data is not being sent",
                title: "WebSocket error!",
              },
              originalPriority: 2,
              priority: 2,
              sentTime: 1746168764052,
              ttl: 2419200,
            });
          }
        }
        if (receivedData?.close_movement) {
          if (Platform.OS == "ios") {
            socketRef.current.close();
            removeAsyncAttendanceIDs();
            LocationManagerModule.stopLocationSharing();
            BackgroundTimer.stopBackgroundTimer();
            // await BackgroundService.stop();
          }
          if (Platform.OS == "android") {
            socketRef.current.close();
            // setAsyncAttendanceIDs(null);
            removeAsyncAttendanceIDs();
            if (subscription) {
              subscription.remove();
              subscription = null;
            }
            LocationModule.stopListening();
            NativeModules.LocationModule.stopLocation();
            // Stop Background Timer after 10 seconds
            BackgroundTimer.stopBackgroundTimer();
          }
        }
      }

      if (currentMovement?.current?.status !== "ongoing") {
        let expected_poly_coordinates_list = JSON.parse(
          currentMovement?.current?.expected_poly_coordinates
        ).map((point: { lat: number; lng: number }) => ({
          latitude: point.lat,
          longitude: point.lng,
        }));

        const tempCurrentRoute = newRouteisDoneRef.current
          ? currenctNewVehicleRoute
          : expected_poly_coordinates_list;

        const newLocation = {
          latitude: receivedData.data.current_lat,
          longitude: receivedData.data.current_lng,
        };

        const finalNewPosition = findingCurrentLocationOnRoute(
          newLocation,
          tempCurrentRoute
        );
        setCurrentLocation(finalNewPosition || newLocation);

        if (receivedData?.data?.new_routes) {
          let new_routes_list = JSON.parse(
            receivedData?.data?.new_routes
          )?.route.map((point: { lat: number; lng: number }) => ({
            latitude: point.lat,
            longitude: point.lng,
          }));
          newRoutesObjectRef.current = {
            route: new_routes_list,
            distance: receivedData?.data?.new_routes.travel_distance,
            duration: receivedData?.data?.new_routes.estimated_travel_time,
            endTime: receivedData?.data?.new_routes.planned_end_time,
            places: receivedData?.data?.new_routes.junction_eta,
          };
        }
        if (receivedData?.data?.movement_status == "Stop") {
          BackgroundTimer.stopBackgroundTimer();
          socketRef.current.close();
          isCheckSocketIsConneted.current = false;
          if (Platform.OS == "ios") {
            LocationManagerModule.stopLocationSharing();
          } else {
            if (subscription) {
              subscription.remove();
              subscription = null;
            }
            LocationModule.stopListening();
            NativeModules.LocationModule.stopLocation();
          }
          Alert.alert("", "Your movement has been Ended", [
            {
              text: "Ok",
              onPress: () => navigation.goBack(),
            },
          ]);
        }

        if (receivedData?.data?.actual_poly_coordinatess) {
          let actual_poly_coordinatess_list = JSON.parse(
            receivedData?.data?.actual_poly_coordinatess
          ).map((point: { lat: number; lng: number }) => ({
            latitude: point.lat,
            longitude: point.lng,
          }));
          setCompletedPath(actual_poly_coordinatess_list);
          actualCompletedRouteRef.current = actual_poly_coordinatess_list;
        }

        if (user != "pilot" && receivedData.data?.trigger === "yes") {
          if (receivedData.data?.alert_msg && receivedData.data?.trigger) {
            let tempAlert = receivedData.data?.alert_msg;
            if (tempAlert.length) {
              let location = tempAlert[tempAlert.length - 1]?.locationName;
              let time = moment(tempAlert[tempAlert.length - 1]?.time)
                .tz("Asia/Kolkata")
                .format("hh:mm A, DD,MM,YYYY");
              setSpeedAlertMsg({
                location: location,
                time: time,
                vehicleNumber: tempAlert[tempAlert.length - 1]?.vehicle_number,
                mID: tempAlert[tempAlert.length - 1]?.movement_id,
              });
              setIsSpeedAlertOpen(true);
            }
          }
        }
        if (user != "pilot" && receivedData.data?.sos === "yes") {
          if (receivedData.data?.sos_msg && receivedData.data?.sos) {
            let tempSOS = receivedData.data?.sos_msg;
            if (tempSOS.length) {
              let location = tempSOS[tempSOS.length - 1]?.locationName;
              let time = moment(tempSOS[tempSOS.length - 1]?.time)
                .tz("Asia/Kolkata")
                .format("hh:mm A, DD,MM,YYYY");
              setSpeedSOSMsg({
                location: location,
                time: time,
                vehicleNumber: tempSOS[tempSOS.length - 1]?.vehicle_number,
                mID: tempSOS[tempSOS.length - 1]?.movement_id,
              });
              setIsSpeedSOSOpen(true);
            } else {
              setIsSpeedSOSOpen(false);
            }
          } else {
            setIsSpeedSOSOpen(false);
          }
        }
        if (
          receivedData.data?.alert_msg &&
          receivedData.data?.alert_msg.length !== alertsList.length
        ) {
          let tempList: any = [];
          receivedData.data?.alert_msg?.forEach((alert) => {
            let location = alert?.locationName;
            let time = moment(alert?.time)
              .tz("Asia/Kolkata")
              .format("hh:mm A, DD,MM,YYYY");
            let vehicleNumber = alert?.vehicle_number;
            let mID = alert?.movement_id;
            tempList.push({
              location: location,
              time: time,
              vehicleNumber: vehicleNumber,
              mID: mID,
            });
          });
          setAlertList([...tempList]);
        }
        if (
          receivedData.data?.sos_msg &&
          receivedData.data?.sos_msg.length !== sosList.length
        ) {
          let tempLists: any = [];
          receivedData.data?.sos_msg?.forEach((alert: any) => {
            let location = alert?.locationName;
            let time = moment(alert?.time)
              .tz("Asia/Kolkata")
              .format("hh:mm A, DD,MM,YYYY");
            let vehicleNumber = alert?.vehicle_number;
            let mID = alert?.movement_id;
            tempLists.push({
              location: location,
              time: time,
              vehicleNumber: vehicleNumber,
              mID: mID,
            });
          });
          setSOSList([...tempLists]);
        }
      }
    };
    socketRef.current.onerror = (error: any) => {
      console.error("WebSocket error:", error);
      onDisplayNotification({
        collapseKey: "in.epathtracking",
        data: {
        movement_id: currentMovement?.current?.movement_id, // Changed from "1399"
        },
        from: "682218916819",
        messageId: "0:1746168764061404%d1d601b8d1d601b8",
        notification: {
          android: {},
          body: error?.message,
          title: "WebSocket error!",
        },
        originalPriority: 2,
        priority: 2,
        sentTime: 1746168764052,
        ttl: 2419200,
      });
    };
  };

  const getLocation = async () => {
    // animateMarker(location.latitude, location.longitude);
    if (currentMovement?.current?.status == "ongoing" && user === "pilot") {
      Geolocation.getCurrentPosition(
        (location) => {
          const crd = location?.coords;
          animatedMarker(crd.latitude, crd.longitude);
          // currentMarkerRotation.current = crd?.heading;
          let expected_poly_coordinates_list = JSON.parse(
            currentMovement?.current?.expected_poly_coordinates
          ).map((coord: { lat: number; lng: number }) => {
            return { latitude: coord.lat, longitude: coord.lng };
          });
          let tempCurrentRoute = newRouteisDoneRef.current
            ? currentNewVehicleRouteRef.current
            : expected_poly_coordinates_list;

          const newLocation = {
            latitude: crd.latitude,
            longitude: crd.longitude,
          };
          const finalNewPosition = findingCurrentLocationOnRoute(
            newLocation,
            tempCurrentRoute
          );
          setCurrentLocation(finalNewPosition);

          if (currentMovement?.current?.stop_address !== null) {
            let value = getDistanceByMeter(
              finalNewPosition.latitude,
              finalNewPosition.longitude,
              currentMovement.current.stop_lat,
              currentMovement.current.stop_lng
            );
            if (value <= 100) {
              if (isShowReachedRef.current) {
                Alert.alert(
                  "",
                  "You are reached at " + currentMovement.current.stop_address
                );
                isShowReachedRef.current = false;
              }
            }
          }

          if (!hasDeviatedFromRoute(newLocation, tempCurrentRoute)) {
            recalculateNewRoute(newLocation, actualCompletedRouteRef.current);
          }

          let current = {
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
          };
          const nearest: any = findNearest(places, current);
          let value = getDistanceByMeter(
            location?.coords?.latitude,
            location?.coords?.longitude,
            nearest?.latitude,
            nearest?.longitude
          );
          if (junctionRef.current && value <= 50) {
            Tts.speak(nearest?.name + "Junction");
            junctionRef.current = false;
          } else {
            junctionRef.current = true;
          }

          let endPointValue = getDistanceByMeter(
            crd?.latitude,
            crd?.longitude,
            currentMovement?.current?.dest_lat,
            currentMovement?.current?.dest_lng
          );
          if (endpointRef.current && endPointValue <= 50) {
            Tts.speak("You have reached your final destination");
            endpointRef.current = false;
          }

          let stopPointValue = getDistanceByMeter(
            location?.coords?.latitude,
            location?.coords?.longitude,
            currentMovement?.current?.stop_lat,
            currentMovement?.current?.stop_lng
          );

          if (stoppointRef.current && stopPointValue <= 50) {
            Tts.speak("You have reached your first destination");
            stoppointRef.current = false;
          }

          if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
          ) {
            let new_routes_list = newRoutesObjectRef?.current?.route?.map(
              (i: any) => {
                return { lat: i.latitude, lng: i.longitude };
              }
            );

            const data = {
              type: "POST",
              movement_id: currentMovement?.current?.movement_id,
              current_lat: newLocation.latitude,
              current_lng: newLocation.longitude,
              sos: "no",
              new_routes: JSON.stringify({
                ...newRoutesObjectRef.current,
                route: new_routes_list,
              }),
              movement_status: currentMovement?.current?.movement_status,
              actual_poly_coordinatess: JSON.stringify(
                actualCompletedRouteRef.current.map((coord: latLongProps) => {
                  return { lat: coord.latitude, lng: coord.longitude };
                })
              ),
              actual_poly_coordinatess_timestamp: JSON.stringify(
                existingObjectRef.current
              ),
            };

            const jsonData = JSON.stringify(data);
            socketRef.current.send(jsonData);
          }
          // Check if the location has changed before updating and sending to WebSocket
        },
        (error) => {
          infoToast("Error in fetching current location");
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 1,
        }
      );
    } else if (
      currentMovement?.current?.status == "ongoing" &&
      user != "pilot"
    ) {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN &&
        params?.data?.status == "ongoing"
      ) {
        const coordinates = {
          type: "GET",
          movement_id: params?.data.movement_id,
        };
        // Convert coordinates to JSON format and send it
        socketRef.current.send(JSON.stringify(coordinates));
      }
    }
  };

  const getLocationSend = async (crd, id) => {
    // animateMarker(location.latitude, location.longitude);
    if (user === "pilot") {
      animatedMarker(crd.latitude, crd.longitude);
      // currentMarkerRotation.current = crd?.heading;
      let expected_poly_coordinates_list = JSON.parse(
        currentMovement?.current?.expected_poly_coordinates
      ).map((coord: { lat: number; lng: number }) => {
        return { latitude: coord.lat, longitude: coord.lng };
      });
      let tempCurrentRoute = newRouteisDoneRef.current
        ? currentNewVehicleRouteRef.current
        : expected_poly_coordinates_list;

      const newLocation = {
        latitude: crd.latitude,
        longitude: crd.longitude,
      };
      const finalNewPosition = findingCurrentLocationOnRoute(
        newLocation,
        tempCurrentRoute
      );
      setCurrentLocation(finalNewPosition);

      if (currentMovement?.current?.stop_address !== null) {
        let value = getDistanceByMeter(
          finalNewPosition.latitude,
          finalNewPosition.longitude,
          currentMovement.current.stop_lat,
          currentMovement.current.stop_lng
        );
        if (value <= 100) {
          if (isShowReachedRef.current) {
            Alert.alert(
              "",
              "You are reached at " + currentMovement.current.stop_address
            );
            isShowReachedRef.current = false;
          }
        }
      }

      if (!hasDeviatedFromRoute(newLocation, tempCurrentRoute)) {
        recalculateNewRoute(newLocation, actualCompletedRouteRef.current);
      }

      let current = {
        latitude: crd?.latitude,
        longitude: crd?.longitude,
      };
      const nearest: any = findNearest(places, current);
      let value = getDistanceByMeter(
        crd?.latitude,
        crd?.longitude,
        nearest?.latitude,
        nearest?.longitude
      );
      if (junctionRef.current && value <= 50) {
        Tts.speak(nearest?.name + "Junction");
        junctionRef.current = false;
      } else {
        junctionRef.current = true;
      }

      let endPointValue = getDistanceByMeter(
        crd?.latitude,
        crd?.longitude,
        currentMovement?.current?.dest_lat,
        currentMovement?.current?.dest_lng
      );
      if (endpointRef.current && endPointValue <= 50) {
        Tts.speak("You have reached your final destination");
        endpointRef.current = false;
      }

      let stopPointValue = getDistanceByMeter(
        crd?.latitude,
        crd?.longitude,
        currentMovement?.current?.stop_lat,
        currentMovement?.current?.stop_lng
      );

      if (stoppointRef.current && stopPointValue <= 50) {
        Tts.speak("You have reached your first destination");
        stoppointRef.current = false;
      }

      // Check if the location has changed before updating and sending to WebSocket
    } else if (user != "pilot") {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN &&
        params?.data?.status == "ongoing"
      ) {
        const coordinates = {
          type: "GET",
          movement_id: params?.data.movement_id,
        };
        // Convert coordinates to JSON format and send it
        socketRef.current.send(JSON.stringify(coordinates));
      }
    }
  };

  const animatedMarker = (latitude: number, longitude: number) => {
    // const newCoordinate = {
    //   latitude,
    //   longitude,
    // };
    // if (Platform.OS === "android") {
    //   if (markerRef?.current) {
    //     markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 3000);
    //   }
    // } else {
    //   coordinate.timing(newCoordinate).start();
    // }
    let newRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: deltaValueRef.current.latitudeDelta,
      longitudeDelta: deltaValueRef.current.longitudeDelta,
    };
    // const newCamera = {
    //   center: {
    //     latitude: latitude,
    //     longitude: longitude,
    //   },
    //   pitch: 1,
    //   heading: 0,
    //   zoom: 15,
    // };
    // mapRef?.current?.animateCamera(newCamera, { duration: 4000 });
    mapRef?.current?.animateToRegion(newRegion, 1000);
  };

  async function recalculateNewRoute(
    newDriverLocation: latLongProps,
    routes: any
  ) {
    newRouteisDoneRef.current = false;
    let reducedArray = reduceCoordinates(routes, 15);
    reducedArray.push({
      latitude: newDriverLocation?.latitude,
      longitude: newDriverLocation?.longitude,
    });
    let waypoints = [];
    waypoints = reducedArray.map((i) => {
      return `${i.latitude},${i.longitude}`;
    });

    const location = `${newDriverLocation?.latitude}, ${newDriverLocation?.longitude}`;
    const originRef = `${currentMovement?.current?.origin_lat}, ${currentMovement?.current?.origin_lng}`;
    const destinationRef = `${currentMovement?.current?.dest_lat}, ${currentMovement?.current?.dest_lng}`;
    const stopRef = `${currentMovement?.current?.stop_lat}, ${currentMovement?.current?.stop_lng}`;

    let destination =
      currentMovement?.current?.stop_address !== null
        ? isShowReachedRef.current
          ? stopRef
          : destinationRef
        : destinationRef;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://maps.googleapis.com/maps/api/directions/json",
      headers: {},
      params: {
        origin: originRef,
        destination: destination,
        waypoints: waypoints.join("|"),
        travelMode: "DRIVING",
        key: GOOGLE_MAP_API_KEY,
      },
    };

    await axios
      .request(config)
      .then(async (response) => {
        const routeCoordinates = parseRouteCoordinates(response?.data);
        let places = await getNewRouteJunctions(routeCoordinates);
        let distance = calculateDistance(response?.data);
        let duration = calculateDuration(response?.data);
        const startTime = moment(currentMovement?.current?.planned_start_time);
        const tempEndTime = startTime.add(duration, "second").format();
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        newRoutesObjectRef.current = {
          route: routeCoordinates,
          distance: distance,
          duration: moment(
            new Date(0, 0, 0, hours, minutes, seconds),
            "HH:mm:ss"
          ),
          endTime: tempEndTime,
          places: places,
        };
        currentNewVehicleRouteRef.current = routeCoordinates;
        setCurrenctNewVehicleRoute(routeCoordinates);
        newRouteisDoneRef.current = true;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getNewRouteJunctions(result: any) {
    const placesTest = filterPlacesAlongRoute(result, Data);
    const getPlaceAttrsTest = async (place: any) => {
      return {
        latitude: place["latitude"],
        longitude: place["longitude"],
        name: place["junction Name"],
        jn_control: place["jn_control"],
      };
    };

    const select_places = await Promise.all(
      placesTest.map(async (select_place: any) => {
        const tempPlace = await getPlaceAttrsTest(select_place);
        return tempPlace;
      })
    );
    setPlaces(select_places);
    return select_places;
  }

  const everyTimeGetLocation = () => {
    if (!subscription) {
      subscription = locationEmitter.addListener(
        "LocationUpdate",
        async (location) => {
          console.log(
            "✅ Location fetch ",
            location?.latitude,
            location?.longitude
          );
          console.log("====================================");
          console.log("isConnected", isConnected);
          console.log(
            "socketRef.current.readyState",
            socketRef?.current?.readyState
          );
          console.log("====================================");

          const getLocationID = await getAsyncAttendanceIDs();
          // const getLocationID = await getAsyncAttendanceIDs()
          if (getLocationID) {
            if (
              socketRef.current &&
              socketRef.current.readyState !== WebSocket.OPEN
            ) {
              openSocketConnection();
            }
          }
          let coords = {
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            timestamp: new Date().toISOString(),
          };
          fetchAndSendLocation(coords);
          dispatch({
            type: GET_CURRENT_LOCATION,
            payload: {
              latitude: Number(location.latitude),
              longitude: Number(location.longitude),
            },
          });
          setAsyncLocation({
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
          });
          if (
            !prevLocation.current ||
            prevLocation.current.latitude !== coords.latitude ||
            prevLocation.current.longitude !== coords.longitude
          ) {
            let newCoords = [...existingArrayRef.current, coords];
            prevLocation.current = coords;
            existingArrayRef.current = newCoords;
            let output: any = {};
            newCoords.forEach((obj) => {
              if (!output[obj.timestamp]) {
                output[obj.timestamp] = [];
              }
              output[obj.timestamp].push({
                lat: obj?.latitude,
                lng: obj?.longitude,
              });
            });
            existingObjectRef.current = {
              ...existingObjectRef.current,
              ...output,
            };
          }
        }
      );
    }
  };

  // ✅ Offline locations ko store kare
  const storeOfflineLocation = async (obj) => {
    try {
      let offlineData = await AsyncStorage.getItem(asyncKeys.offlineLocations);
      let offlineDataTime = await AsyncStorage.getItem(
        asyncKeys.offlineLocationsTime
      );
      let locations = offlineData ? JSON.parse(offlineData) : [];
      let locationsTime = offlineDataTime ? JSON.parse(offlineDataTime) : {};
      console.log("locationsTimelocationsTimelocationsTime", locationsTime);

      locations.push(obj);
      locationsTime[new Date().toISOString()] = [obj];
      await AsyncStorage.setItem(
        asyncKeys.offlineLocations,
        JSON.stringify(locations)
      );
      await AsyncStorage.setItem(
        asyncKeys.offlineLocationsTime,
        JSON.stringify(locationsTime)
      );
      console.log("📦 Location stored offline:", obj);
    } catch (error) {
      console.error("❌ Error storing offline location:", error);
    }
  };

  const fetchAndSendLocation = async (getLocationData) => {
    try {
      // const getLocationID = currentMovement?.current?.movement_id
      const getLocationID = await getAsyncAttendanceIDs();
      // const getLocationData = await getAsyncLocation();
      if (!getLocationID) {
        console.log("⚠️ No ID found, skipping WebSocket call");
        // BackgroundTimer.stopBackgroundTimer();
        return;
      }
      let obj = {
        latitude:
          Number(getLocationData?.latitude) ||
          Number(getCurrentLocation?.latitude),
        longitude:
          Number(getLocationData?.longitude) ||
          Number(getCurrentLocation?.longitude),
      };

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN &&
        isConnected
      ) {
        console.log("Location fetch obj", obj);
        getLocationSend(obj, getLocationID);

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          let new_routes_list = newRoutesObjectRef?.current?.route?.map(
            (i: any) => {
              return { lat: i.latitude, lng: i.longitude };
            }
          );
          const data = {
            type: "POST",
            movement_id: getLocationID,
            current_lat: obj.latitude,
            current_lng: obj.longitude,
            sos: "no",
            new_routes: JSON.stringify({
              ...newRoutesObjectRef.current,
              route: new_routes_list,
            }),
            movement_status: currentMovement?.current?.movement_status,
            actual_poly_coordinatess: JSON.stringify([
              { lat: obj.latitude, lng: obj.longitude },
            ]),
            actual_poly_coordinatess_timestamp: JSON.stringify({
              [new Date().toISOString()]: [
                { lat: obj.latitude, lng: obj.longitude },
              ],
            }),
          };
          const jsonData = JSON.stringify(data);
          socketRef.current.send(jsonData);
          console.log("📤 Data Sent:", jsonData);
        }
        // console.log("📤 Data Sent:", JSON.stringify(data));
      } else {
        if (
          socketRef.current &&
          socketRef.current.readyState !== WebSocket.OPEN
        ) {
          openSocketConnection();
        }
        console.log("⚠️ No WebSocket connection, storing offline...");
        let obj1 = {
          lat:
            Number(getLocationData?.latitude) ||
            Number(getCurrentLocation?.latitude),
          lng:
            Number(getLocationData?.longitude) ||
            Number(getCurrentLocation?.longitude),
        };

        storeOfflineLocation(obj1);
        if (
          socketRef.current &&
          socketRef.current.readyState !== WebSocket.OPEN
        ) {
          openSocketConnection();
        }
      }
    } catch (error) {
      console.error("❌ Error fetching location:", error);
    }
  };

  const fetchAndSendLocationIOS = async () => {
    try {
      // const getLocationID = currentMovement?.current?.movement_id
      const getLocationID = await getAsyncAttendanceIDs();
      // const getLocationData = await getAsyncLocation();
      const getLocationData = await LocationManagerModule.getCurrentLocation();

      let coords = {
        latitude: Number(getLocationData.latitude),
        longitude: Number(getLocationData.longitude),
        timestamp: new Date().toISOString(),
      };
      if (
        !prevLocation.current ||
        prevLocation.current.latitude !== coords.latitude ||
        prevLocation.current.longitude !== coords.longitude
      ) {
        let newCoords = [...existingArrayRef.current, coords];
        prevLocation.current = coords;
        existingArrayRef.current = newCoords;
        let output: any = {};
        newCoords.forEach((obj) => {
          if (!output[obj.timestamp]) {
            output[obj.timestamp] = [];
          }
          output[obj.timestamp].push({
            lat: obj?.latitude,
            lng: obj?.longitude,
          });
        });
        existingObjectRef.current = {
          ...existingObjectRef.current,
          ...output,
        };
      }
      dispatch({
        type: GET_CURRENT_LOCATION,
        payload: {
          latitude: Number(getLocationData.latitude),
          longitude: Number(getLocationData.longitude),
        },
      });
      setAsyncLocation({
        latitude: Number(getLocationData.latitude),
        longitude: Number(getLocationData.longitude),
      });
      if (!getLocationID || !currentMovement?.current?.movement_id) {
        console.log("⚠️ No ID found, skipping WebSocket call");
        BackgroundTimer.stopBackgroundTimer();
        return;
      }

      let obj = {
        latitude:
          Number(getLocationData?.latitude) ||
          Number(getCurrentLocation?.latitude),
        longitude:
          Number(getLocationData?.longitude) ||
          Number(getCurrentLocation?.longitude),
      };

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN &&
        isConnected
      ) {
        console.log("Location fetch obj", obj);
        getLocationSend(
          obj,
          getLocationID || currentMovement?.current?.movement_id
        );

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          let new_routes_list = newRoutesObjectRef?.current?.route?.map(
            (i: any) => {
              return { lat: i.latitude, lng: i.longitude };
            }
          );
          const data = {
            type: "POST",
            movement_id: getLocationID || currentMovement?.current?.movement_id,
            current_lat: obj.latitude,
            current_lng: obj.longitude,
            sos: "no",
            new_routes: JSON.stringify({
              ...newRoutesObjectRef.current,
              route: new_routes_list,
            }),
            movement_status: currentMovement?.current?.movement_status,
            actual_poly_coordinatess: JSON.stringify([
              { lat: obj.latitude, lng: obj.longitude },
            ]),
            actual_poly_coordinatess_timestamp: JSON.stringify({
              [new Date().toISOString()]: [
                { lat: obj.latitude, lng: obj.longitude },
              ],
            }),
          };
          const jsonData = JSON.stringify(data);
          socketRef.current.send(jsonData);
          errorToast(JSON.stringify(data?.actual_poly_coordinatess));
          console.log("📤 Data Sent:", jsonData);
        }
        // console.log("📤 Data Sent:", JSON.stringify(data));
      } else {
        console.log("⚠️ No WebSocket connection, storing offline...");
        let obj1 = {
          lat:
            Number(getLocationData?.latitude) ||
            Number(getCurrentLocation?.latitude),
          lng:
            Number(getLocationData?.longitude) ||
            Number(getCurrentLocation?.longitude),
        };

        storeOfflineLocation(obj1);
        if (
          socketRef.current &&
          socketRef.current.readyState !== WebSocket.OPEN
        ) {
          openSocketConnection();
        }
      }
    } catch (error) {
      console.error("❌ Error fetching location:", error);
    }
  };

  // ✅ Har 3 second me WebSocket call kare
  const startWebSocketCalls = () => {
    everyTimeGetLocation();
    // BackgroundTimer.runBackgroundTimer(() => {
    //   fetchAndSendLocation();
    // }, 5000); //300000
  };

  // ✅ Har 3 second me WebSocket call kare
  const startWebSocketCallsIOS = () => {
    // everyTimeGetLocation();
    BackgroundTimer.runBackgroundTimer(() => {
      fetchAndSendLocationIOS();
    }, 2000); //300000
  };

  const startManualWebSocket = async () => {
    const storedId = await getAsyncAttendanceIDs();
    console.log("Manual start, ID:", storedId);
    if (storedId || currentMovement?.current?.movement_id) {
      startWebSocketCalls();
      getLocation();
    } else {
      console.log("⚠️ No ID found or WebSocket already running.");
    }
  };

  const startManualWebSocketIOS = async () => {
    const storedId = await getAsyncAttendanceIDs();
    console.log("Manual start, ID:", storedId);
    if (storedId || currentMovement?.current?.movement_id) {
      startWebSocketCallsIOS();
      getLocation();
    } else {
      console.log("⚠️ No ID found or WebSocket already running.");
    }
  };

  const onReStartApp = () => {
    Alert.alert("Location Data is not being sent", "Click OK to restart", [
      {
        text: "OK",
        onPress: () => {
          // BackgroundTimer.stopBackgroundTimer();
          if (Platform.OS == "ios") {
            LocationManagerModule.startLocationSharing();
            setTimeout(() => {
              startManualWebSocketIOS();
            }, 1000);
          }
          if (Platform.OS === "android") {
            LocationModule.startListening();
            NativeModules.LocationModule.startLocation();
            setTimeout(() => {
              startManualWebSocket();
            }, 1000);
          }
        },
      },
    ]);
  };

  const onPressStart = async () => {
    setIsLoading(true);
    const obj = {
      data: {
        current_lat: currentLocation?.latitude || 0,
        current_lng: currentLocation?.longitude || 0,
        status: "ongoing",
        actual_start_time: moment(new Date()).tz("Asia/Kolkata", true).format(),
        actual_end_time: null,
        movement_status: "Start",
      },
      params: currentMovement?.current?.movement_id,
      onSuccess: async () => {
        await setAsyncAttendanceIDs(currentMovement?.current?.movement_id);
        setIsLoading(false);
        await AsyncStorage.removeItem(asyncKeys.offlineLocations);
        await AsyncStorage.removeItem(asyncKeys.offlineLocationsTime);
        if (Platform.OS == "ios") {
          openSocketConnection();
          Tts.stop();
          Tts.speak("Movement started");
          getLocation();
          LocationManagerModule.startLocationSharing();
          setTimeout(() => {
            startManualWebSocketIOS();
          }, 1000);
          // const sleep = (time: any) =>
          //   new Promise((resolve: any) => setTimeout(() => resolve(), time));
          // // You can do anything in your task such as network requests, timers and so on,
          // // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
          // // React Native will go into "paused" mode (unless there are other tasks running,
          // // or there is a foreground app).
          // const veryIntensiveTask = async (taskDataArguments: any) => {
          //   // Example of an infinite loop task
          //   const { delay } = taskDataArguments;
          //   await new Promise(async (resolve) => {
          //     for (let i = 0; BackgroundService.isRunning(); i++) {
          //       console.log(i);
          //       getLocation();
          //       startWatchingPosition();
          //       if (
          //         socketRef.current &&
          //         socketRef.current.readyState === WebSocket.CLOSED
          //       ) {
          //         openSocketConnection();
          //       }
          //       await sleep(delay);
          //     }
          //   });
          // };
          // const options = {
          //   taskName: "E-Path",
          //   taskTitle: "Location Service",
          //   taskDesc: "E-Path is accessing location here",
          //   taskIcon: {
          //     name: "ic_launcher",
          //     type: "mipmap",
          //   },
          //   color: "#000000",
          //   linkingURI: "epath://", // Add this
          //   parameters: {
          //     delay: 2000,
          //   },
          //   // Make sure this is set to avoid the notification being cleared
          //   stopWithTask: false,
          //   // Use immediate behavior for Android 14+
          //   foregroundServiceBehavior: "foreground_service_immediate",
          // };

          // await BackgroundService.start(veryIntensiveTask, options);
        }
        if (Platform.OS === "android") {
          LocationModule?.startListening();
          NativeModules?.LocationModule?.startLocation();
          openSocketConnection();
          setTimeout(() => {
            startManualWebSocket();
          }, 1000);
        }
        // await ReactNativeForegroundService.add_task(
        //   () => {
        //     getLocation();
        //     startWatchingPosition();
        //     if (
        //       socketRef.current &&
        //       socketRef.current.readyState === WebSocket.CLOSED
        //     ) {
        //       openSocketConnection();
        //     }
        //   },
        //   {
        //     delay: 2000,
        //     onLoop: true,
        //     taskId: currentMovement?.current?.movement_id || "",
        //     onError: (e) => {},
        //   }
        // );
        // await ReactNativeForegroundService.start({
        //   id: currentMovement?.current?.movement_id,
        //   title: "Location Service",
        //   message: "E-Path is accessing location here",
        //   icon: "ic_launcher",
        //   color: "#000000",
        // });
      },
      onFailure: () => {
        setIsLoading(false);
      },
    };
    dispatch(updateMovementAction(obj));
  };

  const onPressFinish = async () => {
    const startTime = parseISO(currentMovement.current.actual_start_time);
    const endTime = parseISO(moment().format());

    // Calculate the time difference in milliseconds
    const timeDifferenceInMilliseconds = differenceInMilliseconds(
      endTime,
      startTime
    );
    const hours = Math.floor(timeDifferenceInMilliseconds / 3600000);
    const minutes = Math.floor(
      (timeDifferenceInMilliseconds % 3600000) / 60000
    );
    const seconds = Math.floor((timeDifferenceInMilliseconds % 60000) / 1000);
    const formattedDifference = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    setIsLoading(true);
    const obj = {
      data: {
        current_lat: currentLocation?.latitude,
        current_lng: currentLocation?.longitude,
        status: "past",
        movement_status: "Stop",
        actual_travel_time: formattedDifference,
        travel_distance: calculateTotalDistance(completedPath),
        actual_end_time: moment(new Date()).tz("Asia/Kolkata", true).format(),
      },
      params: currentMovement?.current?.movement_id,
      onSuccess: async () => {
        setIsLoading(false);
        removeAsyncAttendanceIDs();
        socketRef?.current?.close();
        Tts.speak("Movement ended");
        setDatePickerVisibility(false);
        if (Platform.OS == "ios") {
          removeAsyncAttendanceIDs();
          LocationManagerModule.stopLocationSharing();
          BackgroundTimer.stopBackgroundTimer();
          // await BackgroundService.stop();
        }
        if (Platform.OS == "android") {
          // setAsyncAttendanceIDs(null);
          removeAsyncAttendanceIDs();
          if (subscription) {
            subscription.remove();
            subscription = null;
          }
          LocationModule.stopListening();
          NativeModules.LocationModule.stopLocation();
          // Stop Background Timer after 10 seconds
          // BackgroundTimer.stopBackgroundTimer();
        }
        // ReactNativeForegroundService.remove_all_tasks();
        // ReactNativeForegroundService.stopAll();
        setTimeout(() => {
          setDriversMovementFinishedModal(true);
        }, 600);
      },
      onFailure: () => {
        setIsLoading(false);
      },
    };
    dispatch(updateMovementAction(obj));
  };

  function onJunctionClick(junction: any) {
    if (currentMovement?.current?.status === "ongoing") {
      if (junction["distance"]) {
        setJnTooltipData(junction);
      } else {
        let origin = currentLocation
          ? currentLocation
          : {
              latitude: currentMovement?.current?.origin_lat,
              longitude: currentMovement?.current?.origin_lng,
            };
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${junction.latitude},${junction.longitude}&key=${GOOGLE_MAP_API_KEY}`;
        let tempResults: any = null;
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            // Extract route information from the data
            tempResults = data;
            if (tempResults) {
              let updatedJnData = {
                name: junction["name"],
                distance: tempResults.routes[0].legs[0].distance.text,
                duration: tempResults.routes[0].legs[0].duration.text,
                eta: calculatedETA(),
              };
              setJnTooltipData({ ...updatedJnData });
              setPlaces((places: any) => {
                return places.map((place: any) => {
                  if (place["name"] === junction["name"]) {
                    return {
                      ...place,
                      distance: tempResults.routes[0].legs[0].distance.text,
                      duration: tempResults.routes[0].legs[0].duration.text,
                      eta: calculatedETA(),
                    };
                  } else {
                    return place;
                  }
                });
              });
            }
          })
          .catch((error) => console.error("Error fetching directions:", error));
        const calculatedETA = () => {
          const startTime = moment();
          return startTime
            .add(tempResults.routes[0].legs[0].duration.value, "second")
            .format("MMM D, YYYY h:mm A");
        };
      }
    }
  }

  const sosAlertsHandle = () => {
    let new_routes_list = newRoutesObjectRef?.current?.route?.map((i: any) => {
      return { lat: i.latitude, lng: i.longitude };
    });
    const data = {
      type: "POST",
      movement_id: currentMovement.current.movement_id,
      current_lat: currentLocation.latitude.toFixed(4),
      current_lng: currentLocation.longitude.toFixed(4),
      actual_poly_coordinatess: JSON.stringify(
        actualCompletedRouteRef.current.map((coord: latLongProps) => {
          return { lat: coord.latitude, lng: coord.longitude };
        })
      ),
      new_routes: JSON.stringify({
        ...newRoutesObjectRef.current,
        route: new_routes_list,
      }),
      sos: "yes",
      movement_status: "Start",
      actual_poly_coordinatess_timestamp: JSON.stringify(
        existingObjectRef.current
      ),
    };
    const jsonData = JSON.stringify(data);
    socketRef.current.send(jsonData);
  };

  const onRegionChangeComplete = (region: any) => {
    setRegion(region);
    deltaValueRef.current = {
      latitudeDelta: region.longitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowHeader}>
        <Loader visible={isLoading} />
        <View style={styles.container}>
          <View style={[styles.inputView, { marginBottom: 10 }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollCOntainer}
            >
              <Text selectable={true} style={styles.stopTextStyle}>
                {currentMovement?.current?.origin_address}
              </Text>
            </ScrollView>
          </View>
          {currentMovement?.current?.stop_address !== null ? (
            <View style={[styles.inputView, { marginBottom: 10 }]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollCOntainer}
              >
                <Text selectable={true} style={styles.stopTextStyle}>
                  {currentMovement?.current?.stop_address}
                </Text>
              </ScrollView>
            </View>
          ) : null}
          <View style={[styles.inputView, { marginBottom: 10 }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollCOntainer}
            >
              <Text selectable={true} style={styles.stopTextStyle}>
                {currentMovement?.current?.destination_address}
              </Text>
            </ScrollView>
          </View>
          <View style={styles.rowIcons}>
            {/* First column */}
            <View style={{ flex: 1 }}>
              <ListIcon
                iconShow={true}
                icon={icons.sportscar}
                value={currentMovement?.current?.vehicle_number}
                iconStyle={{ tintColor: colors.black }}
              />
              <ListIcon
                icon={icons.sportsPin}
                value={`${(
                  currentMovement?.current?.total_distance / 1000
                )?.toFixed(2)} KM`}
                iconShow={true}
                iconStyle={{ tintColor: colors.black }}
              />
              {user != "pilot" && (
                <ListIcon
                  icon={icons.User}
                  iconShow={true}
                  value={getPilotDetailsData?.name}
                  iconStyle={styles.personStyle}
                />
              )}
              {currentMovement?.current?.status == "ongoing" &&
                user != "pilot" &&
                user == "authority" && (
                  <TouchableOpacity
                    style={{ marginTop: 5 }}
                    onPress={() => {
                      setShowFullSOSList(true);
                    }}
                  >
                    <ListIcon
                      icon={icons.notification_bell}
                      iconShow={true}
                      value={`SOS(${
                        sosList.length > 99 ? "99+" : sosList.length
                      })`}
                      iconStyle={styles.redIconStyle}
                    />
                  </TouchableOpacity>
                )}
              {currentMovement?.current?.status !== "ongoing" &&
              user == "authority" ? (
                <TouchableOpacity
                  style={{ marginTop: 5 }}
                  onPress={() => {
                    setShowFullSOSList(true);
                  }}
                >
                  <ListIcon
                    iconShow={true}
                    icon={icons.notification_bell}
                    value={`SOS(${
                      sosList.length > 99 ? "99+" : sosList.length
                    })`}
                    iconStyle={styles.redIconStyle}
                  />
                </TouchableOpacity>
              ) : null}
              {user === "agency" &&
                (currentMovement?.current?.status === "ongoing" ||
                  currentMovement?.current?.status === "past") && (
                  <View style={{ marginTop: 3 }}>
                    <ListIcon
                      iconShow={true}
                      icon={icons.hospital}
                      iconStyle={styles.listIconStyle}
                      value={currentMovement?.current?.severity || "-"}
                    />
                  </View>
                )}
              {user == "pilot" &&
                currentMovement?.current?.status === "past" && (
                  <View style={{ marginTop: 3 }}>
                    <ListIcon
                      iconShow={true}
                      icon={icons.hospital}
                      iconStyle={styles.listIconStyle}
                      value={currentMovement?.current?.severity || "-"}
                    />
                  </View>
                )}
            </View>
            {/* Second columnGap */}
            <View
              style={{
                right: currentMovement?.current?.status == "past" ? 25 : 0,
              }}
            >
              <ListIcon
                icon={icons.time}
                value={moment(
                  currentMovement?.current?.status == "upcoming"
                    ? currentMovement?.current?.planned_start_time
                    : currentMovement?.current?.actual_start_time
                )
                  .tz("Asia/Kolkata")
                  .format("MMM D hh:mm a")}
                iconShow={true}
                iconStyle={{ height: 14, width: 14, tintColor: colors.red }}
              />
              {currentMovement?.current?.status == "past" && (
                <ListIcon
                  icon={icons.time}
                  iconShow={true}
                  value={moment(currentMovement?.current?.actual_end_time)
                    .tz("Asia/Kolkata")
                    .format("MMM D hh:mm a")}
                  iconStyle={styles.timeIconStyle}
                />
              )}
              {user === "authority" && (
                <ListIcon
                  icon={icons.agency}
                  value={getAgenciesDetailsData?.name}
                  iconShow={true}
                  iconStyle={{ tintColor: colors.black }}
                />
              )}
              {(currentMovement?.current?.status == "past" ||
                currentMovement?.current?.status == "ongoing") && (
                <TouchableOpacity
                  onPress={() => {
                    setShowFullAlertsList(true);
                  }}
                >
                  <ListIcon
                    icon={icons.notification_bell}
                    iconShow={true}
                    value={`Alerts(${
                      alertsList.length > 99 ? "99+" : alertsList.length
                    })`}
                    iconStyle={{
                      ...styles.listIconStyle,
                      tintColor: colors.black,
                    }}
                  />
                </TouchableOpacity>
              )}

              {currentMovement?.current?.status == "ongoing" &&
                user != "pilot" &&
                user !== "authority" && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowFullSOSList(true);
                    }}
                  >
                    <ListIcon
                      icon={icons.notification_bell}
                      iconShow={true}
                      value={`SOS(${
                        sosList.length > 99 ? "99+" : sosList.length
                      })`}
                      iconStyle={styles.redIconStyle}
                    />
                  </TouchableOpacity>
                )}
              {currentMovement?.current?.status !== "ongoing" &&
              user == "agency" ? (
                <TouchableOpacity
                  style={{ marginTop: 5 }}
                  onPress={() => {
                    setShowFullSOSList(true);
                  }}
                >
                  <ListIcon
                    icon={icons.notification_bell}
                    iconShow={true}
                    value={`SOS(${
                      sosList.length > 99 ? "99+" : sosList.length
                    })`}
                    iconStyle={styles.redIconStyle}
                  />
                </TouchableOpacity>
              ) : null}
              {user === "agency" &&
                currentMovement?.current?.status === "upcoming" && (
                  <View style={{ marginTop: 3 }}>
                    <ListIcon
                      iconShow={true}
                      icon={icons.hospital}
                      iconStyle={styles.listIconStyle}
                      value={currentMovement?.current?.severity || "-"}
                    />
                  </View>
                )}
              {user == "pilot" &&
                (currentMovement?.current?.status === "upcoming" ||
                  currentMovement?.current?.status === "ongoing") && (
                  <View style={{ marginTop: 3 }}>
                    <ListIcon
                      iconShow={true}
                      icon={icons.hospital}
                      iconStyle={styles.listIconStyle}
                      value={currentMovement?.current?.severity || "-"}
                    />
                  </View>
                )}
              {user === "authority" && (
                <View style={{ marginTop: 3 }}>
                  <ListIcon
                    iconShow={true}
                    icon={icons.hospital}
                    iconStyle={styles.listIconStyle}
                    value={currentMovement?.current?.severity || "-"}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginLeft: 10, alignItems: "center", top: 12 }}>
          <Image source={icons.icon1} style={{ width: 10, height: 10 }} />
          <Image source={icons.line} style={styles.lineStyle} />
          <Image source={icons.icon2} style={styles.dotgreenStyle} />
          {currentMovement?.current?.stop_address !== null ? (
            <>
              <Image source={icons.line} style={styles.stopLineStyle} />
              <Image source={icons.icon2} style={styles.dotgreenStyle} />
            </>
          ) : null}
        </View>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        zoomControlEnabled
        // followsUserLocation
        // showsUserLocation={true}
        provider={Platform.OS == "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE} // remove if not using Google Maps
        // loadingEnabled={isMapReady}
        onMapReady={() => setIsMapReady(true)}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {getDistanceByMeter(
          currentLocation?.latitude,
          currentLocation?.longitude,
          currentMovement?.current?.stop_lat,
          currentMovement?.current?.stop_lng
        ) <= 100 ? (
          <Circle
            center={{
              latitude: currentMovement.current.stop_lat,
              longitude: currentMovement.current.stop_lng,
            }}
            radius={100}
            strokeWidth={2}
            strokeColor="#097969"
            fillColor={"rgba(9, 121, 105,0.2)"}
          />
        ) : null}

        {getDistanceByMeter(
          currentLocation?.latitude,
          currentLocation?.longitude,
          currentMovement?.current?.dest_lat,
          currentMovement?.current?.dest_lng
        ) <= 100 ? (
          <Circle
            center={{
              latitude: currentMovement.current.dest_lat,
              longitude: currentMovement.current.dest_lng,
            }}
            radius={100}
            strokeWidth={2}
            strokeColor="#097969"
            fillColor={"rgba(9, 121, 105,0.2)"}
          />
        ) : null}

        {currentMovement?.current?.status == "upcoming" &&
          currentMovement?.current?.expected_poly_coordinates && (
            <Polyline
              coordinates={JSON.parse(
                currentMovement.current.expected_poly_coordinates
              ).map((coord: { lat: number; lng: number }) => {
                return { latitude: coord.lat, longitude: coord.lng };
              })}
              strokeWidth={4}
              strokeColor={lineColor}
            />
          )}
        {currentMovement?.current?.status == "past" &&
        currentMovement?.current?.expected_poly_coordinates ? (
          <>
            <Polyline
              strokeWidth={4}
              strokeColor={colors.map_line}
              coordinates={JSON.parse(
                currentMovement?.current?.expected_poly_coordinates
              ).map((coord: { lat: number; lng: number }) => {
                return { latitude: coord.lat, longitude: coord.lng };
              })}
            />
            {currentMovement?.current?.actual_poly_coordinatess ? (
              <Polyline
                zIndex={1}
                strokeWidth={6}
                strokeColor={colors.grayab2}
                coordinates={JSON.parse(
                  currentMovement?.current?.actual_poly_coordinatess
                ).map((coord: { lat: number; lng: number }) => {
                  return { latitude: coord?.lat, longitude: coord?.lng };
                })}
              />
            ) : null}
          </>
        ) : null}

        {user !== "pilot" && newRoutesObjectRef?.current?.route?.length ? (
          <Polyline
            zIndex={5}
            strokeWidth={4}
            coordinates={newRoutesObjectRef?.current?.route}
            lineDashPattern={[10, 2]}
          />
        ) : null}
        {currentMovement?.current?.status == "ongoing" &&
        currenctNewVehicleRoute?.length ? (
          <>
            {completedPath?.length > 0 ? (
              <Polyline
                coordinates={completedPath}
                strokeWidth={6}
                strokeColor={colors.grayab2}
                zIndex={6}
              />
            ) : null}
            {vehicleRoute?.length > 0 ? (
              <Polyline
                strokeWidth={4}
                coordinates={vehicleRoute}
                strokeColor={colors.map_line}
              />
            ) : null}
            {currenctNewVehicleRoute?.length ? (
              <Polyline
                zIndex={5}
                strokeWidth={4}
                lineDashPattern={[10, 2]}
                coordinates={currenctNewVehicleRoute}
                strokeColor={colors.map_line}
              />
            ) : null}
          </>
        ) : null}
        {currentMovement?.current?.status == "ongoing" && currentLocation && (
          <MarkerAnimated
            ref={markerRef}
            rotation={currentMarkerRotation.current || 0}
            coordinate={{
              latitude: currentLocation?.latitude,
              longitude: currentLocation?.longitude,
            }}
          >
            <Image
              resizeMode="stretch"
              source={icons.carIcon}
              style={styles.markerImgStyle}
            />
          </MarkerAnimated>
        )}

        <Marker
          coordinate={{
            latitude: currentMovement?.current?.origin_lat,
            longitude: currentMovement?.current?.origin_lng,
          }}
        >
          <Image
            source={icons.endPin}
            style={styles.markerImgStyle}
            resizeMode="stretch"
          />
        </Marker>
        <Marker
          coordinate={{
            latitude: currentMovement?.current?.dest_lat,
            longitude: currentMovement?.current?.dest_lng,
          }}
        >
          <Image
            source={icons.startPin}
            resizeMode="stretch"
            style={styles.markerImgStyle}
          />
        </Marker>
        {currentMovement?.current?.stop_lat !== null &&
        currentMovement?.current?.stop_lng !== null ? (
          <Marker
            coordinate={{
              latitude: currentMovement?.current?.stop_lat,
              longitude: currentMovement?.current?.stop_lng,
            }}
          >
            <Image
              source={icons.startPin}
              resizeMode="stretch"
              style={styles.markerImgStyle}
            />
          </Marker>
        ) : null}
        {places.map((place: any) => {
          return (
            <Marker
              key={place["name"]}
              id={place["name"]}
              coordinate={{
                latitude: place["latitude"],
                longitude: place["longitude"],
              }}
              onPress={() => {
                setJnTooltipData(null);
                onJunctionClick(place);
              }}
            >
              <Image
                source={
                  place["jn_control"] === "Unsignalised" ||
                  place["jn_control"] === "Potential Conflict point" ||
                  place["jn_control"] === "Existing"
                    ? icons.unsignalised_juntion
                    : icons.junction
                }
                style={styles.markerImgStyle}
                resizeMode="stretch"
              />
            </Marker>
          );
        })}
      </MapView>
      {user === "pilot" && currentMovement?.current?.status == "upcoming" && (
        <TouchableOpacity style={styles.btnStyle} onPress={onPressStart}>
          <Text style={styles.btnText}>{"START"}</Text>
        </TouchableOpacity>
      )}
      {user === "pilot" && currentMovement?.current?.status == "ongoing" && (
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={styles.footerBtnText}>{"FINISH"}</Text>
        </TouchableOpacity>
      )}
      {user === "pilot" && currentMovement?.current?.status == "ongoing" ? (
        <View style={styles.speedContainer}>
          <Text style={styles.speedCountTextStyle}>
            {Number(
              Number(calculateSpeeds(existingObjectRef.current)) * 3.6
            ).toFixed(0)}
          </Text>
        </View>
      ) : null}
      {user === "pilot" && currentMovement?.current?.status == "ongoing" && (
        <TouchableOpacity
          style={styles.callsosIconView}
          onPress={() => {
            setCallSOSVisible(true);
          }}
        >
          <Image source={icons.callsos} style={styles.callsosIcon} />
        </TouchableOpacity>
      )}
      {currentMovement?.current?.status == "past" && (
        <PastBottomView
          actual_end_time={currentMovement?.current?.actual_end_time}
          travel_distance={currentMovement?.current?.travel_distance}
          actual_start_time={currentMovement?.current?.actual_start_time}
        />
      )}
      <DriversMovementModal
        headerText={
          "Are you sure you want to send a notification to the agency/authority?"
        }
        isVisible={callSOSVisible}
        onPressCancel={() => {
          setCallSOSVisible(false);
        }}
        onPressConfirm={async () => {
          setTimeout(() => {
            setDriversSOSModal(true);
          }, 1000);
          setCallSOSVisible(false);
        }}
        tabSelect={1}
      />
      <DriversMovementModal
        headerText="Do you wish to cancel movement?"
        isVisible={isDatePickerVisible}
        onPressCancel={() => {
          setDatePickerVisibility(false);
        }}
        onPressConfirm={onPressFinish}
        tabSelect={2}
      />
      <DriversSOSModal
        isVisible={driversSOSModal}
        onPressCancel={() => {
          setDriversSOSModal(false);
        }}
        onComplete={() => {
          if (currentLocation) {
            sosAlertsHandle();
          }
        }}
      />
      <DriversMovementFinishedModal
        isVisible={driversMovementFinishedModal}
        onPressCancel={() => {
          socketRef.current.close();
          Tts.stop();
          setDriversMovementFinishedModal(false);
          navigation.navigate("DriverHomeScreen", { isFinished: true });
        }}
        params={currentMovement?.current}
        positionSpeed={0}
        distanceTime={0}
      />
      {jnTooltipData && (
        <ReactNativeModal isVisible={jnTooltipData}>
          <View style={styles.modalInnerNewContainer}>
            <View style={styles.backWhiteContainer}>
              <View style={styles.positionNewContainer}></View>
              <>
                <Text> Name: {jnTooltipData["name"]}</Text>
                <Text> Distance: {jnTooltipData["distance"]}</Text>
                <Text> Duration: {jnTooltipData["duration"]}</Text>
                <Text> ETA: {jnTooltipData["eta"]}</Text>
              </>
            </View>
            <TouchableOpacity
              style={styles.closeContainer}
              onPress={() => setJnTooltipData(null)}
            >
              <ListIcon
                name="close"
                iconShow={true}
                icon={icons.close}
                iconStyle={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      )}
      {isSpeedAlertOpen && (
        <ReactNativeModal
          onBackdropPress={() => {
            setIsSpeedAlertOpen(false);
            setSpeedAlertMsg("");
          }}
          onBackButtonPress={() => {
            setIsSpeedAlertOpen(false);
            setSpeedAlertMsg("");
          }}
          isVisible={isSpeedAlertOpen}
        >
          <View style={styles.modalInnerNewContainer}>
            <View style={styles.backWhiteContainer}>
              <View style={styles.positionNewContainer}></View>
              <Text style={{ color: colors.black }}>{speedAlertMsg?.time}</Text>
              <Text
                style={{ color: colors.black }}
              >{`Vehicle ${speedAlertMsg?.vehicleNumber} with Movemnt ID: #${speedAlertMsg?.mID} got struck at ${speedAlertMsg?.location}`}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeContainer}
              onPress={() => {
                setIsSpeedAlertOpen(false);
                setSpeedAlertMsg("");
              }}
            >
              <ListIcon
                name="close"
                icon={icons.close}
                iconShow={true}
                iconStyle={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      )}
      {/* // Speed Alert */}
      {isSpeedSOSOpen && (
        <ReactNativeModal
          onBackdropPress={() => {
            setIsSpeedSOSOpen(false);
            setSpeedSOSMsg("");
          }}
          onBackButtonPress={() => {
            setIsSpeedSOSOpen(false);
            setSpeedSOSMsg("");
          }}
          isVisible={isSpeedSOSOpen}
        >
          <View style={styles.modalInnerNewContainer}>
            <View style={styles.backWhiteContainer}>
              <View style={styles.positionNewContainer}></View>
              <Text style={styles.alertText}>{speedSOSMsg?.time}</Text>
              <Text
                style={styles.alertText}
              >{`Vehicle ${speedSOSMsg?.vehicleNumber} with Movemnt ID: #${speedSOSMsg?.mID} need assistance at Location ${speedSOSMsg?.location}`}</Text>
            </View>
            <TouchableOpacity
              style={{ ...styles.closeContainer }}
              onPress={() => {
                setIsSpeedSOSOpen(false);
                setSpeedSOSMsg("");
              }}
            >
              <ListIcon
                name="close"
                icon={icons.close}
                iconShow={true}
                iconStyle={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      )}
      {showFullAlertsList && (
        <ReactNativeModal
          onBackdropPress={() => setShowFullAlertsList(false)}
          onBackButtonPress={() => setShowFullAlertsList(false)}
          isVisible={showFullAlertsList}
        >
          <View style={styles.modalInnerContainer}>
            <ScrollView>
              <View style={styles.backWhiteContainer}>
                {alertsList.length ? (
                  alertsList.map((alert, index) => {
                    return (
                      <View key={`alert${index}`}>
                        <Text style={styles.alertText}>{`${index + 1}. ${
                          alert?.time
                        }`}</Text>
                        <Text
                          style={styles.alertText}
                        >{`Vehicle ${alert?.vehicleNumber} with Movemnt ID: #${alert?.mID} got struck at ${alert?.location}`}</Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.alertText}>No Alerts</Text>
                )}
              </View>
              <View style={styles.positionContainer}>
                <TouchableOpacity
                  style={{ ...styles.close1Container }}
                  onPress={() => {
                    setShowFullAlertsList(false);
                  }}
                >
                  <ListIcon
                    name="close"
                    icon={icons.close}
                    iconShow={true}
                    iconStyle={styles.closeIcon}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ReactNativeModal>
      )}
      {showFullSOSsList && (
        <ReactNativeModal
          onBackdropPress={() => setShowFullSOSList(false)}
          onBackButtonPress={() => setShowFullSOSList(false)}
          isVisible={showFullSOSsList}
          // style={{ justifyContent: "center", alignItems: "center" }}
        >
          <View style={styles.modalInnerContainer}>
            <ScrollView>
              <View style={styles.backWhiteContainer}>
                {sosList.length ? (
                  sosList.map((alert, index) => {
                    return (
                      <View key={`alert${index}`}>
                        <Text style={{ color: colors.black }}>{`${index + 1}. ${
                          alert?.time
                        }`}</Text>
                        <Text
                          style={{ color: colors.black }}
                        >{`Vehicle ${alert?.vehicleNumber} with Movemnt ID: #${alert?.mID} need assistance at Location ${alert?.location}`}</Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={{ color: colors.black }}>No Alerts</Text>
                )}
              </View>
            </ScrollView>
            {/* <View
              style={{ ...styles.positionContainer, marginTop: hp(1),right: 18, }}
            ></View> */}
            <TouchableOpacity
              style={[
                styles.closeContainer,
                styles.positionContainer,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: hp(1),
                },
              ]}
              onPress={() => {
                setShowFullSOSList(false);
              }}
            >
              <ListIcon
                name="close"
                icon={icons.close}
                iconShow={true}
                iconStyle={[styles.closeIcon, { top: 5, left: 5 }]}
              />
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      )}
    </View>
  );
};

export default DriverMovement;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    rowHeader: {
      flexDirection: "row",
      marginTop: hp(3),
      marginBottom: hp(1),
      paddingHorizontal: hp(2),
    },
    directionIcon: {
      resizeMode: "contain",
      height: 60,
      marginLeft: hp(2),
      marginTop: hp(2),
    },
    callsosIconView: {
      position: "absolute",
      bottom: 15,
      alignSelf: "center",
      right: 55,
    },
    callsosIcon: {
      width: 40,
      height: 40,
    },

    inputView: {
      backgroundColor: colors.graye6,
      height: 40,
      ...commonFontStyle(500, 14, colors.black),
      borderRadius: 5,
      paddingHorizontal: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    rowIcons: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 17,
      overflow: "visible",
    },
    dropDownIcon: {
      height: 49,
      width: 55,
      backgroundColor: colors.graye6,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    map: {
      flex: 1,
      // marginBottom: hp(2),
    },
    btnStyle: {
      backgroundColor: colors.main3f,
      position: "absolute",
      bottom: 15,
      alignSelf: "center",
      paddingHorizontal: hp(3),
      paddingVertical: 10,
      borderRadius: 6,
    },
    footerBtn: {
      backgroundColor: colors.red,
      position: "absolute",
      bottom: 15,
      alignSelf: "center",
      paddingHorizontal: hp(3),
      paddingVertical: 10,
      borderRadius: 6,
      borderColor: colors.white,
    },
    btnText: {
      ...commonFontStyle(600, 16, colors.white),
    },
    listicon: {
      height: 18,
      width: 20,
      resizeMode: "contain",
      marginRight: 10,
    },
    listText: {
      ...commonFontStyle(600, 12, colors.black33),
    },
    footerView: {
      backgroundColor: colors.main3f,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 13,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 10,
      alignItems: "center",
      paddingHorizontal: 16,
    },
    footerBody: {
      alignSelf: "center",
    },
    minText: {
      ...commonFontStyle(600, 14, colors.white),
      textAlign: "center",
    },
    minKmText: {
      ...commonFontStyle(600, 14, colors.white),
    },
    footerBtnText: {
      ...commonFontStyle(600, 14, colors.white),
    },
    iconStyle: {
      width: 24,
      height: 24,
      alignSelf: "center",
      tintColor: colors.white,
    },
    iconText: {
      ...commonFontStyle(600, 16, colors.white),
    },
    closeIcon: {
      height: 10,
      width: 10,
    },
    closeContainer: {
      position: "absolute",
      top: 14,
      right: 15.5,
      justifyContent: "center",
      alignItems: "center",
    },
    close1Container: {
      position: "absolute",
      top: 4,
      right: -3.5,
      justifyContent: "center",
      alignItems: "center",
    },
    positionContainer: {
      position: "absolute",
      top: 0,
      right: 10,
      height: 22,
      width: 22,
      backgroundColor: colors.main3f,
      borderRadius: 50,
    },
    modalInnerContainer: {
      borderRadius: 25,
      backgroundColor: colors.white,
      padding: 10,
      maxHeight: SCREEN_HEIGHT * 0.6,
    },
    positionNewContainer: {
      position: "absolute",
      top: 0,
      right: 10,
      height: 22,
      width: 22,
      backgroundColor: colors.main3f,
      borderRadius: 50,
    },
    modalInnerNewContainer: {
      borderRadius: 25,
      backgroundColor: colors.white,
      padding: 10,
    },
    backWhiteContainer: {
      backgroundColor: colors.white,
      padding: 10,
    },
    markerImgStyle: {
      height: 35,
      width: 35,
      zIndex: 1,
    },
    redIconStyle: {
      height: 16,
      width: 16,
      tintColor: colors.redDark,
    },
    timeIconStyle: {
      height: 14,
      width: 14,
      tintColor: colors.main3f,
    },
    listIconStyle: {
      height: 16,
      width: 16,
    },
    userIconsStyle: {
      height: 14,
      width: 14,
    },
    stopTextStyle: {
      ...commonFontStyle(500, 14, colors.black),
    },
    scrollCOntainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    dotgreenStyle: {
      width: 14,
      height: 14,
      borderRadius: 14 / 2,
      tintColor: colors.green,
    },
    stopLineStyle: {
      width: 4,
      height: 27,
      marginVertical: 5,
      tintColor: colors.black,
    },
    lineStyle: {
      width: 4,
      height: 27,
      marginVertical: 5,
      tintColor: colors.black,
    },
    personStyle: {
      height: 14,
      width: 14,
      tintColor: colors.black,
    },
    speedContainer: {
      height: wp(10),
      width: wp(10),
      position: "absolute",
      bottom: hp(3),
      backgroundColor: colors.white,
      left: wp(10),
      borderRadius: wp(10 / 2),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    speedCountTextStyle: {
      ...commonFontStyle(500, 15, colors.black),
      fontWeight: "bold",
    },
    alertText: {
      color: colors.black,
      fontSize: fontSize(14),
    },
  });
};
