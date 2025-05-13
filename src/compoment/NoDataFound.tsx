import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { commonFontStyle } from "../theme/fonts";
import { colors } from "../theme/colors";

const NoDataFound = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{"No Data Found"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    ...commonFontStyle("600", 16, colors.gray5d),
  },
});

export default NoDataFound;
