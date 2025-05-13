//import liraries
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ReactNativeModal from "react-native-modal";
import { hp, wp, commonFontStyle, SCREEN_HEIGHT } from "../theme/fonts";
import { colors } from "../theme/colors";
import { useNavigation, useTheme } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CommonInput from "./CommonInput";
import { AppStyles } from "../theme/appStyles";
import { useAppDispatch } from "../redux/hooks";
import { createMovementAction } from "../action/movementAction";
import { addAgenciesAction, onUserProfileAction } from "../action/commonAction";
import { getAsyncLocationLoginInfo } from "../utils/asyncStorage";
import Toast from "react-native-toast-message";
import {
  errorToast,
  infoToast,
  objectToFormData,
  toastConfig,
} from "../utils/globalFunctions";
import ImageCropPicker from "react-native-image-crop-picker";
import moment from "moment";
import { emailCheck } from "../utils/validation";
import ToastMessage from "./ToastMessage";

type Props = {
  onPressCancel?: () => void;
  isVisible: boolean;
};

const AddAgencyModal = ({ isVisible, onPressCancel }: Props) => {
  const [agencyData, setAgencyData] = useState({
    agencyName: "",
    representName: "",
    email: "",
    country: "IN",
    countryCode: 91,
    phoneNumber: "",
    address: "",
    username: "",
    password: "",
    logo: {},
  });
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });
  const dispatch = useAppDispatch();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onClosePress=()=>{
    if(onPressCancel){
      onPressCancel()
      setAgencyData({
       agencyName: "",
       representName: "",
       email: "",
       country: "IN",
       countryCode: 91,
       phoneNumber: "",
       address: "",
       username: "",
       password: "",
       logo: {},
     });
    }
  }

  const onAddPress = async () => {
    if (agencyData?.agencyName.trim()?.length === 0) {
      infoToast("Please enter a agency name");
    }else if (agencyData?.username.trim()?.length === 0) {
      infoToast("Please enter a user name");
    } else if (agencyData?.password.trim()?.length === 0) {
      infoToast("Please enter a password ");
    } else if (agencyData?.representName.trim()?.length === 0) {
      infoToast("Please enter a represent name");
    } else if (!emailCheck(agencyData?.email)) {
      infoToast("Please enter a email address");
    } else if (agencyData?.phoneNumber.trim()?.length === 0) {
      infoToast("Please enter a phone number");
    } else if (agencyData?.address.trim()?.length === 0) {
      infoToast("Please enter a address");
    } else if (Object.keys(agencyData.logo)?.length === 0) {
      infoToast("Please select a logo");
    } else {
      let isGuest = await getAsyncLocationLoginInfo();

      let data = {
        address: agencyData?.address,
        authority_id: (isGuest?.ids?.authority_id).toString(),
        email: agencyData?.email,
        logos: agencyData.logo,
        name: agencyData?.agencyName,
        password: agencyData?.password,
        phone_number: `91${agencyData?.phoneNumber}`,
        representative_name: agencyData?.representName,
        username: agencyData?.username,
        client: 1,
        product: 1,
        mapcity: [],
        name: agencyData?.username,
        contactnumber: `${agencyData?.phoneNumber}`,
        firstname: agencyData?.username,
        lastname: agencyData?.username,
        email: agencyData?.email,
        role: "USER",
      };

      const obj = {
        data: objectToFormData(data),
        onSuccess: (res) => {
          // const obj1 = {
          //   data: {
          //     client: [34],
          //     product: [34],
          //     mapcity: [],
          //     name: agencyData?.username,
          //     contactnumber: `${agencyData?.phoneNumber}`,
          //     firstname: agencyData?.username,
          //     lastname: agencyData?.username,
          //     email: agencyData?.email,
          //     role: "USER",
          //   },
          //   token: res?.access,
          //   onSuccess: () => {
          //     infoToast("Profile added successfully");
          //   },
          //   onFailure: () => {
          //     infoToast("Error adding profile ");
          //   },
          // };
          // dispatch(onUserProfileAction(obj1));
          onPressCancel();
          setAgencyData({
            agencyName: "",
            representName: "",
            email: "",
            country: "IN",
            countryCode: 91,
            phoneNumber: "",
            address: "",
            username: "",
            password: "",
            logo: "",
          });
        },
        onFailure: (error) => {
        },
      };
      dispatch(addAgenciesAction(obj));
    }
  };

  const openImage = () => {
    ImageCropPicker.openPicker({
      mediaType: "photo",
    }).then((image) => {
      console.log(image);
      setAgencyData({
        ...agencyData,
        logo: {
          uri: image?.path,
          type: image?.mime,
          name: "image_" + moment().unix() + "_" + image.path.split("/").pop(),
        },
      });
    });
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      statusBarTranslucent
      style={{ height: 300, borderRadius: 25 }}
    >
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{
            borderRadius: 25,
            marginBottom: isKeyboardVisible ? 150 : 0,
          }}
        >
          <View
            style={[, { borderRadius: 25, flex: 1, paddingHorizontal: hp(2) }]}
          >
            <Text style={styles.headerText}>Add Agency</Text>
            <CommonInput
              title={"Agency Name"}
              value={agencyData.agencyName}
              onChangeText={(text) =>
                setAgencyData({ ...agencyData, agencyName: text })
              }
              placeHolder={"Enter Agency Name"}
              isInfoView={true}
            />
             <CommonInput
              title={"Username"}
              value={agencyData.username}
              onChangeText={(text) =>
                setAgencyData({ ...agencyData, username: text })
              }
              placeHolder={"Enter a User name"}
            />
            <CommonInput
              title={"Password"}
              value={agencyData.password}
              onChangeText={(text) =>
                setAgencyData({ ...agencyData, password: text })
              }
              placeHolder={"Enter password"}
              secureTextEntry={true}
            />
            <CommonInput
              title={"Representative Name"}
              value={agencyData.representName}
              onChangeText={(text) =>
                setAgencyData({ ...agencyData, representName: text })
              }
              placeHolder={"Enter Representative Name"}
              // secureTextEntry={true}
            />
            <CommonInput
              title={"Email"}
              value={agencyData.email}
              onChangeText={(text) =>
                setAgencyData({ ...agencyData, email: text })
              }
              placeHolder={"Enter email address"}
            />

            <CommonInput
              title={"Phone number"}
              value={agencyData.phoneNumber}
              onChangeText={(text) =>
                setAgencyData({ ...agencyData, phoneNumber: text })
              }
              placeHolder={"Enter Phone number"}
              type={"phone"}
              isInfoView={true}
              country={agencyData.country}
              setCountry={(text) => {
                console.log("code", Number(text?.callingCode));

                setAgencyData({
                  ...agencyData,
                  country: text?.cca2,
                  countryCode: Number(text?.callingCode),
                });
              }}
            />
            <CommonInput
              title={"Address"}
              value={agencyData.address}
              onChangeText={(text) =>
                setAgencyData({ ...agencyData, address: text })
              }
              placeHolder={"Address"}
              isInfoView={true}
              multiline={true}
            />
        

            <View style={{ alignSelf: "flex-start" }}>
              <TouchableOpacity
                onPress={() => openImage()}
                style={styles.iconView}
              >
                {Object.keys(agencyData?.logo).length > 0 ? (
                  <Image
                    style={styles.imageIcon}
                    source={{ uri: agencyData?.logo?.uri }}
                  />
                ) : (
                  <Image
                    style={styles.imageIcon}
                    source={require("../assets/photo.png")}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.documentText}>Photo</Text>
            </View>

            <View style={[styles.iconMainView, { alignSelf: "flex-end" }]}>
              <TouchableOpacity onPress={onAddPress} style={styles.loginBtn}>
                <Text style={styles.btnText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClosePress}
                style={[styles.loginBtn, { backgroundColor: colors.graye6_1 }]}
              >
                <Text style={[styles.btnText, { color: colors.black1e }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Toast config={toastConfig} position="bottom" />
          {/* <ToastMessage /> */}
        </KeyboardAwareScrollView>
      </View>
    </ReactNativeModal>
  );
};

export default AddAgencyModal;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      paddingTop: 10,
      borderWidth: 1,
      borderRadius: 25,
      paddingBottom: 30,
      borderColor: colors.black,
      height: SCREEN_HEIGHT * 0.85,
      backgroundColor: colors.white,
    },
    rowView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      ...commonFontStyle(500, 14, colors.black1d),
      marginBottom: 10,
    },
    headerText: {
      ...commonFontStyle(500, 18, colors.main3f),
      marginBottom: 20,
      textAlign: "center",
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.graya8,
      height: 40,
      marginBottom: 15,
    },
    input: {
      flex: 1,
      ...commonFontStyle(400, 12, colors.black1e),
      paddingHorizontal: 10,
    },
    imageIcon: {
      height: 30,
      width: 30,
      resizeMode: "contain",
      tintColor: colors.black,
    },
    iconView: {
      borderColor: colors.graye6,
      borderWidth: 1,
      height: 50,
      width: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    iconMainView: {
      flexDirection: "row",
    },
    loginBtn: {
      alignSelf: "center",
      backgroundColor: colors.main3f,
      width: "30%",
      alignItems: "center",
      borderRadius: 3,
      paddingVertical: 10,
      marginTop: hp(4),
    },
    btnText: {
      ...commonFontStyle(500, 12, colors.white),
    },
    documentText: {
      ...commonFontStyle(500, 8, colors.black33),
      alignSelf: "center",
      top: 5,
    },
  });
};
