import { Image, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { AppStyles } from "../theme/appStyles";
import { hp } from "../theme/fonts";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAgenciesAction, getVehicleAction } from "../action/commonAction";
import { requestLocationPermission } from "../utils/loactionHandler";
import { icons } from "../utils/Icon";
import { LATITUDE_DELTA, LONGITUDE_DELTA } from "../utils/commonFunction";

type Props = {};

const MapMovement = (props: Props) => {
  const { getPilotData, getVehicleData, getAgenciesData } = useAppSelector(
    (state) => state.common
  );
  const dispatch = useAppDispatch();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });
  useEffect(() => {
    const obj = {
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAgenciesAction(obj));
  }, []);

  const onCurrentLocation = async () => {
    // setLoader(true);
    await requestLocationPermission(
      (position) => {
        const data = {
          latitude: position.latitude,
          longitude: position.longitude,
        };
        setCurrentLocation(data);
      },
      (error) => {
        // setLoader(false);
      }
    );
  };

  useEffect(() => {
    onCurrentLocation();
  }, []);

  return (
    <View style={AppStyles.flex}>
      <MapView
        zoomControlEnabled
        provider={Platform.OS == 'ios' ? PROVIDER_DEFAULT :PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {/*{getAgenciesData?.map((item) => {*/}
        {/*  return <Marker*/}
        {/*    coordinate={{*/}
        {/*      latitude: Number(item?.location_lat),*/}
        {/*      longitude: Number(item?.location_lng),*/}
        {/*    }}>*/}
        {/*    <View style={{}}>*/}
        {/*      <Image*/}
        {/*        source={icons?.startPin}*/}
        {/*        style={{ height: 35, width: 35 }}*/}
        {/*        resizeMode="stretch"*/}
        {/*      />*/}
        {/*    </View>*/}
        {/*  </Marker>*/}
        {/*})}*/}
      </MapView>
    </View>
  );
};

export default MapMovement;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    marginBottom: hp(2),
  },
});
