//import liraries
import moment from "moment";

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import ReactNativeModal from "react-native-modal";
import { useNavigation, useTheme } from "@react-navigation/native";
import DocumentPicker from "react-native-document-picker";
import ImageCropPicker from "react-native-image-crop-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  infoToast,
  toastConfig,
  objectToFormData,
} from "../utils/globalFunctions";
import CommonInput from "./CommonInput";
import { colors } from "../theme/colors";
import { AppStyles } from "../theme/appStyles";
import { addVehicleAction, getAgenciesAction, getVehicleAction } from "../action/commonAction";
import DropDownNewCompoenet from "./DropDownNewCompoenet";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAsyncLocationLoginInfo } from "../utils/asyncStorage";
import { hp, commonFontStyle, SCREEN_HEIGHT } from "../theme/fonts";
import ToastMessage from "./ToastMessage";

type Props = {
  onPressCancel?: () => void;
  isVisible: boolean;
};

const AddVehicalModal = ({ isVisible, onPressCancel }: Props) => {
  const [vehical, setVehical] = useState({
    no: "",
    model: "",
    ownerName: "",
    color: "",
    rcNo: "",
    image: {},
    document: "",
  });

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

  const openImage = () => {
    ImageCropPicker.openPicker({
      mediaType: "photo",
    }).then((image) => {
      console.log(image);
      setVehical({
        ...vehical,
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
      });
      setVehical({ ...vehical, document: pickerResult });
    } catch (e) {
      console.log(e);
    }
  };

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  const onClosePress=()=>{
    if (onPressCancel) {
      onPressCancel();
      setVehical({
        no: "",
        model: "",
        ownerName: "",
        color: "",
        rcNo: "",
        image: "",
        document: "",
      });
      setAgency({});
    }
}


  const onAddPress = async () => {
    if (Object.keys(agency).length === 0) {
      infoToast("Please select a agency");
    } else if (vehical?.no?.trim()?.length === 0) {
      infoToast("Please enter a vehicle number");
    } else if (vehical?.model?.trim()?.length === 0) {
      infoToast("Please enter a vehicle model");
    } else if (vehical?.ownerName?.trim()?.length === 0) {
      infoToast("Please enter a owner name");
    } else if (vehical?.color?.trim()?.length === 0) {
      infoToast("Please enter a vehicle colour");
    } else if (vehical?.rcNo?.trim()?.length === 0) {
      infoToast("Please enter a RC NO");
    } else if (Object.keys(vehical?.image).length === 0) {
      infoToast("Please select a vehicle photo");
    } else {
      let isGuest = await getAsyncLocationLoginInfo();
      let data = {
        // authority_id: isGuest?.ids?.authority_id,
        agency_id: agency?.agency_id?.toString(),
        vehicle_number: vehical?.no,
        rc_number: vehical?.rcNo,
        vehicle_model: vehical?.model,
        owner: vehical?.ownerName,
        color: vehical?.color,
        // rc_document: null,
        photos: vehical.image,
      };
      const obj = {
        data: objectToFormData(data),
        onSuccess: () => {
          onPressCancel();
          setVehical({
            no: "",
            model: "",
            ownerName: "",
            color: "",
            rcNo: "",
            image: "",
            document: "",
          });
          setAgency({});
        },
        onFailure: () => {},
      };
      dispatch(addVehicleAction(obj));
    }
  };

  
  return (
    <ReactNativeModal isVisible={isVisible} statusBarTranslucent>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          extraHeight={100}
          contentContainerStyle={[
            { paddingBottom: isKeyboardVisible ? hp(10) : hp(2) },
          ]}
        >
          <Text style={styles.headerText}>Add Vehicle</Text>
          <View style={{ flex: 1, paddingHorizontal: hp(2) }}>
          {getAgenciesData?.length !== undefined &&  <DropDownNewCompoenet
              label="Agency"
              data={getAgenciesData}
              value={agency}
              onChange={(item) => {
                setAgency(item);
              }}
              placeholder="Select Agency"
              searchPlaceholder="Search Agency"
              isSearch={true}
            />}
            <CommonInput
              title={"Vehicle No"}
              value={vehical.no}
              onChangeText={(text) => setVehical({ ...vehical, no: text })}
              placeHolder={"Vehicle No"}
              isInfoView={true}
            />
            <CommonInput
              title={"Vehicle Model"}
              value={vehical.model}
              onChangeText={(text) => setVehical({ ...vehical, model: text })}
              placeHolder={"Vehicle Model"}
              // secureTextEntry={true}
            />
            <CommonInput
              title={"Owner Name"}
              value={vehical.ownerName}
              onChangeText={(text) =>
                setVehical({ ...vehical, ownerName: text })
              }
              placeHolder={"Owner Name"}
            />

            <CommonInput
              title={"Vehicle Colour"}
              value={vehical.color}
              onChangeText={(text) => setVehical({ ...vehical, color: text })}
              placeHolder={"Vehicle Colour"}
              isInfoView={true}
            />
            <CommonInput
              title={"RC No"}
              value={vehical.rcNo}
              onChangeText={(text) => setVehical({ ...vehical, rcNo: text })}
              placeHolder={"RC No"}
              isInfoView={true}
            />

            <View style={styles.iconMainView}>
              {/* <View>
                <TouchableOpacity
                  onPress={() => openFilePicker()}
                  style={[styles.iconView, { marginRight: 10 }]}
                >
                  <Image
                    style={styles.imageIcon}
                    source={require("../assets/file.png")}
                  />
                </TouchableOpacity>
                <Text style={styles.documentText}>RC document</Text>
              </View> */}
              <View>
                <TouchableOpacity
                  style={styles.iconView}
                  onPress={() => openImage()}
                >
                  {Object.keys(vehical?.image)?.length > 0 ? (
                    <Image
                      style={styles.imageIcon}
                      source={{ uri: vehical?.image?.uri }}
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
      height: SCREEN_HEIGHT * 0.85,
      borderWidth: 1,
      borderColor: colors.black,
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

export default AddVehicalModal;
