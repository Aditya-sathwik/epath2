import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Linking,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import messaging from "@react-native-firebase/messaging";

import {
  infoToast,
  dispatchNavigation,
  typeWiseScreenName,
} from "../utils/globalFunctions";
import { icons } from "../utils/Icon";
import { colors } from "../theme/colors";
import { AppStyles } from "../theme/appStyles";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import CommonInput from "../compoment/CommonInput";
import { asyncKeys, getAsyncFCMToken, setAsyncFCMToken, setAsyncLoginInfo } from "../utils/asyncStorage";
import { hp, commonFontStyle, SCREEN_HEIGHT, wp } from "../theme/fonts";
import {
  getGroupName,
  getUserDetails,
  setDarkTheme,
} from "../action/commonAction";
import {
  onLocationLoginAction,
  onLoginAction,
} from "../action/authAction";
import Loader from "../compoment/Loader";
import { TermsAndConditions } from "../utils/apiConstants";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const LoginScreen = (props: Props) => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkTheme } = useAppSelector((state) => state.common);

  // const [userName, setuserName] = useState(__DEV__ ?  "Authority_dev" :"");
  // const [password, setpassword] = useState(__DEV__ ?  "Dev@2024" :"");
  // const [userName, setuserName] = useState(__DEV__ ?  "Test_Pilot" :"");
  // const [password, setpassword] = useState(__DEV__ ?  "123456" :"");
  // const [userName, setuserName] = useState(__DEV__ ?  "Test_Agency4" :"");
  // const [password, setpassword] = useState(__DEV__ ?  "123456" :"");
  // const [userName, setuserName] = useState("Authority_prod");
  // const [password, setpassword] = useState("r6#+)1T2=W$f");
    const [userName, setuserName] = useState(__DEV__ ?  "Ganesh" :"");
  const [password, setpassword] = useState(__DEV__ ?  "123456" :"");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [deviceToken, setDeviceToken] = useState<string>("");

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  const disableLogin = useMemo(() => {
    return userName?.length && password?.length ? false : true;
  }, [userName, password]);

  useEffect(() => {
    if(isFocused){
      messaging().setAutoInitEnabled(true);
      requestNotificationUserPermission();
      getTheme();
    }
  }, [isFocused,isDarkTheme,]);


  const getTheme = async () => {
    let value: any = await AsyncStorage.getItem(asyncKeys.is_dark_theme);
    if (JSON.parse(value) === true) {
      dispatch(setDarkTheme(true));
    } else {
      dispatch(setDarkTheme(false));
    }
  };

  async function requestNotificationUserPermission() {
    setIsLoading(true)
    if (Platform.OS === "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      if (authStatus === 1) {
        if (Platform.OS === "ios") {
          await messaging()
            .registerDeviceForRemoteMessages()
            .then(async () => {
              getFirebaseToken();
            })
            .catch(() => {
              getFirebaseToken();
            });
        } else {
          getFirebaseToken();
        }
      } else {
        await messaging().requestPermission();
        setIsLoading(false)
      }
    } else {
      await messaging().requestPermission();
      setIsLoading(false)
      infoToast("Please allow to notifications permission");
    }
  }

  const getFirebaseToken = async () => {
    await messaging()
      .getToken()
      .then((fcmToken: any) => {
        if (fcmToken) {
          console.log("---fcmToken---:", fcmToken);
          // infoToast(fcmToken.toString());
          setDeviceToken(fcmToken);
          setAsyncFCMToken(fcmToken);
          setIsLoading(false)
        } else {
          setIsLoading(false)
          infoToast("[FCMService] User does not have a device token");
        }
      })
      .catch((error: any) => {
        let err = `FCm token get error${error}`;
        // infoToast(error.toString());
        setIsLoading(false)
        console.log(err);
      });
  };

  const onPressLogin = () => {
    let deviceId = DeviceInfo.getDeviceId();

    if (userName.trim().length === 0) {
      infoToast("Please enter your userName");
    } else if (password.trim().length === 0) {
      infoToast("Please enter your password");
    } else if (!isCheck) {
      infoToast("Please accept to Privacy policy and Terms.");
    } else {
      setIsLoading(true);
      const obj = {
        data: {
          username: userName,
          password: password,
        },
        onSuccess: (res: any) => {
          const obj = {
            onSuccess: async (groups: any) => {
              const groupIDArray = groups;
              await groupIDArray.forEach((groupID: any) => {
                const obj = {
                  group_id: groupID,
                  onSuccess:(response: any) => {
                    if (response?.group_name) {
                      let group_name = response?.group_name;

                      const obj = {
                        data: {
                          username: userName,
                          group: group_name,
                        },
                        token: res.access,
                        onSuccess:async () => {
                          setIsLoading(false);
                          let value=typeWiseScreenName(group_name)
                          if(value){                            
                            setAsyncLoginInfo({
                              screenName: value,
                              group: group_name,
                            });
                            dispatchNavigation(
                              value
                            );
                          }
                          setpassword("");
                          setuserName("");


                        
                        },
                        onFailure: () => {
                          setIsLoading(false);
                        },
                      };
                      dispatch(onLocationLoginAction(obj));
                    }
                  },
                  onFailure: () => {
                    setIsLoading(false);
                  },
                };
                dispatch(getGroupName(obj));
              });
            },
            onFailure: () => {
              setIsLoading(false);
            },
          };
          dispatch(getUserDetails(obj));
        },
        onFailure: () => {
          setIsLoading(false);
        },
      };
      dispatch(onLoginAction(obj));
    }
  };

  const onPressPolicy = () => {
    navigate("PrivacyPolicy");
  };

  const onPressTerms = () => {
    Linking.openURL(TermsAndConditions);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="always"
    >
      <Loader visible={isLoading} />
      <Image source={icons.bpolicelogo} style={styles.logoMain} />
      <Image source={icons.epath} style={styles.logo} />
       {/* <Text>{deviceToken}</Text> */}
      <View style={styles.formView}>
        <CommonInput
          value={userName}
          title={"User name"}
          placeHolder={"User name"}
          onChangeText={(text) => setuserName(text)}
        />
        <CommonInput
          title={"Password"}
          value={password}
          onChangeText={(text) => setpassword(text.trim())}
          placeHolder={"Password"}
          secureTextEntry={secureTextEntry}
          rightSideView={()=>{
            return <TouchableOpacity onPress={()=>{
              setSecureTextEntry(!secureTextEntry)
            }}>
              <Image source={secureTextEntry ?icons.eye_out : icons.eye_in} style={styles.iconStyle}/>
            </TouchableOpacity>
          }}
        />
        {/* <TouchableOpacity>
          <Text style={styles.forgetText}>Forgot Password ?</Text>
        </TouchableOpacity> */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            onPress={() => setIsCheck(!isCheck)}
            style={styles.checkBoxContainer}
          >
            {isCheck ? (
              <Image
                resizeMode="contain"
                source={icons.check}
                style={styles.checkStyle}
              />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.textStyle}>
            Accept all{" "}
            <Text onPress={onPressPolicy} style={styles.blackText}>
              Privacy policy
            </Text>{" "}
            &{" "}
            <Text onPress={onPressPolicy} style={styles.blackText}>
              Terms & conditions
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          disabled={disableLogin}
          onPress={() => onPressLogin()}
          style={disableLogin ? styles.disabledLoginBtn : styles.loginBtn}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{ marginTop: SCREEN_HEIGHT * 0.1 }}>
        <Text style={styles.powText}>Powered by</Text>
        <Image source={icons.arcadis_logo_black} style={styles.powImage} />
      </View> */}
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    logo: {
      height: 76,
      resizeMode: "contain",
      alignSelf: "center",
      marginBottom: 10,
      bottom: hp(1),
      tintColor: colors.black,
    },
    logoMain: {
      height: 97,
      width: 97,
      resizeMode: "contain",
      alignSelf: "center",
      marginTop: Platform.OS == "ios" ? hp(6) : hp(4),
      marginBottom: 5,
    },
    tabElement: {
      backgroundColor: colors.graye6,
      flex: 1,
      alignItems: "center",
      borderRadius: 3,
    },
    tabs: {
      flexDirection: "row",
      marginHorizontal: hp(3),
    },
    tabText: {
      ...commonFontStyle(700, 12, colors.black1e),
      paddingVertical: 10,
    },
    formView: {
      marginHorizontal: hp(3),
      marginTop: hp(4),
      flex: 1,
    },
    forgetText: {
      ...commonFontStyle(400, 12, colors.gray79),
      alignSelf: "flex-end",
      marginRight: 10,
    },
    registerText: {
      ...commonFontStyle(400, 12, colors.gray79),
      alignSelf: "center",
      top: 40,
    },
    loginBtn: {
      alignSelf: "center",
      backgroundColor: colors.main3f,
      width: "45%",
      alignItems: "center",
      borderRadius: 3,
      paddingVertical: 10,
      marginTop: hp(4),
    },
    disabledLoginBtn: {
      alignSelf: "center",
      backgroundColor: colors.gray79,
      width: "45%",
      alignItems: "center",
      borderRadius: 3,
      paddingVertical: 10,
      marginTop: hp(4),
    },
    btnText: {
      ...commonFontStyle(700, 12, colors.white),
    },
    powImage: {
      resizeMode: "contain",
      height: hp(4.5),
      alignSelf: "center",
    },
    powText: {
      ...commonFontStyle(500, 14, colors.black),
      alignSelf: "center",
      marginTop: hp(10),
    },
    termsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp(2),
    },
    checkBoxContainer: {
      height: 18,
      width: 18,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.black,
      justifyContent: "center",
      alignItems: "center",
    },
    textStyle: {
      marginLeft: wp(2),
      ...commonFontStyle(500, 13, colors.gray5d),
    },
    blackText: {
      ...commonFontStyle(500, 13, colors.black),
    },
    checkStyle: {
      height: 10,
      width: 10,
      tintColor: colors.main3f,
    },
    iconStyle: {
      height: 20,
      width: 20,
      tintColor: colors.black,
      marginRight: 10,
    },
  });
};
