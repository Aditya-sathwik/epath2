import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { commonFontStyle, hp } from "../theme/fonts";
import { useTheme } from "@react-navigation/native";

type Props = {
  data: any;
  onPressTab: (value: number) => void;
  containerStyle?: ViewStyle;
};

const TopTabBar = ({ data, onPressTab, containerStyle }: Props) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  return (
    <View style={{ ...styles.tabView, ...containerStyle }}>
      {data.map((item: any, index: number) => {
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabElement,
              {
                borderBottomColor: item.selected
                  ? colors.blue20
                  : colors.graye9,
                marginHorizontal: index == 1 ? hp(1) : 0,
              },
            ]}
            onPress={() => {
              onPressTab(index);
            }}
          >
            <Text
              style={[
                styles.tabText,
                { color: item.selected ? colors.main3f : colors.black33 },
              ]}
            >
              {item?.page}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    tabView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 30,
      marginHorizontal: 16,
    },
    tabElement: {
      borderBottomWidth: 1,
      flex: 1,
      alignItems: "center",
      paddingVertical: 6,
      flexDirection: "row",
      justifyContent: "center",
    },
    tabText: {
      ...commonFontStyle(400, 16, colors.main3f),
    },
  });
};

export default TopTabBar;
