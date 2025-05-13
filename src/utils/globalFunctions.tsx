import Toast from "react-native-toast-message";
import { navigationRef } from "../navigation/mainNavigator";
import { CommonActions } from "@react-navigation/native";
import { GOOGLE_MAP_API_KEY } from "./apiConstants";
import { StyleSheet, Text, View } from "react-native";
import { SCREEN_WIDTH, hp, commonFontStyle } from "../theme/fonts";
import { colors } from "../theme/colors";
import moment from "moment";
import * as geolib from "geolib";
import polyline from "@mapbox/polyline";

type PointProps = {
  latitude: number | string;
  longitude: number | string;
};

export const infoToast = (message: string) => {
  Toast.show({ type: "info", text1: message });
};
export const errorToast = (message: string) => {
  Toast.show({ type: "error", text1: message });
};

export const otpToast = (message: string) => {
  Toast.show({ type: "otp_success", text1: message });
};

export const successToast = (message: string) => {
  Toast.show({ type: "success", text1: message });
};

export const dispatchNavigation = (name: string) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: name }],
    })
  );
};

export const getDistanceOneToOne = async (lat1, lng1, lat2, lng2) => {
  const Location1Str = lat1 + "," + lng1;
  const Location2Str = lat2 + "," + lng2;

  let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

  let params = `origins=${Location1Str}&destinations=${Location2Str}&key=${"AIzaSyDyT6Pn5yLqPB7YS_W5Lwjkt7FOGegTCgE"}`; // you need to get a key
  let finalApiURL = `${ApiURL}${encodeURI(params)}`;

  let fetchResult = await fetch(finalApiURL); // call API

  let Result = await fetchResult.json(); // extract json
  console.log("Result", Result);

  return Result.rows[0].elements[0].distance;
};

export const toastConfig = {
  success: ({ text1, text2, type, props, ...rest }: any) =>
    type === "success" && (
      <View style={toastConfigstyles.textStyleToastSuccess}>
        <Text style={toastConfigstyles.textStyleToast}>{text1}</Text>
      </View>
    ),
  error: ({ text1, text2, type, props, ...rest }: any) => {
    if (type === "error") {
      return (
        <View style={toastConfigstyles.toastStyle}>
          <Text style={toastConfigstyles.textStyleToast}>{text1}</Text>
        </View>
      );
    }
  },
};

export function objectToFormData(obj: any) {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

export const toastConfigstyles = StyleSheet.create({
  toastStyle: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 20,
    borderRadius: 5,
    borderLeftWidth: 6,
    borderLeftColor: "red",
    borderWidth: 1.5,
    borderColor: "red",
    width: SCREEN_WIDTH - hp(6),
  },
  textStyleToastSuccess: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 20,
    borderRadius: 5,
    borderLeftWidth: 6,
    borderLeftColor: "green",
    borderWidth: 1.5,
    borderColor: "green",
    width: SCREEN_WIDTH - hp(6),
  },
  textStyleToast: {
    // marginLeft: hp(2),
    ...commonFontStyle(700, 14, colors.black),
  },
});

export function humanize(str: string) {
  var i,
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
}

export const countAge = (date: string) => {
  var birthyear = moment(date, "YYYY");
  var visitdate = moment(new Date(), "DD-MM-YYYY");
  return visitdate.diff(birthyear, "y");
};

export const findingCurrentLocationOnRoute = (
  tempCurrentLocation: any,
  routeCoordinates: any
) => {
  const deviationThreshold = 20;

  // const routeFeature = turf.lineString(turfRoute);
  const nearestPointOnRoute = geolib.findNearest(
    tempCurrentLocation,
    routeCoordinates
  );

  // Calculate the distance between the user's location and the nearest point on the route
  const distanceToRoute = geolib.getDistance(
    tempCurrentLocation,
    nearestPointOnRoute
  );

  if (distanceToRoute <= deviationThreshold) {
    return nearestPointOnRoute;
  }
  return tempCurrentLocation;
};

// Function to remove duplicate objects based on lat and lng
export function removeDuplicates(arr, prop1, prop2) {
  return arr.filter((obj, index, self) => {
    return (
      index ===
      self.findIndex((o) => o[prop1] === obj[prop1] && o[prop2] === obj[prop2])
    );
  });
}

export const typeWiseScreenName = (type: string) => {
  switch (type) {
    case "agency_group":
      return "MyAgencyDrawer";
    case "authority_group":
      return "MyDrawer";
    case "pilot_group":
      return "MyDriverDrawer";
    default:
      return "";
  }
};

export function convertMinutesToHHMMSS(totalMinutes: any) {
  // Calculate hours, minutes, and seconds
  var hours = Math.floor(totalMinutes / 60);
  var remainingMinutes = Math.floor(totalMinutes % 60);
  var seconds = Math.round((totalMinutes % 1) * 60);

  // Helper function to add leading zeros
  function pad(number: any) {
    return (number < 10 ? "0" : "") + number;
  }

  // Format the result
  var result = pad(hours) + ":" + pad(remainingMinutes) + ":" + pad(seconds);

  return result;
}

export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
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

export function isLocationOnRoute(
  location: { latitude: number; longitude: number },
  routeCoordinates: any,
  thresholdDistance: number = 20
) {
  if (
    location &&
    location.latitude &&
    location.longitude &&
    Array.isArray(routeCoordinates)
  ) {
    for (const point of routeCoordinates) {
      const distance = haversine(
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

export function filterPlacesAlongRoute(
  routePath: any,
  data: any,
  tolerance: number = 0.1
) {
  return data.filter((place: any) => {
    // Convert place coordinates to Turf.js coordinate order
    const placeLocation = {
      latitude: place["latitude"],
      longitude: place["longitude"],
    };
    // Check if the place is on or near the route path
    return isLocationOnRoute(placeLocation, routePath, tolerance);
  });
}

export function isDeviationGreaterThanThreshold(
  point: PointProps,
  route: Array<PointProps>,
  threshold: number
) {
  if (point?.latitude && point?.longitude && Array.isArray(route)) {
    const nearestPointOnRoute = geolib.findNearest(point, route);
    const distanceToRoute = geolib.getDistance(point, nearestPointOnRoute);
    return distanceToRoute > threshold;
  }
  return false;
}

export function parseRouteCoordinates(data: any) {
  const route = data?.routes?.[0];
  if (route?.overview_polyline) {
    const { overview_polyline } = route;
    let coordinates = polyline
      .decode(overview_polyline?.points)
      .map((point: any) => ({
        latitude: point?.[0],
        longitude: point?.[1],
      }));
    return coordinates;
  }
}

export const calculateDistance = (data: any) => {
  const legs = data?.routes?.[0]?.legs;
  const initialValue = 0;
  const sumWithInitial = legs.reduce(
    (prevValue: any, currentValue: any) =>
      prevValue + currentValue?.distance?.value,
    initialValue
  );
  return sumWithInitial || 0;
};

export const calculateDuration = (data: any) => {
  const legs = data?.routes?.[0]?.legs;
  const initialValue = 0;
  const sumWithInitial = legs.reduce(
    (prevValue: any, currentValue: any) =>
      prevValue + currentValue?.duration?.value,
    initialValue
  );
  return sumWithInitial || 0;
};

export const hasDeviatedFromRoute = (
  userLocation: { latitude: number; longitude: number },
  routeCoordinates: any
) => {
  // Convert user location and route coordinates to Turf.js Points and LineString
  if (
    userLocation &&
    userLocation.latitude &&
    userLocation.longitude &&
    Array.isArray(routeCoordinates)
  ) {
    const deviationThreshold = 80;
    const turfUserLocation = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };
    // const turfRoute = routeCoordinates?.map((coord) => {
    //   return { latitude: coord.lat, longitude: coord.lng };
    // });
    // const routeFeature = turf.lineString(turfRoute);
    const nearestPointOnRoute = geolib.findNearest(
      turfUserLocation,
      routeCoordinates
    );

    // Calculate the distance between the user's location and the nearest point on the route
    const distanceToRoute = geolib.getDistance(
      turfUserLocation,
      nearestPointOnRoute
    );

    // Check if the distance exceeds the deviation threshold
    return distanceToRoute < deviationThreshold;
  }
  return true;
};

export const Severity_Types = [
  { label: "Moderate", value: "moderate" },
  { label: "Critical", value: "critical" },
];

export function reduceArrayToLength(array: any, targetLength: number) {
  const tempreducedArray = [];

  if (array.length <= targetLength) {
    for (let i = 0; i < targetLength; i++) {
      const index = i;
      tempreducedArray.push({
        location: {
          lat: array?.[index]?.lat,
          lng: array?.[index]?.lng,
        },
        stopover: false,
      });
    }
    return tempreducedArray; // No reduction needed
  }

  const stepSize = Math.floor(array.length / targetLength);

  for (let i = 0; i < targetLength; i++) {
    const index = i * stepSize;
    tempreducedArray.push({
      location: {
        lat: array?.[index]?.lat,
        lng: array?.[index]?.lng,
      },
      stopover: false,
    });
  }

  return tempreducedArray;
}

export function convertToTurfCoordinate(point: any) {
  return [point.lng(), point.lat()];
}
// Function to get the route bounds
export function getRouteBounds(results: any) {
  const route = results.routes[0].overview_path;
  // Convert LatLng objects to Turf.js coordinate order
  return route.map(convertToTurfCoordinate);
}

// Function to reduce the number of coordinates
export const reduceCoordinates = (coordinates: any, targetLength: number) => {
  const step = Math.ceil(coordinates.length / targetLength);
  const reducedCoordinates = [];

  for (let i = 0; i < coordinates.length; i += step) {
    reducedCoordinates.push(coordinates[i]);
  }

  return reducedCoordinates;
};

export const calculateTotalDistance = (completedPath: any) => {
  let totalDistance = 0;
  for (let i = 0; i < completedPath.length - 1; i++) {
    const startCoord = completedPath[i];
    const endCoord = completedPath[i + 1];
    // Calculate distance between consecutive points
    const distance = geolib.getDistance(startCoord, endCoord);
    // Add the distance to the total
    totalDistance += distance;
  }
  return totalDistance;
};

export const getDistanceByMeter = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Distance in meters
  return distance;
};

// Function to convert degrees to radians
export function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

// Haversine formula to calculate distance in kilometers between two latitude/longitude points
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in km
  return distance * 1000; // Convert to meters
}

// Function to calculate speed from a JSON object with timestamps and coordinates
export function calculateSpeeds(locationData: any) {
  const keys = Object.keys(locationData); // Get all the timestamps
  const speeds = []; // Array to hold speed results

  for (let i = 1; i < keys.length; i++) {
    const time1 = new Date(keys[i - 1]).getTime(); // Convert ISO 8601 to timestamp
    const time2 = new Date(keys[i]).getTime();

    const coords1 = locationData[keys[i - 1]][0];
    const coords2 = locationData[keys[i]][0];

    const timeDifference = (time2 - time1) / 1000; // Time difference in seconds
    const distance = haversineDistance(
      coords1.lat,
      coords1.lng,
      coords2.lat,
      coords2.lng
    ); // Distance in meters

    const speed = distance / timeDifference; // Speed in m/s

    speeds.push(speed); // Add calculated speed to the array
  }

  return (speeds[speeds?.length - 1] || 0).toFixed(0); // Return all calculated speeds
}

// Function to find locations within a 10-meter radius
export const findNearbyLocations = (currentLocation: any, locations: any[]) => {
  const threshold = 0.1; // 10 meters in kilometers
  const nearbyLocations = locations.filter((location) => {
    const distance = haversineDistance(
      currentLocation?.latitude,
      currentLocation?.longitude,
      location?.latitude,
      location?.longitude
    );
    return distance <= threshold;
  });

  return nearbyLocations;
};

export const haversineDistanceInMeter = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371e3; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // Distance in meters
};

export const findNearest = (data: any[], referencePoint: any) => {
  let nearestItem = null;
  let shortestDistance = Infinity;

  data.forEach((item) => {
    const distance = haversineDistance(
      referencePoint.latitude,
      referencePoint.longitude,
      item.latitude,
      item.longitude
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestItem = item;
    }
  });

  return nearestItem;
};
