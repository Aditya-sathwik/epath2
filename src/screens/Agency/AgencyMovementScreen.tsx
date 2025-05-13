import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../theme/appStyles";
import { commonFontStyle, hp } from "../../theme/fonts";
import { colors } from "../../theme/colors";
import MapMovement from "../MapMovement";
import AgencyListMovement from "./AgencyListMovement";
import { useTheme } from "@react-navigation/native";

type Props = {};

const AgencyMovementScreen = (props: Props) => {
  const [selectedType, setselectedType] = useState("list");
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  return (
    <View style={styles.container}>
      <View style={styles.typeRow}>
        <TouchableOpacity
          onPress={() => setselectedType("map")}
          style={
            selectedType !== "list" ? styles.typeSelected : styles.typeView
          }
        >
          <Text
            style={
              selectedType !== "list"
                ? styles.typeSelectedText
                : styles.typeViewText
            }
          >
            Map view
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setselectedType("list")}
          style={selectedType == "list" ? styles.typeSelected : styles.typeView}
        >
          <Text
            style={
              selectedType == "list"
                ? styles.typeSelectedText
                : styles.typeViewText
            }
          >
            List view
          </Text>
        </TouchableOpacity>
      </View>
      {selectedType == "list" ? <AgencyListMovement /> : <MapMovement />}
    </View>
  );
};

export default AgencyMovementScreen;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: hp(2),
      backgroundColor: colors.white,
    },
    typeSelected: {
      backgroundColor: colors.main3f,
      borderRadius: 3,
      paddingVertical: 5,
      width: "19%",
      alignItems: "center",
    },
    typeView: {
      backgroundColor: colors.grayd9,
      borderRadius: 3,
      paddingVertical: 5,
      width: "19%",
      alignItems: "center",
    },
    typeSelectedText: {
      ...commonFontStyle(500, 12, colors.white),
    },
    typeViewText: {
      ...commonFontStyle(500, 12, colors.black1e),
    },
    typeRow: {
      flexDirection: "row",
      alignSelf: "flex-end",
      paddingVertical: hp(2),
    },
  });
};
