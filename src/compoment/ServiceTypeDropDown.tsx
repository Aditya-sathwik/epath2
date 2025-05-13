import React, { useState } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

import { Dropdown as DropdownElement } from "react-native-element-dropdown";
import { commonFontStyle, hp, wp } from "../theme/fonts";
import { colors } from "../theme/colors";
import { useTheme } from "@react-navigation/native";

type props = {
  data: any;
  value: string;
  onChange: (value: any) => void;
  placeholder?: string;
  labelField?: string;
  valueField?: string;
  containerStyle?: ViewStyle;
  label?: string;
  isSearch?: boolean;
  searchPlaceholder?: string;
};

const ServiceTypeDropDown = ({
  data,
  value,
  onChange,
  placeholder,
  label,
  isSearch,
  containerStyle,
  searchPlaceholder,
}: props) => {
  const [isFocus, setIsFocus] = useState(false);

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <View
        style={{
          ...styles.inputContainer,
        }}
      >
        <DropdownElement
          data={data}
          value={value}
          onChange={onChange}
          dropdownPosition={"auto"}
          style={styles.dropdownStyle}
          labelField={"label"}
          valueField={"value"}
          placeholder={placeholder}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.inputStyle}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          search={isSearch || false}
          searchPlaceholder={searchPlaceholder}
          autoScroll={false}
          keyboardAvoiding={true}
          renderItem={(res) => {
            return (
              <View key={res.agency_id} style={styles.rowStyle}>
                <Text style={styles.inputStyle}>{res?.label}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    labelTextStyle: {
      ...commonFontStyle(500, 14, colors.black1d),
      marginBottom: 10,
    },
    container: {
      marginTop: hp(1),
      marginBottom: hp(0),
    },
    inputContainer: {
      height: 40,
      borderRadius: 5,
      marginBottom: 15,
      borderColor: colors.graya8,
      backgroundColor: colors.graye6,
    },
    inputStyle: {
      flex: 1,
      ...commonFontStyle(500, 12, colors.black),
      paddingHorizontal: 10,
    },
    placeholderStyle: {
      flex: 1,
      paddingHorizontal: 10,
      ...commonFontStyle(500, 13, colors.gray79),
    },
    dropdownStyle: {
      flex: 1,
      paddingRight: wp(2.2),
    },
    rowStyle: {
      flexDirection: "row",
      alignItems: "center",
      height: hp(5),
      paddingHorizontal: wp(2.5),
      backgroundColor: colors.white,
    },
  });
};

export default ServiceTypeDropDown;
