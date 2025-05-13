import AsyncStorage from "@react-native-async-storage/async-storage";

export const asyncKeys = {
  // clear in logout time
  token: "@token",
  user_info: "@user_info",
  fcmToken: "@fcmToken",
  login_info: "@login_info",
  locationlogin_info: "@locationlogin_info",
  // not clear in logout time
  is_dark_theme: "@is_dark_theme",
  offlineLocations: "offlineLocations",
  offlineLocationsTime: "offlineLocationsTime",
  attendanceIds: "attendanceIds",
  locationData: "locationData",
};

export const clearAsync = async () => {
  await AsyncStorage.multiRemove([
    asyncKeys.token,
    asyncKeys.user_info,
    asyncKeys.login_info,
    asyncKeys.locationlogin_info,
  ]);
};

export const setAsyncToken = async (token: string) => {
  await AsyncStorage.setItem(asyncKeys.token, JSON.stringify(token));
};

export const getAsyncToken = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.token);
  if (token) {
    return "Bearer " + JSON.parse(token);
  } else {
    return null;
  }
};

export const setAsyncUserInfo = async (user: any) => {
  await AsyncStorage.setItem(asyncKeys.user_info, JSON.stringify(user));
};
export const setAsyncLoginInfo = async (user: any) => {
  await AsyncStorage.setItem(asyncKeys.login_info, JSON.stringify(user));
};
export const getAsyncLoginInfo = async () => {
  const userInfo = await AsyncStorage.getItem(asyncKeys.login_info);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
};

export const getAsyncUserInfo = async () => {
  const userInfo = await AsyncStorage.getItem(asyncKeys.user_info);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
};

export const setAsyncLocationLoginInfo = async (user: any) => {
  await AsyncStorage.setItem(
    asyncKeys.locationlogin_info,
    JSON.stringify(user)
  );
};
export const getAsyncLocationLoginInfo = async () => {
  const userInfo = await AsyncStorage.getItem(asyncKeys.locationlogin_info);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
};

//fcm

export const setAsyncFCMToken = async (token) => {
  await AsyncStorage.setItem(asyncKeys.fcmToken, JSON.stringify(token));
};

export const getAsyncFCMToken = async () => {
  const token = await AsyncStorage.getItem(asyncKeys.fcmToken);
  if (token) {
    return JSON.parse(token);
  } else {
    return null;
  }
};

export const setAsyncAttendanceIDs = async (value: any) => {
  await AsyncStorage.setItem(
    asyncKeys.attendanceIds,
    value ? JSON.stringify(value) : null
  );
};

export const removeAsyncAttendanceIDs = async () => {
  await AsyncStorage.removeItem(asyncKeys.attendanceIds); // ✅ ID remove from storage
};

export const getAsyncAttendanceIDs = async () => {
  const value = await AsyncStorage.getItem(asyncKeys.attendanceIds);
  if (value) {
    return JSON.parse(value);
  } else {
    return null;
  }
};

export const setAsyncLocation = async (value) => {
  await AsyncStorage.setItem(
    asyncKeys.locationData,
    value ? JSON.stringify(value) : null
  );
};

export const getAsyncLocation = async () => {
  const value = await AsyncStorage.getItem(asyncKeys.locationData);
  if (value) {
    return JSON.parse(value);
  } else {
    return null;
  }
};
