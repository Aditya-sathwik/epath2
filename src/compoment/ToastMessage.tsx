//import liraries
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { commonFontStyle, hp, SCREEN_WIDTH } from "../theme/fonts";
import { colors } from "../theme/colors";
import { useTheme } from "@react-navigation/native";
import { useAppSelector } from "../redux/hooks";

const ToastMessage = (props, ref) => {
  const { colors } = useTheme();
  const { isDarkTheme } = useAppSelector((state) => state.common);
  const styles = React.useMemo(() => getGlobalStyles({ colors,isDarkTheme }), [colors,isDarkTheme]);

  const { fontValue } = useSelector((state) => state.auth);

  const toastConfig = {
    info: ({ text1, text2, type, props, ...rest }: any) =>
      type === "info" && (
        <View style={styles.textStyleToastInfo}>
          <Text style={styles.textStyleToast}>{text1}</Text>
        </View>
      ),
    success: ({ text1, text2, type, props, ...rest }: any) =>
      type === "success" && (
        <View style={styles.textStyleToastSuccess}>
          <Text style={styles.textStyleToast}>{text1}</Text>
        </View>
      ),
    error: ({ text1, text2, type, props, ...rest }: any) => {
      console.log('type',type);
      
      if (type === "error") {
        return (
          <View style={styles.toastStyle}>
            <Text style={styles.textStyleToast}>{text1}</Text>
          </View>
        );
      }
    },
  };

  return (
    <Toast
          // ref={ref => Toast.setRef(ref)}
          config={toastConfig}
          position="bottom"
          visibilityTime={1500}
        />
  );
};

const getGlobalStyles = (props: any) => {
  const { colors,isDarkTheme } = props;
  return StyleSheet.create({
    toastStyle: {
      backgroundColor:!isDarkTheme ? "#fff"  : "#000"  ,
      paddingVertical: 15,
      paddingLeft: 10,
      paddingRight: 20,
      borderRadius: 5,
      borderLeftWidth: 6,
      borderLeftColor: "red",
      borderWidth: 1.5,
      borderColor: "red",
      width: SCREEN_WIDTH - hp(6),
      zIndex: 1,
    },
    textStyleToastSuccess: {
      backgroundColor:!isDarkTheme ? "#fff"  : "#000"  ,
      paddingVertical: 15,
      paddingLeft: 10,
      paddingRight: 20,
      borderRadius: 5,
      borderLeftWidth: 6,
      borderLeftColor: "green",
      borderWidth: 1.5,
      borderColor: "green",
      width: SCREEN_WIDTH - hp(6),
      zIndex: 1,
    },
    textStyleToastInfo: {
      backgroundColor:!isDarkTheme ? "#fff"  : "#000"  ,
      paddingVertical: 15,
      paddingLeft: 10,
      paddingRight: 20,
      borderRadius: 5,
      borderLeftWidth: 6,
      borderLeftColor: "green",
      borderWidth: 1.5,
      borderColor: "green",
      width: SCREEN_WIDTH - hp(6),
      zIndex: 1,
    },
    textStyleToast: {
      // marginLeft: hp(2),
      ...commonFontStyle(700, 14,isDarkTheme ? "#fff"  : "#000"  ),
    },
  });
};

export default ToastMessage;
