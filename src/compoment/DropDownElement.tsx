import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { commonFontStyle, hp } from "../theme/fonts";
import { colors } from "../theme/colors";
import { SearchIcon } from "../assets/Icons";
import { icons } from "../utils/Icon";
import { useTheme } from "@react-navigation/native";

type Props = {
  icon: any;
  value: any;
  onChange: (text: any) => void;
  textInputStyle?: TextStyle;
  placeholder: string;
  dataList: any;
  search: string;
  dropDowncontainerStyle: ViewStyle;
};

const DropDownElement = (props: Props) => {
  const [isFocus, setIsFocus] = useState(false);
  const dropdownRef = useRef();

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  return (
    <View>
      <Dropdown
        value={props.value}
        // ref={dropdownRef}
        onChange={(item) => {
          props.onChange(item.vehicle_number || item?.name), setIsFocus(false);
        }}
        data={props?.dataList}
        valueField={props.search}
        labelField={props.search}
        search
        maxHeight={137}
        style={{ height: 40}}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        renderItem={(item) => {
          return (
            <View
              style={{
                ...styles.itemContainer,
                ...props.dropDowncontainerStyle,
              }}
            >
              <Image
                style={styles.avatarIcon}
                source={{ uri: item?.photo || item?.logo }}
              />
              <Text style={{ ...commonFontStyle(400, 14, colors.black) }}>
                {item.vehicle_number || item?.name}
              </Text>
            </View>
          );
        }}
        renderRightIcon={() => (
          <>
            <View
              style={[
                styles.dropDownIcon,
                { backgroundColor: isFocus ? colors.main3f : colors.graye6 },
              ]}
            >
              <Image
                style={{
                  height: props.icon == require("../assets/User.png") ? 15 : 17,
                  width: 17,
                  resizeMode: "contain",
                  tintColor: isFocus ? colors.white : colors.black,
                }}
                source={props.icon}
              />
            </View>
            <View
              style={[
                {
                  backgroundColor: colors.graye6,
                  ...commonFontStyle(500, 9, colors.black),
                  borderRadius: 5,
                  paddingHorizontal: 9,
                  marginLeft: 5,
                  paddingVertical: Platform.OS == "android" ? 0 : 1,
                  width: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  height: 26,
                },
                props.textInputStyle,
              ]}
            >
              <Text
                style={[
                  {
                    ...commonFontStyle(
                      500,
                      12,
                      props.value == "" ? colors.graya9d : colors.black
                    ),
                    flex: 1,
                  },
                ]}
              >
                {props.value}
              </Text>
              <Image
                source={icons.downIcon}
                style={styles.downIconStyle}
                resizeMode="contain"
              />
            </View>
          </>
        )}
        containerStyle={{
          width: 200,
          marginTop: Platform.OS == 'ios' ?  hp(2) :0,
          borderRadius: 15,
          backgroundColor: colors.white,
          ...props.dropDowncontainerStyle,
        }}
        searchPlaceholder={"Search..."}
        renderInputSearch={(onSearch: (text: any) => void) => (
          <View
            style={{
              borderWidth: 3,
              borderRadius: 9,
              padding: 1,
              borderColor: "rgba(0, 122, 255, 0.3)",
              margin: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.blue20,
                borderRadius: 5,
                // height: 32,
                paddingLeft: 10,
              }}
            >
              <SearchIcon />
              <TextInput
                placeholder="Search..."
                placeholderTextColor={colors.gray79}
                style={{
                  height: 26,
                  ...commonFontStyle(400, 14, colors.black1d),
                  flex: 1,
                  paddingHorizontal: 10,
                  padding: 0,
                }}
                onChangeText={(text) => onSearch(text)}
              />
            </View>
          </View>
        )}
        inputSearchStyle={{
          height: 40,
          ...commonFontStyle(400, 14, colors.black1d),
        }}
      />
    </View>
  );
};

export default DropDownElement;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    dropDownIcon: {
      height: 26,
      width: 29,
      backgroundColor: colors.graye6,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    avatarIcon: {
      height: 17,
      width: 17,
      marginRight: 10,
    },
    downIconStyle: {
      height: 10,
      width: 10,
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 10,
      paddingVertical: 3,
      backgroundColor: colors.white,
      width: 200,
      alignSelf: "center",
    },
  });
};
