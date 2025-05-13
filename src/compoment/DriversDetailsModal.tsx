//import liraries
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ReactNativeModal from "react-native-modal";
import { hp, wp, commonFontStyle, SCREEN_WIDTH } from "../theme/fonts";
import { colors } from "../theme/colors";
import { icons } from "../utils/Icon";
import { useAppDispatch } from "../redux/hooks";
import { getAgenciesDetailsAction } from "../action/commonAction";
import { countAge } from "../utils/globalFunctions";
import { api } from "../utils/apiConstants";
import { useTheme } from "@react-navigation/native";

type Props = {
  onPressCancel?: () => void;
  isVisible: boolean;
  driver: boolean;
  data: any;
};

const DriversDetailsModal = ({ isVisible, onPressCancel, data }: Props) => {
  const dispatch = useAppDispatch();
  const [ageData, setAgeData] = useState("");
  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  useEffect(() => {
    if(data?.agency_id){
      const obj = {
        params: data?.agency_id,
        onSuccess: (res) => {
          setAgeData(res?.name);
        },
        onFailure: () => {},
      };
      dispatch(getAgenciesDetailsAction(obj));
    }
  }, [data?.agency_id]);

  return (
    <ReactNativeModal
      onBackButtonPress={onPressCancel}
      onBackdropPress={onPressCancel}
      isVisible={isVisible}
      style={{ margin: 10 }}
    >
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text></Text>
          <TouchableOpacity
            onPress={onPressCancel}
            style={{ alignItems: "flex-end" }}
          >
            <Image source={icons.close} style={styles.cancelIcon} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 0 }}>
          <View style={styles.headerCard}>
            <View>
              <Image
                source={{ uri:  data?.photos }}
                style={styles.iconStyle}
              />
              <Text style={styles.btnText}>
                Status: <Text style={{ color: colors.main3f }}>Available</Text>
              </Text>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.profileText}>{data?.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[styles.maleText, { textTransform: "capitalize" }]}
                >
                  {data?.gender}
                </Text>
                <View style={styles.spasLine} />
                <Text style={styles.ageText}>{countAge(data?.dob)} years</Text>
              </View>
              <View>
                <View style={styles.bodyView}>
                  <Image source={icons.agency} style={styles.listIcon} />
                  <View style={styles.listView}>
                    <Text style={styles.listText}>{ageData}</Text>
                  </View>
                </View>
                <View style={styles.footerView}>
                  <Image
                    source={icons.drivinglicense}
                    style={styles.listIcon}
                  />
                  <View style={styles.listView}>
                    <Text style={styles.listText}>
                      {data?.driving_license_number}
                    </Text>
                  </View>
                </View>
                {/* <View style={styles.footerView}>
                  <Image source={icons.mail} style={styles.listIcon} resizeMode='contain' />
                  <View style={styles.listView}>
                    <Text style={styles.listText}>james12@gmail.com</Text>
                  </View>
                </View> */}
                <View style={styles.footerView}>
                  <Image source={icons.callIcon} style={styles.listIcon} />
                  <View style={styles.listView}>
                    <Text style={styles.listText}>{data?.phone_number}</Text>
                  </View>
                </View>
                <View style={styles.footerView}>
                  <Image source={icons.home} style={styles.listIcon} />
                  <View style={styles.listView}>
                    <Text style={styles.listText}>
                      {data?.permanent_address}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default DriversDetailsModal;

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
      width: 150,
      height: 160,
      borderWidth: 1,
      borderRadius: 26,
      backgroundColor: "#F3F3F3",
    },
    btnText: {
      ...commonFontStyle(600, 14, colors.black33),
      marginTop: 10,
      textAlign: "center",
    },
    profileText: {
      ...commonFontStyle(600, 18, colors.black),
    },
    profileValueText: {
      ...commonFontStyle(600, 14, colors.black),
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
      ...commonFontStyle(600, 10, colors.black),
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
      ...commonFontStyle(600, 12, colors.black),
    },
    ageText: {
      ...commonFontStyle(600, 12, colors.black),
    },
    expText: {
      ...commonFontStyle(600, 12, colors.black),
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
  });
};
