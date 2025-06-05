import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../theme/colors";
import { SCREEN_WIDTH, hp, commonFontStyle, wp } from "../theme/fonts";
import { icons } from "../utils/Icon";
import { useAppDispatch } from "../redux/hooks";
import { getAgenciesDetailsAction } from "../action/commonAction";
import { api } from "../utils/apiConstants";
import { countAge } from "../utils/globalFunctions";
import { useTheme } from "@react-navigation/native";

const DriversList = ({ driver, onUserImagePress, data }: any) => {
  const dispatch = useAppDispatch();
  const [ageData, setAgeData] = useState("");
  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
console.log('data?.agency_id',data?.agency_id);

  useEffect(() => {
    if(data?.agency_id){
      const obj = {
        params: data?.agency_id,
        onSuccess: (res) => {
          setAgeData(res?.name);
        },
        onFailure: () => {},
      };
      dispatch(getAgenciesDetailsAction(obj));
    }
  }, []);  

  return (
    // <View style={styles.cardView}>
    <View style={styles.innerView}>
      <View>
        <View style={styles.headerCard}>
          <TouchableOpacity onPress={onUserImagePress}>
            <Image
              style={styles.iconStyle}
              source={{ uri:  data?.photos }}
            />
          </TouchableOpacity>
          <Text style={styles.btnText}>
            Status: <Text style={{ color: colors.main3f }}>{data?.status}</Text>
          </Text>
        </View>
      </View>
      <View>
        <Text style={styles.profileText}>{data?.owner || data?.name}</Text>

        {driver && (
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}
          >
            <Text style={[styles.maleText, { textTransform: "capitalize" }]}>
              {data?.gender}
            </Text>
            <View style={styles.spasLine} />
            <Text style={styles.ageText}>{countAge(data?.dob)}</Text>
            <View style={styles.spasLine} />
            {data?.experience && <Text style={styles.expText}>Exp :{`${data?.experience} years`} </Text>}
          </View>
        )}
        {driver ? (
          <View>
            <View style={styles.bodyView}>
              <Image source={icons.agency} style={styles.listIcon} />
              <View style={styles.listView}>
                <Text style={styles.listText}>{ageData}</Text>
              </View>
            </View>
            <View style={styles.footerView}>
              <Image source={icons.drivinglicense} style={styles.listIcon} />
              <View style={styles.listView}>
                <Text style={styles.listText}>
                  {data?.driving_license_number}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.footerView}>
              <Image source={icons.sportscar} style={styles.listIcon} />
              <View style={styles.listView}>
                <Text style={styles.listText}>{data?.vehicle_number}</Text>
              </View>
            </View>

            <View style={styles.bodyView}>
              <Image source={icons.dot} style={styles.dotIcon} />
              <View style={styles.listView}>
                <Text style={styles.listText}>{data?.color}</Text>
              </View>
            </View>
            <View style={styles.bodyView}>
              <Image source={icons.agency} style={styles.listIcon} />
              <View style={styles.listView}>
                <Text style={styles.listText}>{ageData}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default DriversList;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    innerView: {
      borderWidth: 0.5,
      borderColor: colors.grayc2,
      borderRadius: 4,
      backgroundColor: colors.white,
      paddingVertical: 10,
      paddingHorizontal: wp(4),
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp(4),
      marginHorizontal: 24,
      justifyContent: "space-between",
    },
    btnText: {
      ...commonFontStyle(600, 16, colors.black33),
      marginTop: 5,
    },
    profileText: {
      ...commonFontStyle(700, 14, colors.black),
    },
    profileValueText: {
      ...commonFontStyle(600, 12, colors.black1e),
      marginTop: 4,
    },
    iconStyle: {
      width: 89,
      height: 85,
      borderRadius: 20,
      marginRight: wp(6),
      backgroundColor: "#F3F3F3",
    },
    headerCard: {
      // flexDirection: 'row',
      // alignItems: 'center',
    },
    listIcon: {
      width: 19,
      height: 19,
      tintColor: colors.black,
    },
    dotIcon: {
      width: 16,
      height: 16,
      resizeMode: "contain",
      tintColor: colors.black,
    },
    listView: {
      // backgroundColor: colors.grayd9,
      marginLeft: 5,
      borderRadius: 4,
      width: SCREEN_WIDTH * 0.29,
      borderWidth: 1,
      borderColor: colors.grayaeb,
    },
    listText: {
      ...commonFontStyle(600, 10, colors.black),
      paddingVertical: hp(0.7),
      paddingHorizontal: 13,
      textAlign: "center",
    },
    footerView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      marginLeft: 5,
    },
    bodyView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      marginLeft: 5,
    },
    maleText: {
      ...commonFontStyle(600, 12, colors.black),
    },
    ageText: {
      ...commonFontStyle(600, 12, colors.black),
    },
    expText: {
      ...commonFontStyle(600, 12, colors.black),
    },
    spasLine: {
      width: 1,
      height: 10,
      borderWidth: 0.5,
      borderColor: colors.grayaeb,
      marginHorizontal: 5,
    },
  });
};
