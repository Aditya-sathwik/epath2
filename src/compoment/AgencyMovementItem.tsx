import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../theme/colors";
import { hp, commonFontStyle } from "../theme/fonts";
import { AppStyles } from "../theme/appStyles";
import { icons } from "../utils/Icon";
import { useNavigation, useTheme } from "@react-navigation/native";
import moment from "moment";
import { useAppDispatch } from "../redux/hooks";
import {
  getAgenciesDetailsAction,
  getPilotDetailsAction,
} from "../action/commonAction";

type Props = {
  data: any;
  onPress: () => void;
};

const AgencyMovementItem = (props: Props) => {
  const { data } = props;
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  return (
    <TouchableOpacity style={styles.mainView} onPress={props?.onPress}>
      <View style={styles.rowView}>
        <Text style={styles.hederText}>Start</Text>
        {/* </View> */}
        <Text style={styles.valueText}>#{data?.movement_id}</Text>
        <Text style={styles.hederText}>End</Text>
      </View>
      <View style={styles.rowView}>
        <View style={AppStyles.flex}>
          <Text style={styles.itemText} numberOfLines={2}>
            {data?.origin_address}
          </Text>
        </View>
        <View style={[AppStyles.flex, { alignItems: "flex-end" }]}>
          <Text style={styles.itemText} numberOfLines={2}>
            {data?.destination_address}
          </Text>
        </View>
      </View>
      <View style={[styles.rowView, { paddingVertical: 8 }]}>
        <View
          style={[
            AppStyles.flex,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={icons.User} style={styles.UserIcon} />
            <View style={styles.meneView}>
              <Text style={styles.menuText}>{data?.agency_name}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 7,
            }}
          >
            <Image source={icons.sportscar} style={styles.sportscar} />
            <View style={styles.meneView}>
              <Text style={styles.menuText}>{data?.vehicle_number}</Text>
            </View>
          </View>
        </View>
        <View style={[AppStyles.flex, { alignItems: "flex-end" }]}>
          <Text style={styles.itemText}>{data?.agency_name}</Text>
        </View>
      </View>
      <View style={styles.rowView}>
        <Text style={styles.valueText2}>
          {moment(
            data?.status === "upcoming"
              ? data?.planned_start_time
              : data?.actual_start_time
          )
            .tz("Asia/Kolkata")
            .format("MMM D h:mm a")}
        </Text>
        <Text style={[styles.valueText2]}>{`${(
          data?.travel_distance / 1000
        )?.toFixed(2)} KM`}</Text>
        {!(data?.status === "ongoing") && (
          <Text style={styles.valueText2}>
            {moment(
              data?.status === "upcoming"
                ? data?.planned_end_time
                : data?.actual_end_time
            )
              .tz("Asia/Kolkata")
              .format("MMM D h:mm a")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AgencyMovementItem;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    mainView: {
      borderColor: colors.grayd3,
      borderWidth: 1,
      marginTop: hp(2),
      borderRadius: 10,
      paddingHorizontal: hp(1),
      paddingTop: hp(1),
      paddingBottom: hp(1.5),
    },
    rowView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTextView: {
      backgroundColor: colors.grayd9,
      borderRadius: 5,
      paddingHorizontal: 7,
      paddingVertical: 4,
    },
    UserIcon: {
      width: 8,
      height: 8,
    },
    sportscar: {
      width: 10,
      height: 12,
    },
    meneView: {
      backgroundColor: colors.grayd9,
      paddingVertical: 3,
      paddingHorizontal: 5,
      borderRadius: 4,
      marginLeft: 4,
    },
    hederText: {
      ...commonFontStyle(600, 8, colors.black75),
    },
    menuText: {
      ...commonFontStyle(500, 8, colors.black75),
    },
    itemText: {
      ...commonFontStyle(400, 10, colors.black33),
      marginVertical: hp(0.4),
    },
    valueText: {
      ...commonFontStyle(600, 10, colors.black),
      marginVertical: hp(0.4),
    },
    calenderView: {
      flexDirection: "row",
      alignItems: "center",
    },
    valueText2: {
      ...commonFontStyle(500, 11, colors.black33),
      marginLeft: 5,
    },
  });
};
