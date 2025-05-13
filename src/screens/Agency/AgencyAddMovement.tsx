import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppStyles } from "../../theme/appStyles";
import { colors } from "../../theme/colors";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  commonFontStyle,
  hp,
  wp,
} from "../../theme/fonts";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import DropDownElement from "../../compoment/DropDownElement";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useNavigation, useTheme } from "@react-navigation/native";
import { icons } from "../../utils/Icon";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import moment from "moment";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAP_API_KEY, googleMapQuery } from "../../utils/apiConstants";
import { getAsyncLocationLoginInfo } from "../../utils/asyncStorage";
import { createMovementAction } from "../../action/movementAction";
import {
  getGoogleMapAddress,
  getPilotAction,
  getVehicleAction,
} from "../../action/commonAction";
import {
  Severity_Types,
  convertMinutesToHHMMSS,
  filterPlacesAlongRoute,
  infoToast,
} from "../../utils/globalFunctions";
import { LATITUDE_DELTA, LONGITUDE_DELTA } from "../../utils/commonFunction";
import Loader from "../../compoment/Loader";
import MapViewDirections from "react-native-maps-directions";
import Geolocation from "@react-native-community/geolocation";
import Data from "../../Data";
import "moment-timezone";
import ServiceTypeDropDown from "../../compoment/ServiceTypeDropDown";
import { requestLocationPermission } from "../../utils/loactionHandler";
import GoogleAddressSearch from "../../compoment/GoogleAddressSearch";
import ShowAddress from "../../compoment/ShowAddress";

type Props = {};

const AgencyAddMovement = (props: Props) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { getPilotData, getVehicleData, currentLocationInfo } = useAppSelector(
    (state) => state.common
  );
  const ref = useRef<any>();
  const mapRef = React.useRef<MapView | null>(null);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [stop, setStop] = useState("");

  const [pilot, setPilot] = useState("Select Pilot");
  const [vehicle, setVehicle] = useState("Select Vehicle ");
  const [selectData, setDelectData] = useState(moment(new Date()));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expectedDistance, setExpectedDistance] = useState<any>("");
  const [expectedDistanceSecond, setExpectedDistanceSecond] = useState<
    any | string
  >("");
  const [expectedRoute, setExpectedRoute] = useState([]);
  const [loader, setLoader] = useState(false);
  const [places, setPlaces] = useState<any>([]);
  const [severity, setSeverity] = useState("");
  const [expectedDurationInMinutes, setExpectedDurationInMinutes] = useState(0);
  const [expectedDurationInMinutesSecond, setExpectedDurationInMinutesSecond] =
    useState(0);
  const [startPoint, setStartPoint] = useState<any>(null);
  const [endPoint, setEndpoint] = useState<any>(null);
  const [stopPoint, setStopPoint] = useState<any>(null);

  const [isAddPoint, setIsAddPoint] = useState(false);
  const [expectedRouteSecond, setExpectedRouteSecond] = useState([]);
  const [calculateCoordinates, setCalculateCoordinates] = useState<any>({});

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 12.971599,
    longitude: 77.594566,
  });

  const [isFocusFirst, setIsFocusFirst] = useState(false);
  const [isFocusSecond, setIsFocusSecond] = useState(false);
  const [isFocusThird, setIsFocusThird] = useState(false);

  const inputElFirst = useRef<any>(null);
  const inputElSecond = useRef<any>(null);
  const inputElThird = useRef<any>(null);

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  useEffect(() => {
    onCurrentLocation();
  }, []);

  useEffect(() => {
    const obj = {
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getVehicleAction(obj));
    dispatch(getPilotAction(obj));
  }, []);

  useEffect(() => {
    if (mapRef.current && startPoint !== null && endPoint !== null) {
      const midPoint = {
        latitude: (startPoint.latitude + endPoint.latitude) / 2,
        longitude: (startPoint.longitude + endPoint.longitude) / 2,
      };
      let data = [];
      if (stopPoint !== null) {
        data = [startPoint, endPoint, stopPoint, midPoint];
      } else {
        data = [startPoint, endPoint, midPoint];
      }

      mapRef.current.fitToCoordinates([startPoint, endPoint, midPoint], {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    }
  }, [startPoint, endPoint, stopPoint]);

  const onCurrentLocation = async () => {
    setLoader(true);
    await requestLocationPermission(
      (position) => {
        const data = {
          latitude: position.latitude,
          longitude: position.longitude,
        };
        setCurrentLocation(data);
        setStartPoint(data);
        if (
          currentLocationInfo?.latitude != position?.latitude &&
          currentLocationInfo?.longitude != position?.longitude
        ) {
          let obj = {
            params: {
              latlng: `${position.latitude},${position.longitude}`,
              key: GOOGLE_MAP_API_KEY,
            },
            data: data,
            onSuccess: (address: string) => {
              setLoader(false);
              ref.current?.setAddressText(address);
              setStart(address);
            },
            onFailure: () => {},
          };
          dispatch(getGoogleMapAddress(obj));
        } else {
          setLoader(false);
          ref.current?.setAddressText(currentLocationInfo?.address);
          setStart(currentLocationInfo?.address);
        }
      },
      (error) => {
        setLoader(false);
      }
    );
  };

  const onAddPress = async () => {
    let isGuest = await getAsyncLocationLoginInfo();
    const pilot_id = getPilotData.filter((item: any) => item?.name === pilot);
    if (pilot === "Select Pilot") {
      infoToast("Please select a pilot");
    } else if (vehicle === "Select Vehicle") {
      infoToast("Please select a vehicle");
    } else if (severity == "") {
      infoToast("Please select a severity type");
    } else {
      setLoader(true);
      let data = {
        agency_id: isGuest?.ids?.agency_id,
        pilot_id: pilot_id[0]?.pilot_id,
        vehicle_number: vehicle,
        origin_lat: startPoint?.latitude,
        origin_lng: startPoint?.longitude,
        dest_lat: endPoint?.latitude,
        dest_lng: endPoint?.longitude,
        current_lat: currentLocation?.latitude,
        current_lng: currentLocation?.longitude,
        origin_address: start,
        destination_address: end,
        planned_start_time: selectData.tz("Asia/Kolkata", true).format(),
        planned_end_time: selectData
          .tz("Asia/Kolkata", true)
          .add(expectedDurationInMinutes, "minutes")
          .format(),
        actual_start_time: null,
        actual_end_time: null,
        actual_travel_time: null,
        avg_speed: null,
        status: "upcoming",
        actual_poly_coordinates: null,
        estimated_travel_time: convertMinutesToHHMMSS(
          expectedDurationInMinutes + expectedDurationInMinutesSecond
        ),
        total_distance: Math.ceil(
          Number(expectedDistance + expectedDistanceSecond)
        ),
        expected_poly_coordinates: JSON.stringify(expectedRoute),
        junction_eta: JSON.stringify(places),
        severity: severity,
      };
      if (stopPoint !== null) {
        data.stop_address = stop;
        data.stop_lat = stopPoint?.latitude;
        data.stop_lng = stopPoint?.longitude;
        data.expected_poly_coordinates = JSON.stringify([
          ...expectedRoute,
          ...expectedRouteSecond,
        ]);
      }
      const obj = {
        data: data,
        onSuccess: () => {
          setLoader(false);
          navigation?.goBack();
        },
        onFailure: () => {
          setLoader(false);
        },
      };
      dispatch(createMovementAction(obj));
    }
  };

  const calculateJunctions = async (result: any) => {
    let placesTest = null;
    if (stopPoint !== null) {
      placesTest = filterPlacesAlongRoute(
        [...result.coordinates, ...calculateCoordinates?.coordinates],
        Data
      );
    } else {
      placesTest = filterPlacesAlongRoute(result.coordinates, Data);
    }
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
  };

  const onPressAddPoint = () => {
    setIsAddPoint(true);
  };

  const onPressMinusPoint = () => {
    setIsAddPoint(false);
    setStop("");
    setStopPoint(null);
    setExpectedRouteSecond([]);
    setExpectedDurationInMinutesSecond(0);
    setExpectedDistanceSecond("");
  };

  let region = {
    latitude: currentLocation?.latitude || 12.971599,
    longitude: currentLocation?.longitude || 77.594566,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        <View style={{ flex: 1, marginTop: hp(1) }}>
          {isFocusFirst ? (
            <GoogleAddressSearch
              value={start}
              placeholder="Origin"
              onGetData={(respose: any) => {
                setStart(respose.address);
                let dataTemp = {
                  latitude: respose.location?.lat,
                  longitude: respose.location?.lng,
                };
                setStartPoint(dataTemp);
                setIsFocusFirst(false);
              }}
              onChangeText={(text) => setStart(text)}
              onFocus={() => setIsFocusFirst(true)}
              onBlur={() => setIsFocusFirst(false)}
              inputRef={inputElFirst}
            />
          ) : (
            <ShowAddress
              value={start}
              placeholder="Origin"
              onPress={() => {
                setIsFocusFirst(true);
                setTimeout(() => {
                  inputElFirst?.current?.focus();
                }, 100);
              }}
            />
          )}

          {isAddPoint ? (
            <>
              {isFocusThird ? (
                <GoogleAddressSearch
                  value={stop}
                  placeholder="Stop Point Address"
                  onGetData={(respose: any) => {
                    setStop(respose.address);
                    let dataTemp = {
                      latitude: respose.location?.lat,
                      longitude: respose.location?.lng,
                    };
                    setStopPoint(dataTemp);
                    setIsFocusThird(false);
                  }}
                  onChangeText={(text) => setStop(text)}
                  onFocus={() => setIsFocusThird(true)}
                  onBlur={() => setIsFocusThird(false)}
                  inputRef={inputElThird}
                />
              ) : (
                <ShowAddress
                  value={stop}
                  placeholder="Stop Point Address"
                  onPress={() => {
                    setIsFocusThird(true);
                    setTimeout(() => {
                      inputElThird?.current?.focus();
                    }, 100);
                  }}
                />
              )}
            </>
          ) : null}

          {isFocusSecond ? (
            <GoogleAddressSearch
              value={end}
              placeholder="Destination"
              onGetData={(respose: any) => {
                setEnd(respose.address);
                let dataTemp = {
                  latitude: respose.location?.lat,
                  longitude: respose.location?.lng,
                };
                setEndpoint(dataTemp);
                setIsFocusSecond(false);
              }}
              onChangeText={(text) => setEnd(text)}
              onFocus={() => setIsFocusSecond(true)}
              onBlur={() => setIsFocusSecond(false)}
              inputRef={inputElSecond}
            />
          ) : (
            <ShowAddress
              value={end}
              placeholder="Destination"
              onPress={() => {
                setIsFocusSecond(true);
                setTimeout(() => {
                  inputElSecond?.current?.focus();
                }, 100);
              }}
            />
          )}
        </View>
        {!isAddPoint ? (
          <TouchableOpacity
            onPress={onPressAddPoint}
            style={styles.addContainer}
          >
            <Image
              resizeMode="contain"
              style={styles.addIconStyle}
              source={icons.add}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onPressMinusPoint}
            style={styles.addContainer}
          >
            <Image
              resizeMode="contain"
              style={styles.addIconStyle}
              source={icons.minus}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* <Text>
        {(Number(expectedDistance + expectedDistanceSecond) / 1000).toFixed(2)}
      </Text> */}
      <View style={[styles.rowIcons]}>
        <DropDownElement
          value={pilot}
          onChange={(value) => setPilot(value)}
          icon={icons.User}
          textInputStyle={{ width: SCREEN_WIDTH * 0.33 }}
          placeholder="Select Pilot"
          dataList={getPilotData}
          search={"name"}
        />
        <DropDownElement
          value={vehicle}
          onChange={(value) => setVehicle(value)}
          icon={icons.sportscar}
          textInputStyle={{ width: SCREEN_WIDTH * 0.35 }}
          placeholder="Enter Vehicle Number"
          dataList={getVehicleData}
          search={"vehicle_number"}
          dropDowncontainerStyle={{ width: SCREEN_WIDTH * 0.45 }}
        />
      </View>
      <View style={{ ...styles.rowCenterStyle, marginTop: 5, zIndex: -1, }}>
        <TouchableOpacity
          onPress={() => setDatePickerVisibility(true)}
          style={styles.dropDownIcon}
        >
          <Image style={styles.clockIconStyle} source={icons.clock} />
        </TouchableOpacity>
        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={(date) => {
            setDelectData(moment(date));
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />
        <TouchableOpacity
          onPress={() => setDatePickerVisibility(true)}
          style={styles.datePickerContainer}
        >
          <Text style={commonFontStyle(500, 12, colors.black)}>
            {moment(selectData).format("MMM D h:mm a")}
          </Text>
        </TouchableOpacity>
        
      </View>

      <ServiceTypeDropDown
        data={Severity_Types}
        value={severity}
        onChange={(item) => {
          setSeverity(item?.value);
        }}
        isSearch={false}
        placeholder="Select Severity Type"
        containerStyle={{zIndex: -1,}}
      />
      <MapView
        ref={mapRef}
        provider={Platform.OS == 'ios' ? PROVIDER_DEFAULT :PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={region}
        initialRegion={region}
      >
        {startPoint !== null && endPoint !== null && (
          <MapViewDirections
            origin={{
              latitude: Number(startPoint?.latitude),
              longitude: Number(startPoint?.longitude),
            }}
            destination={{
              latitude: Number(endPoint?.latitude),
              longitude: Number(endPoint?.longitude),
            }}
            onReady={(result) => {
              const tempFormatRoute: any = [];
              result.coordinates.forEach((data) => {
                tempFormatRoute.push({
                  lat: data.latitude,
                  lng: data.longitude,
                });
              });
              setExpectedDurationInMinutes(result.duration);
              setExpectedRoute(tempFormatRoute);
              setExpectedDistance(result?.distance * 1000);
              setCalculateCoordinates(result);
              calculateJunctions(result);
            }}
            apikey={GOOGLE_MAP_API_KEY}
            strokeWidth={4}
            strokeColor={colors.map_line}
            onError={(error) => {
              Alert.alert("", "This route is not available");
            }}
          />
        )}
        {endPoint !== null && stopPoint !== null && (
          <MapViewDirections
            origin={{
              latitude: Number(endPoint?.latitude),
              longitude: Number(endPoint?.longitude),
            }}
            destination={{
              latitude: Number(stopPoint?.latitude),
              longitude: Number(stopPoint?.longitude),
            }}
            onReady={(result) => {
              const tempFormatRoute: any = [];
              result.coordinates.forEach((data) => {
                tempFormatRoute.push({
                  lat: data.latitude,
                  lng: data.longitude,
                });
              });
              setExpectedDurationInMinutesSecond(result.duration);
              setExpectedRouteSecond(tempFormatRoute);
              setExpectedDistanceSecond(result.distance * 1000);
              calculateJunctions(result);
            }}
            apikey={GOOGLE_MAP_API_KEY}
            strokeWidth={4}
            strokeColor={colors.map_line}
            onError={(error) => {
              Alert.alert("", "This route is not available");
            }}
          />
        )}
        <Marker
          coordinate={{
            latitude: Number(currentLocation?.latitude),
            longitude: Number(currentLocation?.longitude),
          }}
        >
          <Image
            source={icons.currentMarker}
            resizeMode="stretch"
            style={styles.markerStyle}
          />
        </Marker>
        {startPoint !== null ? (
          <Marker
            coordinate={{
              latitude: Number(startPoint?.latitude),
              longitude: Number(startPoint?.longitude),
            }}
          >
            <Image
              source={icons.endPin}
              style={styles.zIndexMarkerStyle}
              resizeMode="stretch"
            />
          </Marker>
        ) : null}
        {endPoint !== null ? (
          <Marker
            coordinate={{
              latitude: Number(endPoint?.latitude),
              longitude: Number(endPoint?.longitude),
            }}
          >
            <Image
              resizeMode="stretch"
              source={icons.startPin}
              style={styles.markerStyle}
            />
          </Marker>
        ) : null}
        {stopPoint !== null ? (
          <Marker
            coordinate={{
              latitude: Number(stopPoint?.latitude),
              longitude: Number(stopPoint?.longitude),
            }}
          >
            <Image
              source={icons.startPin}
              style={styles.markerStyle}
              resizeMode="stretch"
            />
          </Marker>
        ) : null}

        {places.map((place: any) => {
          return (
            <Marker
              coordinate={{
                latitude: place["latitude"],
                longitude: place["longitude"],
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
                resizeMode="stretch"
                style={styles.markerStyle}
              />
            </Marker>
          );
        })}
      </MapView>
      <TouchableOpacity
        style={!start || !end ? styles.disabledBtnStyle : styles.btnStyle}
        onPress={onAddPress}
        disabled={!start || !end}
      >
        <Text style={styles.btnText}>{"Add"}</Text>
      </TouchableOpacity>
      <Loader visible={loader} />
    </View>
  );
};

export default AgencyAddMovement;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: hp(2),
      backgroundColor: colors.white,
    },
    rowHeader: {
      flexDirection: "row",
      marginTop: hp(3),
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
      justifyContent: "space-between",
      overflow: "visible",
      zIndex: -1,
    },
    dropDownIcon: {
      height: 26,
      width: 29,
      backgroundColor: colors.graye6,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    map: {
      flex: 1,
      // marginBottom: hp(2),
      zIndex: -1,
    },
    btnStyle: {
      backgroundColor: colors.main3f,
      position: "absolute",
      bottom: 15,
      alignSelf: "center",
      paddingHorizontal: 40,
      paddingVertical: 10,
      borderRadius: 10,
    },
    disabledBtnStyle: {
      backgroundColor: "grey",
      position: "absolute",
      bottom: 15,
      alignSelf: "center",
      paddingHorizontal: 40,
      paddingVertical: 10,
      borderRadius: 10,
      opacity: 5,
    },
    btnText: {
      ...commonFontStyle(600, 16, colors.white),
    },
    originContainer: {
      position: "absolute",
      zIndex: 11,
      width: SCREEN_WIDTH - hp(8),
      left: 14,
      top: hp(1),
    },
    textInputStyle: {
      backgroundColor: colors.graye6,
      marginVertical: 5,
      width: SCREEN_WIDTH * 0.86,
      top: 20,
    },
    textInputContainer: {
      zIndex: 1,
      width: SCREEN_WIDTH * 0.86,
      // height: isFocusShow ? 200 : 0,
    },
    destinationContainer: {
      position: "absolute",
      width: SCREEN_WIDTH - hp(8),
      left: 14,
      top: hp(7.2),
    },
    listView: {
      height: 300,
      top: 15,
    },
    datePickerContainer: {
      backgroundColor: colors.graye6,
      ...commonFontStyle(500, 12, colors.black),
      borderRadius: 5,
      paddingHorizontal: 9,
      marginLeft: 5,
      height: 26,
      justifyContent: "center",
      paddingVertical: Platform.OS == "android" ? 0 : 1,
      width: SCREEN_WIDTH * 0.33,
    },
    clockIconStyle: {
      height: 17,
      width: 17,
      resizeMode: "contain",
      tintColor: colors.black,
    },
    rowStyle: {
      flexDirection: "row",
      alignItems: "center",
    },
    lineStyle: {
      width: 4,
      height: 27,
      marginVertical: 5,
    },
    lineContainer: {
      marginLeft: 10,
      alignItems: "center",
      top: hp(3),
    },
    redDotStyle: {
      width: 10,
      height: 10,
    },
    greenDotStyle: {
      width: 15,
      height: 15,
    },
    zIndexMarkerStyle: {
      height: 35,
      width: 35,
      zIndex: -1,
    },
    markerStyle: {
      height: 35,
      width: 35,
    },
    rowCenterStyle: {
      flexDirection: "row",
      alignItems: "center",
      zIndex: -1,
    },
    addIconStyle: {
      height: wp(10),
      width: wp(10),
      marginBottom: hp(1),
      alignSelf: "flex-end",
      tintColor: colors.main3f,
    },
    addContainer: {
      width: wp(11),
      zIndex: -1,
    },
  });
};
