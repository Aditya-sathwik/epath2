// import { useEffect, useRef, useState } from 'react';
// import { AppState, NativeEventEmitter, NativeModules, Platform } from 'react-native';
// import BackgroundTimer from 'react-native-background-timer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNetInfo } from './NetInfoProvider';
// import { GET_CURRENT_LOCATION } from '../redux/actionTypes';
// import { asyncKeys, getAsyncAttendanceIDs, getAsyncLocation, removeAsyncAttendanceIDs } from '../utils/asyncStorage';
// import { api } from '../utils/apiConstants';
// const { LocationModule } = NativeModules;

// const locationEmitter = Platform.OS == 'android' && new NativeEventEmitter(LocationModule);

// const useWebSocket = () => {
//     const dispatch = useDispatch();
//     const ws = useRef(null);
//     const isRunning = useRef(false);
//     const isRunningClose = useRef(false);
//     const isConnected = useNetInfo(); // Get network status
//     const [loginFirstTime, setLoginFirstTime] = useState(false)
//     const isRunningFun = useRef(false);
//     const { getCurrentLocation } = useSelector((state) => state.movement);

//     const socketRef = { current: null as WebSocket | null };

//     const setSocket = (socket: WebSocket) => {
//     socketRef.current = socket;
//     };

//     const getSocket = () => socketRef.current;

//     let subscription;
//     const netInfoCheck = async () => {
//         const storedId = await getAsyncAttendanceIDs()
//         if (storedId) {
//             if (isConnected && !ws?.current && Platform.OS == 'android') {
//                 if (true) {
//                     console.log('netInfoCheck ✅');
//                     setupWebSocket();
//                     LocationModule.startListening();
//                     NativeModules.LocationModule.startLocation();
//                     everyTimeGetLocation()

//                 }
//             }
//         }
//     }

//     useEffect(() => {
//         if ( Platform.OS == 'android' && !isRunning.current) {
//             netInfoCheck()
//         }
//     }, [isConnected, ws?.current, ws?.current?.readyState]);

//     // ✅ WebSocket setup kare
//     const setupWebSocket = async () => {
//         if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//             console.log('WebSocket already connected');
//             return;
//         }
//         ws.current = new WebSocket(api.SOCKET_ENDPOINT);

//         ws.current.onopen = () => {
//             console.log('✅ WebSocket Connected');
//             // successToast("WebSocket Connected")
//             console.log('loginFirstTime', loginFirstTime);
//             // dispatch({ type: GET_VEHICLE_LIST, payload: true });
//             isRunning.current = true;
//             isRunningClose.current = false
//             sendOfflineStoredLocations(); // Online aate hi send kare
//             // sendLocationFirstTime()
//         };

//         ws.current.onmessage = (event) => {
//             let newValue = JSON.parse(event.data)?.websocket_close
//             console.log('📩 Message from server:', newValue);

//             if (newValue) {
//                 isRunningFun.current = false
//                 // dispatch({ type: GET_VEHICLE_LIST, payload: false });
//                 isRunning.current = false;
//                 ws?.current?.close();
//                 if (subscription) {
//                     subscription.remove();
//                     subscription = null;
//                 }
//                 // removeAsyncAttendanceIDs();
//                 LocationModule.stopListening()
//                 BackgroundTimer.stopBackgroundTimer();
//                 NativeModules.LocationModule.stopLocation();
//             }

//         };

//         ws.current.onerror = async (error) => {
//             console.error('❌ WebSocket Error:', error);
//             isRunningFun.current = true
//         };

//         ws.current.onclose = async () => {
//             // errorToast("WebSocket Closed")

//             isRunning.current = false;
//             const getLocationID = ""
//             // const getLocationID = await getAsyncAttendanceIDs()
//             console.log('🔌 WebSocket Closed');
//             if (getLocationID) {
//                 // ws.current.close();
//                 setTimeout(() => {
//                     setLoginFirstTime(false)
//                     setupWebSocket();
//                 }, 1000);
//             }

//         };
//     };

//     const everyTimeGetLocation = () => {
//         if (!subscription) {
//             subscription = locationEmitter.addListener("LocationUpdate", async (location) => {
//                 console.log('✅ Location fetch ', location?.latitude, location?.longitude);
//                 const getLocationID = ""

//                 // const getLocationID = await getAsyncAttendanceIDs()
//                 if (getLocationID && isRunningClose.current) {
//                     ws.current.close();
//                     setTimeout(() => {
//                         setupWebSocket();
//                     }, 1000);
//                 }
//                 dispatch({
//                     type: GET_CURRENT_LOCATION,
//                     payload: {
//                         latitude: location.latitude,
//                         longitude: location.longitude,
//                     },
//                 });
//                 // setAsyncLocation({
//                 //     latitude: location.latitude,
//                 //     longitude: location.longitude,
//                 // })
//             });
//         }
//     }

//     // ✅ Har 3 second me WebSocket call kare
//     const startWebSocketCalls = () => {
//         console.log('✅ Har 3 second me');
//         everyTimeGetLocation()
//         BackgroundTimer.runBackgroundTimer(() => {
//             console.log('✅ Har 3 second me WebSocket call kare');
//             isRunningFun.current = true
//             fetchAndSendLocation();
//         }, 120000); //300000
//     };

//     // ✅ Location fetch kare aur WebSocket se send kare
//     const fetchAndSendLocation = async () => {
//         try {
//             const getLocationID = await getAsyncAttendanceIDs()
//             const getLocationData = await getAsyncLocation()
//             console.log(" ✅ Location fetch getLocationID", getLocationID, getLocationData, ws?.current?.readyState);

//             if (!getLocationID) {
//                 console.log('⚠️ No ID found, skipping WebSocket call');
//                 BackgroundTimer.stopBackgroundTimer();
//                 return;
//             }

//             let obj = { lat: getLocationData?.latitude?.toString() || getCurrentLocation?.latitude?.toString(), lng: getLocationData?.longitude?.toString() || getCurrentLocation?.longitude?.toString(), timestamp: new Date().toISOString() };
//             if (ws.current && ws.current.readyState === WebSocket.OPEN && isConnected) {
//                 console.log('Location fetch obj', obj);
//                 let data = {
//                     type: "POST",
//                     attendance_id: getLocationID?.toString(),
//                     current_lat: getLocationData?.latitude?.toString() || getCurrentLocation?.latitude?.toString(),
//                     current_lng: getLocationData?.longitude?.toString() || getCurrentLocation?.longitude?.toString(),
//                     current_location_timestamp: new Date().toISOString(),
//                     location_sharing_status: "active",
//                     actual_poly_coordinatess_timestamp: JSON.stringify(obj),
//                 };
//                 // successToast(`send Data Sent:`)
//                 ws.current.send(JSON.stringify(data));
//                 console.log("📤 Data Sent:", JSON.stringify(data));

//             } else {
//                 console.log("⚠️ No WebSocket connection, storing offline...");
//                 storeOfflineLocation(obj);
//                 if (ws.current && ws.current.readyState !== WebSocket.OPEN) {
//                     setupWebSocket();
//                 }

//             }
//         } catch (error) {
//             console.error("❌ Error fetching location:", error);
//         }
//     };

//     // ✅ Offline locations ko store kare
//     const storeOfflineLocation = async (obj) => {
//         try {
//             let offlineData = await AsyncStorage.getItem(asyncKeys.offlineLocations);
//             let locations = offlineData ? JSON.parse(offlineData) : [];
//             locations.push(obj);
//             await AsyncStorage.setItem(asyncKeys.offlineLocations, JSON.stringify(locations));
//             console.log("📦 Location stored offline:", obj);
//         } catch (error) {
//             console.error("❌ Error storing offline location:", error);
//         }
//     };

//     // ✅ WebSocket band kare
//     const closeWebSocket = () => {
//         if ( Platform.OS == 'android') {
//             if (subscription) {
//                 subscription.remove();
//                 subscription = null;
//             }
//             isRunningFun.current = false
//             LocationModule.stopListening()
//             setLoginFirstTime(false)
//             NativeModules.LocationModule.stopLocation();
//             // Stop Background Timer after 10 seconds
//             BackgroundTimer.stopBackgroundTimer();
//             removeAsyncAttendanceIDs();
//             if (ws.current) {
//                 console.log('🔌 Closing WebSocket...');
//                 ws.current.close();
//                 ws.current = null;
//                 isRunning.current = false;
//             }
//         }

//     };

//     // ✅ App foreground/background change par WebSocket handle kare
//     // const handleAppStateChange = async (nextAppState) => {
//     //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
//     //         console.log('🟢 App is in Foreground');
//     //         if (Platform.OS == 'android') {
//     //             const storedId = await getAsyncAttendanceIDs()
//     //             if (storedId && !isRunning.current) {
//     //                 ws.current.close();
//     //                 setTimeout(() => {
//     //                     setupWebSocket();
//     //                 }, 1000);
//     //                 // fetchAndSendLocation();
//     //             }
//     //         }

//     //     }
//     //     setAppState(nextAppState);
//     // };

//     // ✅ Button click hone par WebSocket manually start kare
//     const startManualWebSocket = async () => {
//         const storedId = await getAsyncAttendanceIDs()
//         console.log('Manual start, ID:', storedId);
//         if (storedId) {
//             startWebSocketCalls();
//             sendLocationFirstTime()
//         } else {
//             console.log("⚠️ No ID found or WebSocket already running.");
//         }
//     };

//     // ✅ Offline stored locations ko bheje jab internet aaye
//     const sendOfflineStoredLocations = async () => {
//         try {
//             let offlineData = await AsyncStorage.getItem(asyncKeys.offlineLocations);
//             const storedId = await getAsyncAttendanceIDs()

//             console.log('offlineDataofflineDataofflineDataofflineData', offlineData);

//             let locations = offlineData ? JSON.parse(offlineData) : [];

//             if (locations.length > 0 && ws.current && ws.current.readyState === WebSocket.OPEN) {
//                 let data = {
//                     type: "POST",
//                     attendance_id: storedId?.toString(),
//                     current_lat: locations[locations?.length - 1]?.lat,
//                     current_lng: locations[locations?.length - 1]?.lng,
//                     current_location_timestamp: new Date().toISOString(),
//                     location_sharing_status: "active",
//                     actual_poly_coordinatess_timestamp: JSON.stringify(locations),
//                 };

//                 ws.current.send(JSON.stringify(data));
//                 console.log("📤 Sent offline location:", JSON.stringify(data));
//                 await AsyncStorage.removeItem(asyncKeys.offlineLocations); // Data successfully send hone ke baad clear kare
//             }
//         } catch (error) {
//             console.error("❌ Error sending offline locations:", error);
//         }
//     };

//     const sendLocationFirstTime = async () => {
//         try {
//             const storedId = await getAsyncAttendanceIDs()
//             console.log('Location fetch', storedId);

//             if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//                 let obj = { lat: getCurrentLocation?.latitude?.toString(), lng: getCurrentLocation?.longitude?.toString(), timestamp: new Date().toISOString() };
//                 console.log('Location fetch obj', obj);

//                 let data = {
//                     type: "POST",
//                     attendance_id: storedId?.toString(),
//                     current_lat: getCurrentLocation?.latitude?.toString(),
//                     current_lng: getCurrentLocation?.longitude?.toString(),
//                     current_location_timestamp: new Date().toISOString(),
//                     location_sharing_status: "active",
//                     actual_poly_coordinatess_timestamp: JSON.stringify(obj),
//                 };

//                 ws.current.send(JSON.stringify(data));
//                 console.log("📤 Location fetch Sent location:", JSON.stringify(data));
//             }
//         } catch (error) {
//             console.log('Location fetchLocation fetch errro', error);
//         }
//     };

//     return { reconnect: setupWebSocket, close: closeWebSocket, startManualWebSocket, setLoginFirstTime };
// };

// export default useWebSocket;
