import React, { useState } from "react";
import { View, Text, StyleSheet, ViewStyle, TextInput } from "react-native";

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

const DropDownNewCompoenet = ({
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
      <Text style={styles.labelTextStyle}>{label}</Text>
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
          labelField={"name"}
          valueField={"name"}
          renderInputSearch={(onSearch: (text: string) => void) => {
            return (
              <TextInput
                onChangeText={onSearch}
                placeholder={searchPlaceholder}
                style={styles.searchInputStyle}
                placeholderTextColor={colors.gray79}
              />
            );
          }}
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
                <Text style={styles.inputStyle}>{res?.name}</Text>
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
      marginTop: hp(1.5),
      marginBottom: hp(0.7),
    },
    inputContainer: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.graya8,
      height: 40,
      marginBottom: 15,
    },
    inputStyle: {
      flex: 1,
      ...commonFontStyle(400, 12, colors.black),
      paddingHorizontal: 10,
    },
    placeholderStyle: {
      flex: 1,
      paddingHorizontal: 10,
      ...commonFontStyle(400, 12, colors.gray79),
    },
    dropdownStyle: {
      flex: 1,
      paddingRight: wp(2.2),
    },
    rowStyle: {
      flexDirection: "row",
      alignItems: "center",
      height: hp(5),
      marginHorizontal: wp(2.5),
      backgroundColor: colors.white,
      width: "100%",
      alignSelf: "center",
    },
    searchInputStyle: {
      backgroundColor: colors.white,
      paddingHorizontal: wp(2),
      ...commonFontStyle(400, 14, colors.black),
    },
  });
};

export default DropDownNewCompoenet;
