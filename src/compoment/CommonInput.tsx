import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../theme/colors";
import { commonFontStyle, hp } from "../theme/fonts";
import { DownArrowIcon, InfoIcon } from "../assets/Icons";
import CountryPicker from "react-native-country-picker-modal";
import { useTheme } from "@react-navigation/native";

type Props = {
  title: string;
  value: any;
  onChangeText: (text: any) => void;
  placeHolder: string;
  secureTextEntry?: boolean;
  isInfoView?: boolean;
  type?: any;
  country?: any;
  setCountry?: (text: any) => void;
  multiline?: boolean;
};

const CommonInput = (props: Props) => {
  const [countryModal, setcountryModal] = useState(false);
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  if (props.type && props.type == "phone") {
    return (
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <View style={styles.flexRow}>
          <CountryPicker
            onSelect={(country) => {
              props.setCountry(country), setcountryModal(false);
            }}
            countryCode={props.country}
            withFlagButton={false}
            visible={countryModal}
            withFilter={true}
          />
          <TouchableOpacity
            style={styles.countryPickerView}
            onPress={() => setcountryModal(true)}
          >
            <Text style={commonFontStyle(400, 12, colors.black1e1)}>
              {props.country}
            </Text>
            <DownArrowIcon />
          </TouchableOpacity>
          <TextInput
            value={props.value}
            onChangeText={(text) => props.onChangeText(text)}
            placeholder={props.placeHolder}
            placeholderTextColor={colors.gray79}
            style={styles.input}
            keyboardType="phone-pad"
            secureTextEntry={
              props.secureTextEntry ? props.secureTextEntry : false
            }
          />
          {props.isInfoView && (
            <TouchableOpacity style={styles.infoView}>
              <InfoIcon />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  } else
    return (
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <View
          style={[
            styles.flexRow,
            {
              height: props.multiline ? 100 : 40,
              alignItems: props.multiline ? "flex-start" : "center",
            },
          ]}
        >
          <TextInput
            value={props.value}
            onChangeText={(text) => props.onChangeText(text)}
            placeholder={props.placeHolder}
            placeholderTextColor={colors.gray79}
            style={[
              styles.input,
              {
                height: props.multiline ? 100 : 40,
                padding: props.multiline ? 10 : 0,
                textAlignVertical: props.multiline ? "top" : "auto",
              },
            ]}
            multiline={props.multiline}
            secureTextEntry={
              props.secureTextEntry ? props.secureTextEntry : false
            }
           keyboardType={props?.keyboardType}
          />
          {props.isInfoView && (
            <TouchableOpacity style={styles.infoView}>
              <InfoIcon />
            </TouchableOpacity>
          )}
          {props.rightSideView &&props.rightSideView() }
        </View>
      </View>
    );
};

export default CommonInput;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    input: {
      flex: 1,
      ...commonFontStyle(400, 12, colors.black),
      paddingHorizontal: 10,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.graya8,
      height: 40,
      marginBottom: 15,
    },
    title: {
      ...commonFontStyle(500, 14, colors.black1d),
      marginBottom: 10,
      color: colors.black1d,
    },
    infoView: {
      paddingRight: 10,
      height: 40,
      justifyContent: "center",
    },
    countryPickerView: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 10,
    },
  });
};
