import React, { useState } from "react";
import { colors } from "../theme/colors";
import { api } from "../utils/apiConstants";
import { SCREEN_WIDTH, hp, commonFontStyle, wp } from "../theme/fonts";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AgencyDetailsModal from "./AgencyDetailsModal";
import { useTheme } from "@react-navigation/native";

const AgencyItem = ({ data }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  return (
    <TouchableOpacity
      style={styles.innerView}
      onPress={() => setIsVisible(true)}
    >
      <Image
        resizeMode="contain"
        style={styles.iconStyle}
        source={{ uri: data?.logos }}
      />
      <View style={styles.rightContainer}>
        <Text style={styles.profileText}>
          ID: <Text style={styles.profileValueText}>{data.agency_id}</Text>
        </Text>
        <View style={{ height: hp(1) }} />
        <Text style={styles.profileText}>
          NAME: <Text style={styles.profileValueText}>{data.name}</Text>
        </Text>
        <View style={{ height: hp(1) }} />
        <Text style={styles.profileText}>
          EMAIL: <Text style={styles.profileValueText}>{data.email}</Text>
        </Text>
      </View>
      <AgencyDetailsModal
        data={data}
        isVisible={isVisible}
        onPressCancel={() => setIsVisible(false)}
      />
    </TouchableOpacity>
  );
};

export default AgencyItem;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    innerView: {
      borderWidth: 0.5,
      borderColor: colors.grayc2,
      borderRadius: 4,
      backgroundColor: colors.white,
      paddingVertical: 10,
      paddingHorizontal: wp(4),
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp(2),
      marginHorizontal: wp(4),
    },
    btnText: {
      ...commonFontStyle(600, 16, colors.black33),
      marginTop: 5,
    },
    profileText: {
      ...commonFontStyle(700, 14, colors.black),
    },
    profileValueText: {
      ...commonFontStyle(600, 12, colors.black),
      marginTop: 4,
    },
    iconStyle: {
      width: 89,
      height: 85,
      borderRadius: 20,
      marginRight: wp(4),
      backgroundColor: "#F3F3F3",
    },
    headerCard: {
      // flexDirection: 'row',
      // alignItems: 'center',
    },
    listIcon: {
      width: 19,
      height: 19,
      tintColor: colors.black,
    },
    dotIcon: {
      width: 19,
      height: 19,
    },
    listView: {
      // backgroundColor: colors.grayd9,
      marginLeft: 5,
      borderRadius: 4,
      width: SCREEN_WIDTH * 0.29,
      borderWidth: 1,
      borderColor: colors.grayaeb,
    },
    listText: {
      ...commonFontStyle(600, 10, colors.black1e),
      paddingVertical: hp(0.7),
      paddingHorizontal: 13,
      textAlign: "center",
    },
    footerView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      marginLeft: 5,
    },
    bodyView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      marginLeft: 5,
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
    rightContainer: {
      flex: 1,
    },
  });
};
