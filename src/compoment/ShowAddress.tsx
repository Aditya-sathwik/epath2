import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { commonFontStyle, hp, wp } from "../theme/fonts";
import { colors } from "../theme/colors";
import { useTheme } from "@react-navigation/native";

const ShowAddress = ({
  onPress,
  value,
  placeholder,
}: {
  onPress: () => void;
  value: string;
  placeholder: string;
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  return (
    <TouchableOpacity onPress={onPress} style={styles.addressContainer}>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {value ? (
          <Text style={styles.valueTexStyle}>{value}</Text>
        ) : (
          <Text style={styles.placevalueTexStyle}>{placeholder}</Text>
        )}
      </ScrollView>
    </TouchableOpacity>
  );
};

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    addressContainer: {
      marginVertical: 5,
      height: hp(5),
      backgroundColor: colors.graye6,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp(3),
      zIndex: -1,
    },
    valueTexStyle: {
      ...commonFontStyle(500, 14, colors.black),
      paddingRight: wp(4),
      flex: 1,
      margin: 0,
    },
    placevalueTexStyle: {
      ...commonFontStyle(500, 14, colors.gray5d),
      paddingRight: wp(4),
      flex: 1,
      margin: 0,
    },
  });
};

export default ShowAddress;
