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

const DriversSOSModal = ({ isVisible, onPressCancel, onComplete }: Props) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const closePress = async () => {
    if (onPressCancel) onPressCancel();
  };

  return (
    <ReactNativeModal isVisible={isVisible}>
      <View style={[styles.container, { marginHorizontal: 10 }]}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 0 }}>
          <Text style={styles.headerText}>
            {"Sending SOS Alert to  Authority\nand Agency"}
          </Text>

          <View style={styles.timeContainer}>
            <CountdownCircleTimer
              isPlaying
              duration={5}
              strokeWidth={4}
              colors="#CF312C"
              onComplete={(res) => {
                if (onPressCancel) onPressCancel();
                if (onComplete) onComplete();
              }}
            >
              {({ remainingTime }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.fillText1}>{remainingTime}</Text>
                  <Text style={styles.fillText}>{`Secs\nLeft`}</Text>
                </View>
              )}
            </CountdownCircleTimer>
          </View>

          <PrimaryButton
            label="Cancel"
            containerStyle={{
              width: "80%",
              alignSelf: "center",
              marginTop: 40,
              height: hp(4.5),
              backgroundColor: colors.grayabf,
            }}
            textStyle={{ color: colors.black }}
            onPress={closePress}
          />
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
      ...commonFontStyle(700, 12, colors.black),
      textAlign: "center",
      marginTop: 60,
      lineHeight: 18,
    },
    timeContainer: {
      alignSelf: "center",
      marginVertical: 40,
      elevation: 5,
    },
  });
};

export default DriversSOSModal;
