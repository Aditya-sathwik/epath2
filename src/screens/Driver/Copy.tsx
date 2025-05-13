import {
  Alert,
  AppState,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as geolib from "geolib";
import React, { useEffect, useRef, useState } from "react";
import { AppStyles } from "../../theme/appStyles";
import { colors } from "../../theme/colors";
import { commonFontStyle, hp } from "../../theme/fonts";
import MapView, {
  Callout,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { icons } from "../../utils/Icon";
import DriversMovementModal from "../../compoment/DriversMovementModal";
import { useNavigation, useRoute } from "@react-navigation/native";
import DriversMovementFinishedModal from "../../compoment/DriversMovementFinishedModal";
import moment from "moment";
import { GOOGLE_MAP_API_KEY } from "../../utils/apiConstants";
import { getAsyncLocationLoginInfo } from "../../utils/asyncStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateMovementAction } from "../../action/movementAction";
import {
  convertHourstoMinute,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from "../../utils/commonFunction";
import Geolocation from "@react-native-community/geolocation";
import Data from "../../Data";
import polyline from "@mapbox/polyline";
import {
  getAgenciesDetailsAction,
  getPilotDetailsAction,
} from "../../action/commonAction";
import ReactNativeModal from "react-native-modal";
import { infoToast } from "../../utils/globalFunctions";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import MapViewDirections from "react-native-maps-directions";
import DriversSOSModal from "../../compoment/DriversSOSModal";

type Props = {};

const ListIcon = ({ icon, value, viewStyle, iconStyle, iconShow }: any) => {
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "center", marginBottom: 10 },
        viewStyle,
      ]}
    >
      {iconShow && <Image style={[styles.listicon, iconStyle]} source={icon} />}
      <Text style={styles.listText}>{value}</Text>
    </View>
  );
};

const DriverMovement = (props: Props) => {
  const { params } = useRoute();
  const { getMovementDetails } = useAppSelector((state) => state.movement);
  const { getPilotDetailsData, getAgenciesDetailsData } = useAppSelector(
    (state) => state.common
  );
  const currentMovement = useRef();
  const mapRef = useRef();
  currentMovement.current = params?.data ? params?.data : getMovementDetails;
  const user = params?.data ? params?.data?.userType : "pilot";
  const [end, setEnd] = useState();
  const [agency, setagency] = useState("");
  const [nextJunction, setNextJunction] = useState("");
  const [distanceTime, setDistanceTime] = useState(0);
  // const [positionSpeed, setPositionSpeed] = useState(0);
  const [selectStart, setSelectStart] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [callSOSVisible, setCallSOSVisible] = useState(false);
  const [driversSOSModal, setDriversSOSModal] = useState(false);
  const [places, setPlaces] = useState([]);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<any>(null);
  const [currentRoute, setCurrentRoute] = useState([]);
  const [travelledRoute, setTravelledRoute] = useState<any>([]);
  const [jnTooltipData, setJnTooltipData] = useState<any>(null);
  const navigation = useNavigation();
  const [isRouteDeviated, setIsRouteDeviated] = useState(false);
  const [selectedJunction, setSelectedJunction] = useState("");
  const [isSpeedAlertOpen, setIsSpeedAlertOpen] = useState(false);
  const [speedAlertMsg, setSpeedAlertMsg] = useState({});
  const [alertsList, setAlertList] = useState([]);
  const [showFullAlertsList, setShowFullAlertsList] = useState(false);
  const [driversMovementFinishedModal, setDriversMovementFinishedModal] =
    useState(false);

  const [vehicleRoute, setVehicleRoute] = useState([]); // To store the response from DirectionsService
  const [currenctNewVehicleRoute, setCurrenctNewVehicleRoute] = useState([]);
  const actualCompletedRouteRef = useRef([]);
  const [completedPath, setCompletedPath] = useState([]);

  const socketEndpoint = "wss://test.ibianalytics.in/ws/send-location/";
  const socketRef = useRef(null);
  const lineColor =
    currentMovement?.current?.status == "ongoing"
      ? colors.main3f
      : currentMovement?.current?.status == "upcoming"
      ? colors.black
      : colors.grayab2;

  const dispatch = useAppDispatch();
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  useEffect(() => {
    async function getPermission() {
      const backgroundgranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        {
          title: "Background Location Permission",
          message:
            "We need access to your location " +
            "so you can get live quality updates.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
      }
    }
    getPermission();
  }, []);

  function calculateNextJunction(junctions = places) {
    let tempNearestJunction = geolib.findNearest(currentLocation, junctions);
  }
  function setNewData(newLocation) {
    if (
      isDeviationGreaterThanThreshold(
        newLocation,
        currentRoute.length
          ? currentRoute
          : JSON.parse(currentMovement?.current?.expected_poly_coordinates).map(
              (coord) => {
                return { latitude: coord.lat, longitude: coord.lng };
              }
            ),
        100
      )
    ) {
      //calculate new route Diveation greater than 100
      calculateNewRoute(newLocation, {
        latitude: currentMovement.current.dest_lat,
        longitude: currentMovement.current.dest_lng,
      });
    } else {
      if (user === "pilot") {
        let nearestPointToCurrentLocation = geolib.findNearest(
          newLocation,
          currentRoute.length
            ? currentRoute
            : JSON.parse(
                currentMovement?.current?.expected_poly_coordinates
              ).map((coord) => {
                return { latitude: coord.lat, longitude: coord.lng };
              })
        );

        // let lastIndexOfTravelPoint = travelledRoute?.length - 1;
        // if (travelledRoute?.length > 0 && lastIndexOfTravelPoint > 0) {
        //   if (
        //     nearestPointToCurrentLocation?.latitude ==
        //       travelledRoute[lastIndexOfTravelPoint].latitude &&
        //     nearestPointToCurrentLocation?.longitude ==
        //       travelledRoute[lastIndexOfTravelPoint].longitude
        //   ) {
        //   } else {
        //     setTravelledRoute((prev) => [
        //       ...prev,
        //       {
        //         latitude: nearestPointToCurrentLocation?.latitude,
        //         longitude: nearestPointToCurrentLocation?.longitude,
        //       },
        //     ]);
        //   }
        // }

        setTravelledRoute((prev) => [
          ...prev,
          {
            latitude: nearestPointToCurrentLocation?.latitude,
            longitude: nearestPointToCurrentLocation?.longitude,
          },
        ]);
      }
      calculateNextJunction();
    }
    if (
      user === "pilot" &&
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      const data = {
        type: "POST",
        movement_id: currentMovement?.current?.movement_id,
        current_lat: newLocation.latitude,
        current_lng: newLocation.longitude,
        actual_poly_coordinatess: JSON.stringify(
          travelledRoute?.map((coord) => {
            return { lat: coord.latitude, lng: coord.longitude };
          })
        ),
      };

      const jsonData = JSON.stringify(data);

      socketRef.current.send(jsonData);
    }
  }

  console.log("TRAVEL", travelledRoute?.length);

  const getLocation = async () => {
    if (currentMovement?.current?.status == "ongoing" && user === "pilot") {
      Geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          if (
            isDeviationGreaterThanThreshold(
              newLocation,
              currentRoute.length
                ? currentRoute
                : JSON.parse(
                    currentMovement?.current?.expected_poly_coordinates
                  ).map((coord) => {
                    return { latitude: coord.lat, longitude: coord.lng };
                  }),
              100
            )
          ) {
            // Check if the location has changed before updating and sending to WebSocket
            setCurrentLocation({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            });
          } else {
            let nearest = geolib.findNearest(
              newLocation,
              currentRoute.length
                ? currentRoute
                : JSON.parse(
                    currentMovement?.current?.expected_poly_coordinates
                  ).map((coord) => {
                    return { latitude: coord.lat, longitude: coord.lng };
                  })
            );
            setCurrentLocation({
              latitude: nearest.latitude,
              longitude: nearest.longitude,
            });
          }
          // onCurrentLocation(newLocation);
          // setPositionSpeed(position.coords.speed);
          // check for deviation and create new route if necessary
          // if deviation is there send junction eta also

          // calculate speed
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
  function calculateNewRoute(origin, destination) {
    console.log("calculateNewRoute");
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAP_API_KEY}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Extract route information from the data
        const routeCoordinates = parseRouteCoordinates(data);
        setCurrentRoute(routeCoordinates);
        setCurrenctNewVehicleRoute(routeCoordinates);
        getNewRouteJunctions(routeCoordinates);
        setIsRouteDeviated(true);
        if (user === "pilot") {
          let nearestPointToCurrentLocation = geolib.findNearest(
            {
              latitude: origin.latitude,
              longitude: origin.longitude,
            },
            routeCoordinates
          );
          setTravelledRoute((prev) => [
            ...prev,
            {
              latitude: nearestPointToCurrentLocation.latitude,
              longitude: nearestPointToCurrentLocation.longitude,
            },
          ]);
        }
      })
      .catch((error) => console.error("Error fetching directions:", error));
  }
  function haversine1(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  function isLocationOnRoute(
    location,
    routeCoordinates,
    thresholdDistance = 20
  ) {
    if (
      location &&
      location.latitude &&
      location.longitude &&
      Array.isArray(routeCoordinates)
    ) {
      for (const point of routeCoordinates) {
        const distance = haversine1(
          location.latitude,
          location.longitude,
          point.latitude,
          point.longitude
        );

        if (distance < thresholdDistance) {
          // Location is close enough to the route
          return true;
        }
      }
    }
    return false;
  }
  function filterPlacesAlongRoute(routePath, data, tolerance = 0.1) {
    return data.filter((place) => {
      // Convert place coordinates to Turf.js coordinate order
      const placeLocation = {
        latitude: place["latitude"],
        longitude: place["longitude"],
      };
      // Check if the place is on or near the route path
      return isLocationOnRoute(placeLocation, routePath, tolerance);
    });
  }
  async function getNewRouteJunctions(result) {
    const placesTest = filterPlacesAlongRoute(result, Data);
    const getPlaceAttrsTest = async (place) => {
      return {
        latitude: place["latitude"],
        longitude: place["longitude"],
        name: place["junction Name"],
        jn_control: place["jn_control"],
        // distance: results.routes[0].legs[0].distance.text,
        // duration: results.routes[0].legs[0].duration.text,
        // eta: calculatedETA(),
      };
    };

    const select_places = await Promise.all(
      placesTest.map(async (select_place) => {
        const tempPlace = await getPlaceAttrsTest(select_place);
        return tempPlace;
      })
    );
    calculateNextJunction();
    setPlaces(select_places);
  }
  function parseRouteCoordinates(data) {
    const route = data.routes[0];
    // const legs = route && route.legs;
    // const steps = legs && legs[0] && legs[0].steps;
    //
    // if (steps) {
    //   const coordinates = steps.map(step => ({
    //     latitude: step.end_location.lat,
    //     longitude: step.end_location.lng,
    //   }));
    const { overview_polyline } = route;
    let coordinates = polyline
      .decode(overview_polyline.points)
      .map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
    return coordinates;
  }
  function isDeviationGreaterThanThreshold(point, route, threshold) {
    if (point.latitude && point.longitude && Array.isArray(route)) {
      const nearestPointOnRoute = geolib.findNearest(point, route);
      const distanceToRoute = geolib.getDistance(point, nearestPointOnRoute);
      return distanceToRoute > threshold;
    }
    return false;
  }
  const openSocketConnection = () => {
    if (
      !socketRef.current ||
      socketRef.current.readyState === WebSocket.CLOSED
    ) {
      try {
        socketRef.current = new WebSocket(socketEndpoint);

        socketRef.current.onopen = () => {
          // setConnectionOpen(true);
        };

        socketRef.current.onclose = (event) => {
          // setConnectionOpen(false);
        };

        socketRef.current.onmessage = (event) => {
          const receivedData = JSON.parse(event.data);

          const newLocation = {
            latitude: receivedData.data.current_lat,
            longitude: receivedData.data.current_lng,
          };

          console.log("SOKET", newLocation);

          // setPositionSpeed(receivedData?.data?.speed);
          setCurrentLocation(newLocation);
          if (receivedData?.data?.actual_poly_coordinatess) {
            setTravelledRoute(
              JSON.parse(receivedData?.data?.actual_poly_coordinatess).map(
                (point) => ({
                  latitude: point.lat,
                  longitude: point.lng,
                })
              )
            );

            if (receivedData?.data?.actual_poly_coordinatess) {
              actualCompletedRouteRef.current = JSON.parse(
                receivedData?.data?.actual_poly_coordinatess
              );
              setCompletedPath(
                JSON.parse(receivedData?.data?.actual_poly_coordinatess).map(
                  (point) => ({
                    latitude: point.lat,
                    longitude: point.lng,
                  })
                )
              );
            }
          }

          if (user != "pilot" && receivedData.data?.trigger === "yes") {
            // let tempAlert = JSON.parse(receivedData.data?.alert_msg);
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
                  vehicleNumber:
                    tempAlert[tempAlert.length - 1]?.vehicle_number,
                  mID: tempAlert[tempAlert.length - 1]?.movement_id,
                });
                setIsSpeedAlertOpen(true);
              }
            }
          }
          onCurrentLocation(newLocation);
          if (
            receivedData.data?.alert_msg &&
            receivedData.data?.alert_msg.length !== alertsList.length
          ) {
            let tempList = [];
            receivedData.data?.alert_msg.forEach((alert) => {
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
        };
        socketRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("Error opening WebSocket connection:", error);
      }
    }
  };
  const onCurrentLocation = (newValue) => {
    // fetch(
    //   'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    //   newValue?.latitude +
    //   ',' +
    //   newValue?.longitude +
    //   '&key=' +
    //   GOOGLE_MAP_API_KEY,
    // )
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     if (responseJson.status === 'OK') {
    //       setNextJunction(responseJson?.results?.[0].formatted_address);
    //     } else {
    //     }
    //   });
  };

  const onAddPress = async () => {
    let isGuest = await getAsyncLocationLoginInfo();
    const obj = {
      data: {
        current_lat: currentLocation?.latitude,
        current_lng: currentLocation?.longitude,
        status: "ongoing",
        actual_start_time: moment(new Date()).tz("Asia/Kolkata", true).format(),
        actual_end_time: null,
      },
      params: currentMovement?.current?.movement_id,
      onSuccess: async () => {
        openSocketConnection();
        getLocation();
        await ReactNativeForegroundService.add_task(
          () => {
            getLocation();
          },
          {
            delay: 2000,
            onLoop: true,
            taskId: currentMovement?.current?.movement_id || "",
            onError: (e) => {},
          }
        );
        await ReactNativeForegroundService.start({
          id: currentMovement?.current?.movement_id,
          title: "Location Service",
          message: "E-Path is accessing location here",
          icon: "ic_launcher",
          color: "#000000",
        });
      },
      onFailure: () => {},
    };
    dispatch(updateMovementAction(obj));
  };
  const onPressConfirm = async () => {
    const obj = {
      data: {
        current_lat: currentLocation?.latitude,
        current_lng: currentLocation?.longitude,
        status: "past",
        actual_end_time: moment(new Date()).tz("Asia/Kolkata", true).format(),
        // actual_travel_time: convertMinutesToHHMMSS(moment(currentMovement?.current?.actual_start_time).diff(moment(new Date()),"minutes"))
      },
      params: currentMovement?.current?.movement_id,
      onSuccess: () => {
        setDatePickerVisibility(false);
        ReactNativeForegroundService.remove_all_tasks();
        ReactNativeForegroundService.stopAll();
        setTimeout(() => {
          setDriversMovementFinishedModal(true);
        }, 600);
      },
      onFailure: () => {},
    };
    dispatch(updateMovementAction(obj));
  };

  function onJunctionClick(junction) {
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
        let tempResults = null;
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
              setPlaces((places) => {
                return places.map((place) => {
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
  function convertMinutesToHHMMSS(totalMinutes: any) {
    // Calculate hours, minutes, and seconds
    let hours = Math.floor(totalMinutes / 60);
    let remainingMinutes = Math.floor(totalMinutes % 60);
    let seconds = Math.round((totalMinutes % 1) * 60);

    // Helper function to add leading zeros
    function pad(number: any) {
      return (number < 10 ? "0" : "") + number;
    }

    // Format the result
    return pad(hours) + ":" + pad(remainingMinutes) + ":" + pad(seconds);
  }

  useEffect(() => {
    if (currentLocation) {
      setNewData(currentLocation);
    }
  }, [currentLocation]);

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
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (currentMovement?.current?.junction_eta) {
      setPlaces(JSON.parse(currentMovement?.current?.junction_eta));
    }
    let intId = null;
    if (currentMovement?.current?.status == "ongoing") {
      openSocketConnection();
      if (currentMovement?.current?.expected_poly_coordinates) {
        setCurrentRoute(
          JSON.parse(currentMovement?.current?.expected_poly_coordinates).map(
            (coord) => {
              return { latitude: coord.lat, longitude: coord.lng };
            }
          )
        );
        setCurrenctNewVehicleRoute(
          JSON.parse(currentMovement?.current?.expected_poly_coordinates).map(
            (coord) => {
              return { latitude: coord.lat, longitude: coord.lng };
            }
          )
        );
        setVehicleRoute(
          JSON.parse(currentMovement?.current?.expected_poly_coordinates).map(
            (coord) => {
              return { latitude: coord.lat, longitude: coord.lng };
            }
          )
        );
      }
      if (currentMovement?.current?.actual_poly_coordinatess) {
        setTravelledRoute(
          JSON.parse(currentMovement?.current?.actual_poly_coordinatess).map(
            (coord) => {
              return { latitude: coord.lat, longitude: coord.lng };
            }
          )
        );
        actualCompletedRouteRef.current = JSON.parse(
          currentMovement?.current?.actual_poly_coordinatess
        );
        setCompletedPath(
          JSON.parse(currentMovement?.current?.actual_poly_coordinatess).map(
            (coord) => {
              return { latitude: coord.lat, longitude: coord.lng };
            }
          )
        );
      } else {
      }

      intId = setInterval(() => {
        getLocation();
      }, 2000);
    }
    return () => {
      clearInterval(intId);
    };
  }, [currentMovement.current]);

  return (
    <View style={AppStyles.flex}>
      <View style={styles.rowHeader}>
        <View style={AppStyles.flex}>
          <TextInput
            placeholder={"Start Destination"}
            style={[styles.inputView, { marginBottom: 10 }]}
            placeholderTextColor={colors.black}
            value={currentMovement?.current?.origin_address}
            // onChangeText={text => setStart(text)}
          />
          <TextInput
            placeholder="End Destination"
            style={styles.inputView}
            placeholderTextColor={colors.black}
            value={currentMovement?.current?.destination_address}
            // onChangeText={text => setEnd(text)}
          />
          <View style={styles.rowIcons}>
            <View style={{ flex: 1 }}>
              <ListIcon
                icon={icons.sportscar}
                value={currentMovement?.current?.vehicle_number}
                iconShow={true}
              />
              <ListIcon
                icon={icons.sportsPin}
                value={`${(
                  currentMovement?.current?.travel_distance / 1000
                )?.toFixed(2)} KM`}
                iconShow={true}
              />
              {user != "pilot" && (
                <ListIcon
                  icon={icons.User}
                  value={getPilotDetailsData?.name}
                  iconShow={true}
                  iconStyle={{ height: 14, width: 14 }}
                />
              )}
            </View>
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
                  iconStyle={{
                    height: 14,
                    width: 14,
                    tintColor: colors.main3f,
                  }}
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
              {currentMovement?.current?.status == "ongoing" &&
                user != "pilot" && (
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
                      iconStyle={{ height: 16, width: 16 }}
                    />
                  </TouchableOpacity>
                )}
            </View>
            {/* {currentMovement?.current?.status == 'past' && (
              <View>
                <ListIcon
                  icon={icons.stachometer}
                  value={'Avg Speed'}
                  iconShow={true}
                  viewStyle={{ alignSelf: 'flex-end' }}
                  iconStyle={{ height: 16, width: 16 }}
                />
                <ListIcon
                  icon={icons.stachometer}
                  value={''}
                  iconShow={false}
                  viewStyle={{ alignSelf: 'flex-end' }}
                />
              </View>
            )} */}
          </View>
        </View>
        <View style={{ marginLeft: 10, alignItems: "center", top: 12 }}>
          <Image source={icons.icon1} style={{ width: 10, height: 10 }} />
          <Image
            source={icons.line}
            style={{ width: 4, height: 27, marginVertical: 5 }}
          />
          <Image source={icons.icon2} style={{ width: 15, height: 15 }} />
        </View>
      </View>
      <MapView
        ref={mapRef}
        provider={Platform.OS == 'ios' ? PROVIDER_DEFAULT :PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        zoomControlEnabled
        // zoomEnabled
        region={{
          latitude: currentMovement?.current?.origin_lat,
          longitude: currentMovement?.current?.origin_lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {currentMovement?.current?.status == "upcoming" &&
          currentMovement?.current?.expected_poly_coordinates && (
            <Polyline
              coordinates={JSON.parse(
                currentMovement.current.expected_poly_coordinates
              ).map((coord) => {
                return { latitude: coord.lat, longitude: coord.lng };
              })}
              strokeWidth={4}
              strokeColor={lineColor}
            />
          )}
        {currentMovement?.current?.status == "past" &&
          currentMovement?.current?.expected_poly_coordinates && (
            <>
              <Polyline
                coordinates={JSON.parse(
                  currentMovement?.current?.expected_poly_coordinates
                ).map((coord) => {
                  return { latitude: coord.lat, longitude: coord.lng };
                })}
                strokeWidth={4}
                strokeColor={colors.map_line}
              />
              {currentMovement?.current?.actual_poly_coordinatess && (
                <Polyline
                  coordinates={JSON.parse(
                    currentMovement?.current?.actual_poly_coordinatess
                  ).map((coord) => {
                    return { latitude: coord.lat, longitude: coord.lng };
                  })}
                  strokeWidth={4}
                  strokeColor={colors.grayab2}
                  zIndex={6}
                />
              )}
            </>
          )}
        {currentMovement?.current?.status == "ongoing" && currentRoute && (
          <>
            {travelledRoute?.length > 0 && currentLocation !== null && (
              <MapViewDirections
                resetOnChange={false}
                mode="DRIVING"
                strokeWidth={6}
                strokeColor={colors.grayab2}
                origin={travelledRoute?.[0]}
                apikey={GOOGLE_MAP_API_KEY}
                destination={{
                  latitude: currentLocation?.latitude,
                  longitude: currentLocation?.longitude,
                }}
              />
            )}

            {isRouteDeviated && currentRoute?.length > 0 && (
              // <MapViewDirections
              //   resetOnChange={false}
              //   mode="DRIVING"
              //   strokeWidth={4}
              //               strokeColor={colors.map_line}

              //   lineDashPattern={[10, 2]}
              //   origin={currentRoute?.[0]}
              //   apikey={GOOGLE_MAP_API_KEY}
              //   destination={currentRoute?.[currentRoute?.length - 1]}
              // />
              <Polyline
                strokeWidth={3}
                coordinates={currentRoute}
                strokeColor={colors.map_line}
                lineDashPattern={[10, 2]}
                zIndex={-1}
              />
            )}

            {vehicleRoute?.length > 0 ? (
              // <MapViewDirections
              //   resetOnChange={false}
              //   mode="DRIVING"
              //   strokeWidth={4}
              //               strokeColor={colors.map_line}

              //   origin={vehicleRoute?.[0]}
              //   apikey={GOOGLE_MAP_API_KEY}
              //   destination={vehicleRoute?.[vehicleRoute?.length - 1]}
              // />
              <Polyline
                strokeWidth={3}
                coordinates={vehicleRoute}
                strokeColor={colors.map_line}
              />
            ) : null}

            {/* {vehicleRoute && (
              <Polyline
                strokeWidth={4}
                coordinates={vehicleRoute}
                            strokeColor={colors.map_line}

              />
            )}*/}

            {/* {currenctNewVehicleRoute && (
              <Polyline
                strokeWidth={4}
                lineDashPattern={[10, 2]}
                strokeColor={colors.red}
                coordinates={currenctNewVehicleRoute}
              />
            )} */}

            {/* {travelledRoute && (
              <Polyline
                strokeWidth={4}
                strokeColor={colors.red}
                coordinates={travelledRoute}
              />
            )} */}

            {/* {!isRouteDeviated && (
              <Polyline
                coordinates={currentRoute}
                strokeWidth={4}
                strokeColor={lineColor}
                zIndex={5}
              />
            )} */}
            {/* {isRouteDeviated && (
              <Polyline
                zIndex={5}
                strokeWidth={4}
                lineDashPattern={[10, 2]}
                coordinates={currentRoute}
              />
            )} */}
            {/* {travelledRoute && (
              <Polyline
                coordinates={travelledRoute}
                strokeWidth={4}
                strokeColor={colors.grayab2}
                zIndex={6}
              />
            )} */}
            {/* {currentMovement?.current?.expected_poly_coordinates && (
              <Polyline
                coordinates={JSON.parse(
                  currentMovement?.current?.expected_poly_coordinates
                ).map((coord) => {
                  return { latitude: coord.lat, longitude: coord.lng };
                })}
                strokeWidth={5}
                            strokeColor={colors.map_line}

              />
            )} */}
          </>
        )}
        {currentMovement?.current?.status == "ongoing" && currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation?.latitude,
              longitude: currentLocation?.longitude,
            }}
          >
            <View style={{}}>
              <Image
                resizeMode="stretch"
                source={icons.carIcon}
                style={{ height: 35, width: 35, marginTop: 20 }}
              />
            </View>
          </Marker>
        )}

        <Marker
          ref={mapRef}
          coordinate={{
            latitude: currentMovement?.current?.origin_lat,
            longitude: currentMovement?.current?.origin_lng,
          }}
        >
          <View style={{}}>
            <Image
              source={icons.endPin}
              style={{ height: 35, width: 35 }}
              resizeMode="stretch"
            />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: currentMovement?.current?.dest_lat,
            longitude: currentMovement?.current?.dest_lng,
          }}
        >
          <View style={{}}>
            <Image
              source={icons.startPin}
              style={{ height: 35, width: 35 }}
              resizeMode="stretch"
            />
          </View>
        </Marker>
        {places.map((place) => {
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
              <View style={{}}>
                <Image
                  source={
                    place["jn_control"] === "Unsignalised" ||
                    place["jn_control"] === "Potential Conflict point" ||
                    place["jn_control"] === "Existing"
                      ? icons.unsignalised_juntion
                      : icons.junction
                  }
                  style={{ height: 35, width: 35 }}
                  resizeMode="stretch"
                />
                {/*{<Callout style={{ backgroundColor: 'white', width:200, height:80 }}>*/}
                {/*  {(place["name"] === jnTooltipData["name"]) ? <><Text> Name: {jnTooltipData["name"]}</Text>*/}
                {/*  <Text> Distance: {jnTooltipData["distance"]}</Text>*/}
                {/*  <Text> Duration: {jnTooltipData["duration"]}</Text>*/}
                {/*  <Text> ETA: {jnTooltipData["eta"]}</Text></>:<Text>Loading...</Text>}*/}
                {/*</Callout>}*/}
                {/*<JunctionToolTip jnTooltipData={jnTooltipData} place={place}/>*/}
              </View>
            </Marker>
          );
        })}
      </MapView>
      {user === "pilot" && currentMovement?.current?.status == "upcoming" && (
        <TouchableOpacity style={styles.btnStyle} onPress={onAddPress}>
          <Text style={styles.btnText}>{"START"}</Text>
        </TouchableOpacity>
      )}
      {user === "pilot" && currentMovement?.current?.status == "ongoing" && (
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => {
            setDatePickerVisibility(true);
          }}
        >
          <Text style={styles.footerBtnText}>{"FINISH"}</Text>
        </TouchableOpacity>
      )}
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
        <View style={styles.footerView}>
          <View>
            <Image source={icons.sportsPin} style={styles.iconStyle} />
            <Text style={styles.iconText}>
              {(currentMovement?.current?.travel_distance / 1000)?.toFixed(2)}{" "}
              Km
            </Text>
          </View>

          <View>
            <Image source={icons.ontime} style={styles.iconStyle} />
            <Text style={styles.iconText}>
              {convertMinutesToHHMMSS(
                Math.ceil(
                  moment(currentMovement?.current?.actual_end_time).diff(
                    moment(currentMovement?.current?.actual_start_time),
                    "seconds"
                  ) / 60
                )
              )}{" "}
              min
            </Text>
          </View>
        </View>
      )}
      <DriversMovementModal
        headerText={
          "Are you sure you want to send a notification to the agency/authority?"
        }
        isVisible={callSOSVisible}
        onPressCancel={() => {
          setCallSOSVisible(false);
        }}
        onPressConfirm={() => {
          setTimeout(() => {
            setDriversSOSModal(true);
          }, 500);
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
        onPressConfirm={onPressConfirm}
        tabSelect={2}
      />
      <DriversSOSModal
        isVisible={driversSOSModal}
        onPressCancel={() => {
          setDriversSOSModal(false);
        }}
      />
      <DriversMovementFinishedModal
        isVisible={driversMovementFinishedModal}
        onPressCancel={() => {
          setDriversMovementFinishedModal(false);
          navigation.navigate("DriverHomeScreen", { isFinished: true });
        }}
        params={currentMovement?.current}
        positionSpeed={0}
        distanceTime={distanceTime}
      />
      {jnTooltipData && (
        <ReactNativeModal isVisible={jnTooltipData}>
          <View
            style={{
              borderRadius: 25,
              backgroundColor: colors.white,
              padding: 10,
            }}
          >
            <View style={{ backgroundColor: "white", padding: 10 }}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 10,
                  height: 22,
                  width: 22,
                  backgroundColor: colors.main3f,
                  borderRadius: 50,
                }}
              ></View>
              <>
                <Text> Name: {jnTooltipData["name"]}</Text>
                <Text> Distance: {jnTooltipData["distance"]}</Text>
                <Text> Duration: {jnTooltipData["duration"]}</Text>
                <Text> ETA: {jnTooltipData["eta"]}</Text>
              </>
              {/*<TouchableOpacity onPress={() => {setJnTooltipData(null)}}>*/}
              {/*  <Text>close</Text>*/}
              {/*</TouchableOpacity>*/}
            </View>
            <TouchableOpacity
              style={{ position: "absolute", top: 13, right: 17 }}
              onPress={() => setJnTooltipData(null)}
            >
              <ListIcon
                name="close"
                icon={icons.close}
                iconShow={true}
                iconStyle={{ height: 10, width: 10 }}
              />
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      )}
      {isSpeedAlertOpen && (
        <ReactNativeModal isVisible={isSpeedAlertOpen}>
          <View
            style={{
              borderRadius: 25,
              backgroundColor: colors.white,
              padding: 10,
            }}
          >
            <View style={{ backgroundColor: "white", padding: 10 }}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 10,
                  height: 22,
                  width: 22,
                  backgroundColor: colors.main3f,
                  borderRadius: 50,
                }}
              ></View>
              <Text>{speedAlertMsg?.time}</Text>
              <Text>{`Vehicle ${speedAlertMsg?.vehicleNumber} with Movemnt ID: #${speedAlertMsg?.mID} got struck at ${speedAlertMsg?.location}`}</Text>
            </View>
            <TouchableOpacity
              style={{ position: "absolute", top: 13, right: 17 }}
              onPress={() => {
                setIsSpeedAlertOpen(false);
                setSpeedAlertMsg("");
              }}
            >
              <ListIcon
                name="close"
                icon={icons.close}
                iconShow={true}
                iconStyle={{ height: 10, width: 10 }}
              />
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      )}
      {showFullAlertsList && (
        <ReactNativeModal isVisible={showFullAlertsList}>
          <View
            style={{
              borderRadius: 25,
              backgroundColor: colors.white,
              padding: 10,
            }}
          >
            <View style={{ backgroundColor: "white", padding: 10 }}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 10,
                  height: 22,
                  width: 22,
                  backgroundColor: colors.main3f,
                  borderRadius: 50,
                }}
              ></View>
              {alertsList.length ? (
                alertsList.map((alert, index) => {
                  return (
                    <View key={`alert${index}`}>
                      <Text>{`${index + 1}. ${alert?.time}`}</Text>
                      <Text>{`Vehicle ${alert?.vehicleNumber} with Movemnt ID: #${alert?.mID} got struck at ${alert?.location}`}</Text>
                    </View>
                  );
                })
              ) : (
                <Text>No Alerts</Text>
              )}
            </View>
            <TouchableOpacity
              style={{ position: "absolute", top: 13, right: 17 }}
              onPress={() => {
                setShowFullAlertsList(false);
              }}
            >
              <ListIcon
                name="close"
                icon={icons.close}
                iconShow={true}
                iconStyle={{ height: 10, width: 10 }}
              />
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      )}
    </View>
  );
};

export default DriverMovement;

const styles = StyleSheet.create({
  rowHeader: {
    flexDirection: "row",
    // alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(3),
    paddingHorizontal: hp(2),
  },
  directionIcon: {
    resizeMode: "contain",
    height: 60,
    marginLeft: hp(2),
    marginTop: hp(2),
  },
  inputView: {
    backgroundColor: colors.graye6,
    height: 40,
    ...commonFontStyle(500, 14, colors.black),
    borderRadius: 5,
    paddingHorizontal: 15,
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
  callsosIcon: {
    width: 40,
    height: 40,
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
  callsosIconView: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    right: 55,
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
});
