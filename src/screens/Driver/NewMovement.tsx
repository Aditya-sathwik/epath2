import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Platform } from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getMovementDetailsAction } from "../../action/movementAction";
import { colors } from "../../theme/colors";
import { commonFontStyle, hp } from "../../theme/fonts";
import MapView, { AnimatedRegion, Marker, Polyline, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import {
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  getBackgroudLocationPermissions,
  requestLocationPermission,
} from "../../utils/loactionHandler";
import { icons } from "../../utils/Icon";
import Geolocation from "react-native-geolocation-service";
import { findingCurrentLocationOnRoute } from "../../utils/globalFunctions";

type latlang = {
  lat: number;
  lng: number;
};

type locationProps = { latitude: number; longitude: number };

const NewMovement = () => {
  const dispatch = useAppDispatch();
  const currentMovement = useRef<any>();
  const mapRef = useRef<MapView | null | any>(null);
  const markerRef = useRef<MapView | null | any>(null);
  const routePoints = useRef<any>([]);
  const currentNewVehicleRouteRef = useRef<any>([]);
  const currentMarkerRotation = useRef(0);
  const [initialLocation, setInitialLocation] = useState({});
  const [coordinate, setCoordinate] = useState<any>({});
  const [mapDelta, setMapDelta] = useState<any>({});
  const [currentLocation, setCurrentLocation] = useState<locationProps | any>(
    {}
  );
  const [completedWaypoints, setCompletedWaypoints] = useState<any>([]);
  const [origin, setOrigin] = useState<any>({});
  const [destination, setDestination] = useState<any>({});
  const [region, setRegion] = useState({
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    latitude: 12.972442,
    longitude: 77.580643,
  });

  const { movementID } = useAppSelector((state) => state.common);

  useEffect(() => {
    async function getPermission() {
      await requestLocationPermission(
        async (coords: any) => {
          setInitialLocation(coords);
          // setCurrentLocation({
          //   latitude: coords.latitude,
          //   longitude: coords.longitude,
          // });
          setCoordinate(
            new AnimatedRegion({
              latitude: coords.latitude,
              longitude: coords.longitude,
            })
          );
          getBackgroudLocationPermissions();
        },
        () => {}
      );
    }
    getPermission();
  }, []);

  useEffect(() => {
    const watchId = startWatchingPosition();

    return () => {
      // Clear the watch position when the component is unmounted
      Geolocation.clearWatch(watchId);
    };
  }, []);

  const startWatchingPosition = () => {
    const successCallback = (location: any) => {
      console.log(`New position: `, location.coords);
      const { latitude, longitude } = location.coords;
      currentMarkerRotation.current = location?.coords?.heading;

      const newCoordinate = {
        latitude,
        longitude,
      };
      setCurrentLocation(newCoordinate);
      if (Platform.OS === "android") {
        if (markerRef.current) {
          markerRef.current.animateMarkerToCoordinate(newCoordinate, 2000);
        }
      } else {
        coordinate.timing(newCoordinate).start();
      }
      let newRegion = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: mapDelta?.latitudeDelta || LATITUDE_DELTA,
        longitudeDelta: mapDelta?.longitudeDelta || LONGITUDE_DELTA,
      };
      const newCamera = {
        center: {
          latitude: latitude,
          longitude: longitude,
        },
        pitch: 2,
        heading: 0,
        zoom: 16,
      };
      mapRef?.current?.animateToRegion(newRegion);
      mapRef.current.animateCamera(newCamera, { duration: 4000 });

      setCoordinate(new AnimatedRegion(newCoordinate));

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
    const obj = {
      id: movementID,
      onSuccess: (response: any) => {
        currentMovement.current = response;
        setOrigin({
          latitude: response?.origin_lat,
          longitude: response?.origin_lng,
        });
        setDestination({
          latitude: response?.dest_lat,
          longitude: response?.dest_lng,
        });
        let expected_poly_coordinates = JSON.parse(
          response.expected_poly_coordinates
        ).map((coord: { lat: number; lng: number }) => {
          return { latitude: coord.lat, longitude: coord.lng };
        });
        routePoints.current = expected_poly_coordinates;
        currentNewVehicleRouteRef.current = expected_poly_coordinates;
        setRegion({
          ...region,
          latitude: (response.origin_lat + response.dest_lat) / 2,
          longitude: (response.origin_lng + response.dest_lng) / 2,
        });
      },
      onFailure: () => {},
    };
    dispatch(getMovementDetailsAction(obj));
  }, []);

  useEffect(() => {
    if (
      Object.keys(currentLocation).length &&
      currentNewVehicleRouteRef?.current?.length
    ) {
      // const routeFeature = turf.lineString(turfRoute);
      const nearestPointOnRoute: any = findingCurrentLocationOnRoute(
        currentLocation,
        currentNewVehicleRouteRef?.current
      );
      // Calculate the distance between the user's location and the nearest point on the route

      const index = currentNewVehicleRouteRef?.current.findIndex(
        (latLng: any) => {
          return (
            latLng.latitude == nearestPointOnRoute.latitude &&
            latLng.longitude == nearestPointOnRoute.longitude
          );
        }
      );

      if (index !== -1) {
        const tempCompletedPath = currentNewVehicleRouteRef?.current.slice(
          0,
          index + 1
        );
        setCompletedWaypoints(tempCompletedPath);
      }
    }
  }, [currentLocation, currentNewVehicleRouteRef.current]);

  const onRegionChange = (position: any) => {
    setMapDelta({
      latitudeDelta: position?.latitudeDelta,
      longitudeDelta: position?.longitudeDelta,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        region={region}
        provider={Platform.OS == 'ios' ? PROVIDER_DEFAULT :PROVIDER_GOOGLE} // remove if not using Google Maps
        showsUserLocation
        followsUserLocation
        loadingEnabled={true}
        style={StyleSheet.absoluteFill}
        // onRegionChange={onRegionChange}
      >
        {Object.keys(currentLocation)?.length > 0 ? (
          <Marker.Animated
            ref={markerRef}
            tracksViewChanges={false}
            coordinate={currentLocation}
            rotation={currentMarkerRotation.current || 0}
          >
            <Image
              resizeMode="contain"
              source={icons.carIcon}
              style={styles.currentMarkerStyle}
            />
          </Marker.Animated>
        ) : null}

        {completedWaypoints?.length > 0 ? (
          <Polyline
            zIndex={1}
            strokeWidth={5}
            strokeColor={colors.redDark}
            coordinates={completedWaypoints}
          />
        ) : null}

        {routePoints.current.length ? (
          <Polyline
            strokeWidth={4}
            strokeColor={colors.map_line}
            coordinates={routePoints.current}
          />
        ) : null}
        {Object.keys(origin).length ? (
          <Marker coordinate={origin}>
            <Image
              resizeMode="stretch"
              source={icons.origin}
              style={styles.markerImgStyle}
            />
          </Marker>
        ) : null}
        {Object.keys(destination)?.length ? (
          <Marker coordinate={destination}>
            <Image
              source={icons.dest}
              resizeMode="stretch"
              style={styles.markerImgStyle}
            />
          </Marker>
        ) : null}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  btnText: {
    ...commonFontStyle(600, 16, colors.white),
  },
  mapStyle: {
    flex: 1,
  },
  markerImgStyle: {
    height: 35,
    width: 35,
  },
  currentMarkerStyle: { height: 30, width: 30 },
});

export default NewMovement;
