//import liraries
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ReactNativeModal from "react-native-modal";
import { hp, wp, commonFontStyle } from "../theme/fonts";
import { colors } from "../theme/colors";
import { icons } from "../utils/Icon";
import { useNavigation, useTheme } from "@react-navigation/native";
import PrimaryButton from "./PrimaryButton";
import { convertHourstoMinute } from "../utils/commonFunction";
import moment from "moment";

type Props = {
  onPressCancel?: () => void;
  isVisible: boolean;
  params: any;
  distanceTime: any;
  positionSpeed: any;
};

const DriversMovementFinishedModal = ({
  isVisible,
  onPressCancel,
  params,
  positionSpeed,
  distanceTime,
}: Props) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const ListIcon = ({ icon, value, viewStyle, iconStyle, iconShow }: any) => {
    return (
      <View
        style={[
          { flexDirection: "row", alignItems: "center", marginBottom: 10 },
          viewStyle,
        ]}
      >
        {iconShow && (
          <Image style={[styles.listicon, iconStyle]} source={icon} />
        )}
        <Text style={styles.listText}>{value}</Text>
      </View>
    );
  };
  // console.log(params?.actual_end_time, params?.actual_start_time)

  return (
    <ReactNativeModal isVisible={isVisible}>
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Movement Finished</Text>
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 0 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <View style={{}}>
              <ListIcon
                icon={icons.time}
                value={`${convertHourstoMinute(
                  params?.estimated_travel_time
                )} mins`}
                iconShow={true}
                iconStyle={{ tintColor: colors.black }}
              />
              {/*<ListIcon*/}
              {/*  icon={icons.tachometer}*/}
              {/*  value={`${positionSpeed.toFixed(0)} km /hr`}*/}
              {/*  iconShow={true}*/}
              {/*/>*/}
              <ListIcon
                icon={icons.ontime}
                value={`${Math.ceil(
                  moment(params?.actual_end_time).diff(
                    moment(params?.actual_start_time),
                    "seconds"
                  ) / 60
                )} mins`}
                iconShow={true}
                iconStyle={{ tintColor: colors.black }}
              />
            </View>
            <View style={{}}>
              <ListIcon
                icon={icons.sportsPin}
                value={`${(params?.travel_distance / 1000)?.toFixed(2)} KM`}
                iconShow={true}
              />
            </View>
          </View>
          <PrimaryButton
            label="Go to Movements"
            containerStyle={{
              width: "65%",
              alignSelf: "center",
              marginTop: 10,
              height: hp(4),
            }}
            onPress={() => {
              // navigation.goBack();
              onPressCancel();
            }}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      borderRadius: 25,
      backgroundColor: colors.white,
      paddingBottom: 30,
      marginHorizontal: 40,
    },
    headerCard: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconStyle: {
      width: 95,
      height: 95,
      borderRadius: 20,
      marginRight: 9,
    },
    listicon: {
      height: 18,
      width: 20,
      resizeMode: "contain",
      marginRight: 10,
    },
    listText: {
      ...commonFontStyle(600, 10, colors.black33),
    },

    lineStyle: {
      width: "80%",
      borderWidth: 0.5,
      alignSelf: "center",
      borderColor: colors.grayaeb,
    },
    headerView: {
      backgroundColor: colors.white,
      paddingVertical: 15,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      alignSelf: "center",
    },
    bodyView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 15,
    },
    cancelIcon: {
      width: 16,
      height: 16,
      tintColor: colors.black,
    },
    headerText: {
      ...commonFontStyle(700, 16, colors.black),
      textAlign: "center",
    },
  });
};

export default DriversMovementFinishedModal;
