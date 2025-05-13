import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { commonFontStyle } from "../theme/fonts";
import { convertMinutesToHHMMSS } from "../utils/globalFunctions";
import { Image } from "react-native";
import { icons } from "../utils/Icon";
import { colors } from "../theme/colors";
import moment from "moment";

type props = {
  travel_distance: number;
  actual_end_time: string;
  actual_start_time: string;
};

const PastBottomView = ({
  travel_distance,
  actual_end_time,
  actual_start_time,
}: props) => {
  return (
    <View style={styles.footerView}>
      <View>
        {/* <Image source={icons.sportsPin} style={styles.iconStyle} /> */}
        <Text style={styles.distanceTextStyle}>{"Travel Distance"}</Text>
        <Text style={styles.iconText}>
          {(travel_distance / 1000)?.toFixed(2)} Km
        </Text>
      </View>
      <View>
        <Image source={icons.ontime} style={styles.iconStyle} />
        <Text style={styles.iconText}>
          {convertMinutesToHHMMSS(
            Math.ceil(
              moment(actual_end_time).diff(
                moment(actual_start_time),
                "seconds"
              ) / 60
            )
          )}{" "}
          min
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerView: {
    backgroundColor: colors.main3f,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  footerBody: {
    alignSelf: "center",
  },
  minText: {
    ...commonFontStyle(600, 14, colors.white),
    textAlign: "center",
  },
  minKmText: {
    ...commonFontStyle(600, 14, colors.white),
  },
  footerBtnText: {
    ...commonFontStyle(600, 14, colors.white),
  },
  iconStyle: {
    width: 24,
    height: 24,
    alignSelf: "center",
    tintColor: colors.white,
  },
  iconText: {
    ...commonFontStyle(600, 16, colors.white),
  },
  distanceTextStyle: {
    ...commonFontStyle(600, 12, colors.white),
  },
});

export default PastBottomView;
