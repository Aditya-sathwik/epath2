import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../theme/appStyles";
import CommonInput from "../compoment/CommonInput";
import { colors } from "../theme/colors";
import { commonFontStyle, hp } from "../theme/fonts";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import ImageCropPicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";

type Props = {};

const AddPilotScreen = (props: Props) => {
  const [pilotData, setPilotData] = useState({
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
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    console.warn("A date has been picked: ", date);
    setPilotData({ ...pilotData, dob: moment(date).format("DD/MM/YYYY") });
    hideDatePicker();
  };

  const openImage = () => {
    ImageCropPicker.openPicker({
      mediaType: "photo",
    }).then((image: any) => {
      console.log(image);
      setPilotData({ ...pilotData, image: image });
    });
  };
  const openFilePicker = async () => {
    try {
      const pickerResult: any = await DocumentPicker.pickSingle({
        presentationStyle: "fullScreen",
      });
      setPilotData({ ...pilotData, document: pickerResult });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={[AppStyles.mainWhiteContainer, { paddingBottom: hp(2) }]}
    >
      <View style={AppStyles.mainWhiteContainerPaddingHo}>
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
          onChangeText={(text) => setPilotData({ ...pilotData, email: text })}
          placeHolder={"Email"}
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
          title={"Permanent Address"}
          value={pilotData.address}
          onChangeText={(text) => setPilotData({ ...pilotData, address: text })}
          placeHolder={"Permanent Address"}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <View style={styles.iconMainView}>
          <TouchableOpacity
            onPress={() => openFilePicker()}
            style={[styles.iconView, { marginRight: 10 }]}
          >
            <Image
              style={styles.imageIcon}
              source={require("../assets/file.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openImage()} style={styles.iconView}>
            {pilotData.image !== "" ? (
              <Image
                style={styles.imageIcon}
                source={{ uri: pilotData.sourceURL }}
              />
            ) : (
              <Image
                style={styles.imageIcon}
                source={require("../assets/photo.png")}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={[styles.iconMainView, { alignSelf: "flex-end" }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.loginBtn}
          >
            <Text style={styles.btnText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.loginBtn, { backgroundColor: colors.graye6 }]}
          >
            <Text style={[styles.btnText, { color: colors.black1e }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddPilotScreen;

const styles = StyleSheet.create({
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
});
