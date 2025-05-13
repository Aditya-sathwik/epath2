//import liraries
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ReactNativeModal from "react-native-modal";
import { hp, wp, commonFontStyle } from "../theme/fonts";
import { colors } from "../theme/colors";
import PrimaryButton from "./PrimaryButton";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useTheme } from "@react-navigation/native";

type Props = {
  onPressCancel?: () => void;
  onComplete?: () => void;
  isVisible: boolean;
  timerShow?: number;
};

const ConfirmModal = ({ isVisible, onPressCancel, onComplete }: Props) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const closePress = async () => {
    if (onPressCancel) onPressCancel();
  };

  return (
    <ReactNativeModal isVisible={isVisible}>
      <View style={[styles.container, { marginHorizontal: 10 }]}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 0 }}>
          <Text style={[styles.headerText,{marginTop: 40}]}>
            {"Are you sure want to\ncancel movement?"}
          </Text>

       <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
          <PrimaryButton
            label="Cancel"
            containerStyle={{
              width: "40%",
              alignSelf: "center",
              marginTop: 40,
              height: hp(5),
              backgroundColor: colors.grayabf,
            }}
            textStyle={{ color: colors.black }}
            onPress={closePress}
          />
           <PrimaryButton
            label="Confirm"
            containerStyle={{
              width: "40%",
              alignSelf: "center",
              marginTop: 40,
              height: hp(5),
              backgroundColor: colors.main3f
            }}
            textStyle={{ color: "#fff" }}
            onPress={onComplete}
          />
       </View>
          
        </View>
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
      // height: 450,
    },
    headerCard: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconStyle: {
      width: 95,
      height: 95,
      borderRadius: 20,
      marginRight: 9,
    },
    fillText1: {
      ...commonFontStyle(700, 40, colors.black),
    },
    fillText: {
      ...commonFontStyle(700, 12, colors.black),
      marginLeft: 5,
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
      paddingLeft: 40,
      paddingRight: 19,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    },
    bodyView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 15,
    },
    cancelIcon: {
      width: 16,
      height: 16,
      tintColor: colors.black,
    },
    headerText: {
      ...commonFontStyle(700, 16, colors.black),
      textAlign: "center",
      lineHeight: 18,
    },
    headerText1: {
      ...commonFontStyle(700, 20, colors.black),
      textAlign: "center",
      lineHeight: 18,
    },
    timeContainer: {
      alignSelf: "center",
      marginVertical: 40,
      elevation: 5,
    },
  });
};

export default ConfirmModal;
