import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { commonFontStyle, hp, wp } from "../theme/fonts";
import { colors } from "../theme/colors";
import { useAppDispatch } from "../redux/hooks";
import {
  getGoogleAutoAddress,
  getGooglePlaceIDByLatlng,
} from "../action/commonAction";
import { useTheme } from "@react-navigation/native";

type props = {
  value: string;
  placeholder: string;
  onGetData: (value: any) => void;
  onChangeText: (value: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  selection?: any;
  inputRef?: any;
};

const GoogleAddressSearch = ({
  value,
  onGetData,
  placeholder,
  onChangeText,
  onFocus,
  onBlur,
  selection,
  inputRef,
}: props) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  const getSearch = (text: string) => {
    setIsLoading(true);
    let obj = {
      search: text,
      onSuccess: (res: any) => {
        setIsLoading(false);
        setList(res?.predictions || []);
      },
      onFailure: () => {
        setIsLoading(false);
      },
    };
    dispatch(getGoogleAutoAddress(obj));
  };

  const usingPlaceIdGetDetails = (item: any) => {
    setIsLoading(true);
    let obj = {
      place_id: item?.place_id,
      onSuccess: (res: any) => {
        setIsLoading(false);
        onGetData({
          location: res?.result?.geometry?.location,
          address: item.description,
        });
        setList([]);
      },
      onFailure: () => {
        setIsLoading(false);
      },
    };
    dispatch(getGooglePlaceIDByLatlng(obj));
  };

  return (
    <View style={{zIndex: 1,}}>
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          style={styles.inputStyle}
          value={value}
          onChangeText={(text) => {
            if (text?.length === 0) {
              setList([]);
            }
            getSearch(text);
            onChangeText(text);
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          selection={selection}
          placeholderTextColor={colors.gray5d}
        />
        {isLoading ? <ActivityIndicator size={"small"} /> : null}
      </View>
      <FlatList
        data={list}
        style={styles.listContainerStyle}
        keyboardShouldPersistTaps={"handled"}
        renderItem={({ item, index }: any) => {
          return (
            <TouchableOpacity
              onPress={() => usingPlaceIdGetDetails(item)}
              style={styles.itemlistContainerStyle}
            >
              <Text style={styles.addressTextStyle}>{item?.description}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      marginVertical: 5,
      height: hp(5),
      backgroundColor: colors.graye6,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp(3),
    },
    inputStyle: {
      ...commonFontStyle(500, 14, colors.black),
      paddingRight: wp(4),
      flex: 1,
      margin: 0,
    },
    addressTextStyle: {
      ...commonFontStyle(500, 13, colors.black),
    },
    itemlistContainerStyle: {
      paddingVertical: hp(1),
      paddingHorizontal: wp(2),
      borderBottomWidth: 1,
      borderBottomColor: colors.graye6,
    },
    listContainerStyle: {
      position: "absolute",
      zIndex: 1,
      backgroundColor: colors.white,
      marginTop: hp(5.5),
      width: "100%",
    },
    mainContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
};

export default GoogleAddressSearch;
