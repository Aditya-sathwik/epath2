//import liraries
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ReactNativeModal from "react-native-modal";
import { hp, wp, commonFontStyle } from "../theme/fonts";
import { icons } from "../utils/Icon";
import { useNavigation, useTheme } from "@react-navigation/native";
import PrimaryButton from "./PrimaryButton";

type Props = {
  onPressCancel?: () => void;
  onPressConfirm?: () => void;
  isVisible: boolean;
  headerText: string;
  tabSelect: number;
};

const DriversMovementModal = ({
  isVisible,
  onPressCancel,
  onPressConfirm,
  headerText,
  tabSelect,
}: Props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  return (
    <ReactNativeModal isVisible={isVisible}>
      <View
        style={[
          styles.container,
          { marginHorizontal: tabSelect == 1 ? 25 : 40 },
        ]}
      >
        <View style={styles.headerView}>
          <View />
          <TouchableOpacity
            onPress={onPressCancel}
            style={{ alignItems: "flex-end" }}
          >
            <Image source={icons.close} style={styles.cancelIcon} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 0 }}>
          <Text style={styles.headerText}>{headerText}</Text>
          <PrimaryButton
            label={tabSelect == 1 ? "Yes" : "Cancel"}
            containerStyle={{
              width: "80%",
              marginTop: 21,
              height: hp(4.5),
              alignSelf: "center",
              backgroundColor: tabSelect == 1 ? colors.main3f : colors.grayabf,
            }}
            textStyle={{ color: tabSelect == 1 ? colors.white : colors.black }}
            onPress={tabSelect == 1 ? onPressConfirm : onPressCancel}
          />
          <PrimaryButton
            label={tabSelect == 1 ? "No" : "Finish"}
            containerStyle={{
              width: "80%",
              alignSelf: "center",
              marginTop: 10,
              height: hp(4.5),
              backgroundColor: tabSelect == 1 ? colors.grayabf : colors.main3f,
            }}
            textStyle={{ color: tabSelect == 1 ? colors.black : colors.white }}
            onPress={tabSelect == 1 ? onPressCancel : onPressConfirm}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({});

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      borderRadius: 25,
      backgroundColor: colors.white,
      paddingBottom: 30,
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
    },
  });
};

export default DriversMovementModal;
