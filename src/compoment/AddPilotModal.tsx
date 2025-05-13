//import liraries
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import Toast from "react-native-toast-message";
import ReactNativeModal from "react-native-modal";
import { useNavigation, useTheme } from "@react-navigation/native";
import DocumentPicker from "react-native-document-picker";
import ImageCropPicker from "react-native-image-crop-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  infoToast,
  toastConfig,
  objectToFormData,
} from "../utils/globalFunctions";
import CommonInput from "./CommonInput";
import { colors } from "../theme/colors";
import { AppStyles } from "../theme/appStyles";
import { emailCheck } from "../utils/validation";
import DropDownNewCompoenet from "./DropDownNewCompoenet";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAsyncLocationLoginInfo } from "../utils/asyncStorage";
import { hp, commonFontStyle, SCREEN_HEIGHT } from "../theme/fonts";
import { addPilotAction, onUserProfileAction } from "../action/commonAction";
import ToastMessage from "./ToastMessage";

type Props = {
  onPressCancel?: () => void;
  isVisible: boolean;
};

const AddPilotModal = ({ isVisible, onPressCancel }: Props) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  const [pilotData, setPilotData] = useState({
    username: "",
    password: "",
    pilotName: "",
    gender: "",
    dob: "",
    email: "",
    licenceNumber: "",
    exp: "",
    address: "",
    image: {},
    document: {},
    country: "IN",
    countryCode: 91,
    phoneNumber: "",
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [agency, setAgency] = useState({});
  const { getAgenciesData } = useAppSelector((state) => state.common);

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setPilotData({ ...pilotData, dob: moment(date).format("YYYY-MM-DD") });
    hideDatePicker();
  };

  const openImage = () => {
    ImageCropPicker.openPicker({
      mediaType: "photo",
    }).then((image) => {
      console.log(image);
      setPilotData({
        ...pilotData,
        image: {
          uri: image?.path,
          type: image?.mime,
          name: "image_" + moment().unix() + "_" + image.path.split("/").pop(),
        },
      });
    });
  };
  const openFilePicker = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: "fullScreen",
        type: DocumentPicker.types.images,
      });

      setPilotData({
        ...pilotData,
        document: {
          uri: pickerResult?.uri,
          type: pickerResult?.type,
          name: pickerResult?.name,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };


  const onClosePress=()=>{
    if (onPressCancel) {
      onPressCancel();
      setPilotData({
        username: "",
        password: "",
        pilotName: "",
        gender: "",
        dob: "",
        email: "",
        licenceNumber: "",
        exp: "",
        address: "",
        image: {},
        document: {},
        country: "IN",
        countryCode: 91,
        phoneNumber: "",
      });
      setAgency({});
    }
}


  const onAddPress = async () => {
    if (Object.keys(agency).length === 0) {
      infoToast("Please select a agency");
    } else if (pilotData?.username?.trim()?.length === 0) {
      infoToast("Please enter a username");
    } else if (pilotData?.password?.trim()?.length === 0) {
      infoToast("Please enter a password");
    } else if (pilotData?.pilotName?.trim()?.length === 0) {
      infoToast("Please enter a pilot name");
    } else if (pilotData?.gender?.trim()?.length === 0) {
      infoToast("Please enter gender");
    } else if (pilotData?.dob?.trim()?.length === 0) {
      infoToast("Please select a date of birth");
    } else if (!emailCheck(pilotData?.email)) {
      infoToast("Please enter a email address");
    } else if (pilotData?.phoneNumber?.trim()?.length === 0) {
      infoToast("Please enter a phone number");
    } else if (pilotData?.licenceNumber?.trim()?.length === 0) {
      infoToast("Please enter a licence Number");
    } else if (pilotData?.exp?.trim()?.length === 0) {
      infoToast("Please enter a experience year");
    } else if (pilotData?.address?.trim()?.length === 0) {
      infoToast("Please enter a address");
    } else if (Object.keys(pilotData.document)?.length === 0) {
      infoToast("Please select a driving license");
    } else if (Object.keys(pilotData.image)?.length === 0) {
      infoToast("Please select a photo");
    } else {
      let isGuest = await getAsyncLocationLoginInfo();
      let data = {
        username: pilotData?.username,
        password: pilotData?.password,
        name: pilotData?.pilotName,
        authority_id: isGuest?.ids?.authority_id?.toString(),
        agency_id: agency?.agency_id?.toString(),
        driving_licenses: pilotData.document,
        driving_license_number: pilotData?.licenceNumber,
        dob: pilotData?.dob,
        phone_number: `+${pilotData?.countryCode}${pilotData.phoneNumber}`,
        gender: pilotData?.gender,
        permanent_address: pilotData.address,
        photos: pilotData.image,
        experience:pilotData.exp,
        contactnumber: `${pilotData.phoneNumber}`,
        firstname: pilotData?.pilotName,
        lastname: pilotData?.pilotName,
        email: pilotData?.email,
        mapcity: [],
        client: 1,
        product:1,
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
          //     name: pilotData?.pilotName,
          //     contactnumber: `${pilotData.phoneNumber}`,
          //     firstname: pilotData?.pilotName,
          //     lastname: pilotData?.pilotName,
          //     email: pilotData?.email,
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
          if (onPressCancel) {
            onPressCancel();
          }
          setPilotData({
            username: "",
            password: "",
            pilotName: "",
            gender: "",
            dob: "",
            email: "",
            licenceNumber: "",
            address: "",
            image: "",
            document: "",
            country: "IN",
            countryCode: 91,
            phoneNumber: "",
          });
          setAgency({});
        },
        onFailure: () => {},
      };
      dispatch(addPilotAction(obj));
    }
  };

  const navigation = useNavigation();
  return (
    <ReactNativeModal isVisible={isVisible} statusBarTranslucent>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={[{ marginBottom: isKeyboardVisible ? 100 : 0 }]}
        >
          <Text style={styles.headerText}>Add Pilot</Text>
          <View style={{ flex: 1, paddingHorizontal: hp(2) }}>
            <DropDownNewCompoenet
              label="Agency"
              data={getAgenciesData}
              value={agency}
              onChange={(item) => {
                setAgency(item);
              }}
              placeholder="Select Agency"
              searchPlaceholder="Search Agency"
              isSearch={true}
            />
            <CommonInput
              title={"User name"}
              value={pilotData.username}
              onChangeText={(text) =>
                setPilotData({ ...pilotData, username: text })
              }
              placeHolder={"User name"}
            />
            <CommonInput
              title={"Password"}
              value={pilotData.password}
              onChangeText={(text) =>
                setPilotData({ ...pilotData, password: text })
              }
              placeHolder={"Password"}
              secureTextEntry={true}
            />
            <CommonInput
              title={"Pilot Name"}
              value={pilotData.pilotName}
              onChangeText={(text) =>
                setPilotData({ ...pilotData, pilotName: text })
              }
              placeHolder={"Pilot Name"}
            />
            <View style={styles.rowView}>
              <View style={{ width: "47%" }}>
                <CommonInput
                  title={"Gender"}
                  value={pilotData.gender}
                  onChangeText={(text) =>
                    setPilotData({ ...pilotData, gender: text })
                  }
                  placeHolder={"Gender"}
                />
              </View>
              <View style={{ width: "47%" }}>
                <Text style={styles.title}>{"DOB"}</Text>
                <TouchableOpacity
                  onPress={() => showDatePicker()}
                  style={styles.flexRow}
                >
                  <Text
                    style={[
                      styles.input,
                      {
                        color:
                          pilotData.dob !== "" ? colors.black1e1 : colors.gray79,
                      },
                    ]}
                  >
                    {pilotData.dob !== "" ? pilotData.dob : "DD/MM/YYYY"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <CommonInput
              title={"Email"}
              value={pilotData.email}
              onChangeText={(text) =>
                setPilotData({ ...pilotData, email: text })
              }
              placeHolder={"Email"}
            />
            <CommonInput
              title={"Phone number"}
              value={pilotData.phoneNumber}
              onChangeText={(text) =>
                setPilotData({ ...pilotData, phoneNumber: text })
              }
              placeHolder={"Enter Phone number"}
              type={"phone"}
              isInfoView={true}
              country={pilotData.country}
              setCountry={(text) => {
                console.log("code", Number(text?.callingCode));

                setPilotData({
                  ...pilotData,
                  country: text?.cca2,
                  countryCode: Number(text?.callingCode),
                });
              }}
            />
            <CommonInput
              title={"Licence Number"}
              value={pilotData.licenceNumber}
              onChangeText={(text) =>
                setPilotData({ ...pilotData, licenceNumber: text })
              }
              placeHolder={"Licence Number"}
            />
           <CommonInput
              title={"Experience"}
              value={pilotData.exp}
              onChangeText={(text) =>
                setPilotData({ ...pilotData, exp: text })
              }
              placeHolder={"Experience Year"}
               keyboardType="number-pad"
            />
            <CommonInput
              title={"Permanent Address"}
              value={pilotData.address}
              onChangeText={(text) =>
                setPilotData({ ...pilotData, address: text })
              }
              placeHolder={"Permanent Address"}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <View style={{ ...styles.iconMainView }}>
              <View style={styles.centerStyle}>
                <TouchableOpacity
                  onPress={() => openFilePicker()}
                  style={[styles.iconView, { marginRight: 10 }]}
                >
                  {Object.keys(pilotData.document).length > 0 ? (
                    <Image
                      style={styles.imageIcon}
                      source={{ uri: pilotData?.document?.uri }}
                    />
                  ) : (
                    <Image
                      style={styles.imageIcon}
                      source={require("../assets/file.png")}
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.documentText}>{"Driving license"}</Text>
              </View>
              <View style={styles.centerStyle}>
                <TouchableOpacity
                  onPress={() => openImage()}
                  style={styles.iconView}
                >
                  {Object.keys(pilotData.image).length > 0 ? (
                    <Image
                      style={styles.imageIcon}
                      source={{ uri: pilotData?.image?.uri }}
                    />
                  ) : (
                    <Image
                      style={styles.imageIcon}
                      source={require("../assets/photo.png")}
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.documentText}>{"Photo"}</Text>
              </View>
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

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      borderRadius: 25,
      backgroundColor: colors.white,
      paddingBottom: 30,
      paddingTop: 10,
      marginBottom: 20,
      height: SCREEN_HEIGHT * 0.85,
      borderWidth: 1,
      borderColor: colors.black,

      // flex:1
    },
    headerText: {
      ...commonFontStyle(500, 18, colors.main3f),
      marginBottom: 20,
      textAlign: "center",
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
      alignItems: "flex-start",
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
    centerStyle: {
      alignSelf: "center",
    },
  });
};

export default AddPilotModal;
