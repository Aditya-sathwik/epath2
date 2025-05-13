//import liraries
import React from "react";
import ReactNativeModal from "react-native-modal";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { icons } from "../utils/Icon";
import { colors } from "../theme/colors";
import { useAppDispatch } from "../redux/hooks";
import { hp, commonFontStyle, SCREEN_WIDTH, wp } from "../theme/fonts";
import { api } from "../utils/apiConstants";
import { Text } from "react-native";
import { useTheme } from "@react-navigation/native";

type Props = {
  onPressCancel?: () => void;
  isVisible: boolean;
  data: any;
};

const AgencyDetailsModal = ({ isVisible, onPressCancel, data }: Props) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={onPressCancel}
      onBackdropPress={onPressCancel}
      style={{ margin: 10 }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onPressCancel}
          style={{ alignItems: "flex-end" }}
        >
          <Image source={icons.close} style={styles.cancelIcon} />
        </TouchableOpacity>
        <View style={styles.rowStyle}>
          <Image
            resizeMode="contain"
            style={styles.iconStyle}
            source={{ uri:  data?.logos }}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.profileText}>
              ID: <Text style={styles.profileValueText}>{data.agency_id}</Text>
            </Text>
            <View style={{ height: hp(1) }} />
            <Text style={styles.profileText}>
              Name: <Text style={styles.profileValueText}>{data.name}</Text>
            </Text>
            <View style={{ height: hp(1) }} />
            <Text style={styles.profileText}>
              Email: <Text style={styles.profileValueText}>{data?.email}</Text>
            </Text>
            <View style={{ height: hp(1) }} />
            <Text style={styles.profileText}>
              Phone No.:{" "}
              <Text style={styles.profileValueText}>{data?.phone_number}</Text>
            </Text>
            <View style={{ height: hp(1) }} />
            <Text style={styles.profileText}>
              Representative Name:{" "}
              <Text style={styles.profileValueText}>
                {data?.representative_name}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default AgencyDetailsModal;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      borderRadius: 25,
      backgroundColor: colors.white,
      paddingBottom: 30,
      margin: 0,
      borderWidth: 1,
      borderColor: colors.black,
    },
    headerCard: {
      flexDirection: "row",
      // alignItems: 'center',
    },
    iconStyle: {
      width: 100,
      height: 100,
      borderRadius: 20,
      marginRight: wp(4),
      backgroundColor: "#F3F3F3",
    },
    btnText: {
      ...commonFontStyle(600, 14, colors.black33),
      marginTop: 10,
      textAlign: "center",
    },
    profileText: {
      ...commonFontStyle(600, 15, colors.black1e_1),
    },
    profileValueText: {
      ...commonFontStyle(600, 14, colors.graya92),
      marginTop: 4,
    },
    monthText: {
      ...commonFontStyle(500, 14, colors.black),
      top: 12,
    },
    lineStyle: {
      width: "80%",
      borderWidth: 0.5,
      alignSelf: "center",
      borderColor: colors.grayaeb,
    },
    headerView: {
      backgroundColor: colors.white,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      // paddingLeft: 40,
      paddingRight: 19,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    },
    bodyView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
    },
    cancelIcon: {
      width: 16,
      height: 16,
      marginTop: 20,
      marginRight: wp(4),
      tintColor: colors.black,
    },
    locationIcon: {
      width: 12,
      height: 12,
      marginRight: 5,
    },
    titleTextStyle: {
      ...commonFontStyle(400, 20, colors.white),
    },
    bodyText: {
      ...commonFontStyle(500, 14, colors.black2),
      lineHeight: 21,
      paddingBottom: 5,
    },
    headerText: {
      ...commonFontStyle(600, 14, colors.black),
      marginVertical: 15,
    },
    subTitleTextStyle: {
      ...commonFontStyle(400, 16, colors.gray5d),
      marginVertical: hp(10),
      marginBottom: hp(30),
    },
    dobText: {
      ...commonFontStyle(500, 12, colors.black2),
      marginTop: 15,
    },
    rcText: {
      ...commonFontStyle(500, 12, colors.black2),
      marginTop: 10,
    },
    LiText: {
      marginTop: 10,
      ...commonFontStyle(500, 12, colors.black2),
    },
    listIcon: {
      width: 16,
      height: 16,
      tintColor: colors.black,
      resizeMode: "contain",
    },
    listView: {
      // backgroundColor: colors.grayd9,
      marginLeft: 5,
      borderRadius: 4,
      width: SCREEN_WIDTH * 0.34,
      borderWidth: 1,
      borderColor: colors.grayaeb,
    },
    listText: {
      ...commonFontStyle(600, 10, colors.black1e),
      paddingVertical: hp(0.7),
      paddingHorizontal: 2,
      textAlign: "center",
    },
    footerView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    maleText: {
      ...commonFontStyle(600, 12, colors.black1e),
    },
    ageText: {
      ...commonFontStyle(600, 12, colors.black1e),
    },
    expText: {
      ...commonFontStyle(600, 12, colors.black1e),
    },
    spasLine: {
      width: 1,
      height: 10,
      borderWidth: 0.5,
      borderColor: colors.grayaeb,
      marginHorizontal: 5,
    },
    emailText: {
      ...commonFontStyle(600, 8, colors.graya92),
      marginTop: 10,
    },
    contactText: {
      ...commonFontStyle(600, 8, colors.graya92),
      marginTop: 5,
    },
    addressText: {
      ...commonFontStyle(600, 10, colors.black30),
      marginTop: hp(4),
      alignSelf: "center",
      textAlign: "center",
    },
    rowStyle: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginHorizontal: wp(4),
      marginVertical: hp(1),
    },
    rightContainer: {
      flex: 1,
    },
  });
};
