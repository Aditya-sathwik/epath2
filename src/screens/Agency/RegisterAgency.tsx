import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../theme/appStyles";
import CommonInput from "../../compoment/CommonInput";
import { colors } from "../../theme/colors";
import { commonFontStyle, hp } from "../../theme/fonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../../compoment/PrimaryButton";
import { useAppDispatch } from "../../redux/hooks";
import { requestLocationPermission } from "../../utils/loactionHandler";
import { getAsyncLocationLoginInfo } from "../../utils/asyncStorage";
import { addAgenciesAction } from "../../action/commonAction";

type Props = {};

const RegisterAgency = (props: Props) => {
  const [agencyData, setAgencyData] = useState({
    agencyName: "",
    representName: "",
    email: "",
    country: "IN",
    phoneNumber: "",
    address: "",
    username: "",
    countryCode: 91,
  });
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

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

  const onAddPress = async () => {
    let isGuest = await getAsyncLocationLoginInfo();
    const obj = {
      data: {
        name: agencyData?.agencyName,
        phone_number: `+${agencyData?.countryCode}${agencyData?.phoneNumber}`,
        email: agencyData?.email,
        address: agencyData?.address,
        location_lat: currentLocation?.latitude,
        location_lng: currentLocation?.longitude,
        representative_name: agencyData?.representName,
        logo: "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/chromium/chromium_48x48.png",
        authority_id: isGuest?.ids?.authority_id,
      },
      onSuccess: () => {
        setAgencyData({
          agencyName: "",
          representName: "",
          email: "",
          country: "IN",
          countryCode: 91,
          phoneNumber: "",
          address: "",
          username: "",
        });
      },
      onFailure: () => {},
    };

    dispatch(addAgenciesAction(obj));
  };

  return (
    <KeyboardAwareScrollView
      style={[AppStyles.mainWhiteContainer, { paddingBottom: hp(2) }]}
    >
      <View style={AppStyles.mainWhiteContainerPaddingHo}>
        <Text style={styles.headerText}>Register Agency</Text>

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
          onChangeText={(text) => setAgencyData({ ...agencyData, email: text })}
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
        <CommonInput
          title={"Username"}
          value={agencyData.username}
          onChangeText={(text) =>
            setAgencyData({ ...agencyData, username: text })
          }
          placeHolder={"Enter a User name"}
        />

        <PrimaryButton
          label="Register"
          containerStyle={{
            width: "50%",
            alignSelf: "center",
            marginTop: 21,
            // backgroundColor: colors.grayabf,
            height: hp(4.5),
          }}
          textStyle={{ color: colors.white }}
          onPress={onAddPress}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default RegisterAgency;

const styles = StyleSheet.create({
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    ...commonFontStyle(500, 18, colors.main3f),
    marginBottom: 20,
    textAlign: "center",
    marginTop: 30,
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
