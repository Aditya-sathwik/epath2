import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import AgencyItem from "../compoment/AgencyItem";
import { hp, commonFontStyle } from "../theme/fonts";
import { getAgenciesAction } from "../action/commonAction";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Loader from "../compoment/Loader";
import NoDataFound from "../compoment/NoDataFound";
import { useTheme } from "@react-navigation/native";

type Props = {};

const AgenciesScreen = (props: Props) => {
  const dispatch = useAppDispatch();
  const { getAgenciesData } = useAppSelector((state) => state.common);
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const obj = {
      onSuccess: () => setIsLoading(false),
      onFailure: () => setIsLoading(false),
    };
    dispatch(getAgenciesAction(obj));
  }, []);

  return (
    <View style={styles.cotainer}>
      <Loader visible={isLoading} />
      {getAgenciesData?.length > 0 ? (
        <FlatList
          style={{ flex: 1 }}
          data={getAgenciesData}
          renderItem={({ item, index }) => {
            return <AgencyItem data={item} />;
          }}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{ height: 50 }} />}
        />
      ) : (
        <NoDataFound />
      )}
    </View>
  );
};

export default AgenciesScreen;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    cotainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    iconMainView: {
      flexDirection: "row",
    },
    loginBtn: {
      alignSelf: "center",
      width: "35%",
      alignItems: "center",
      borderRadius: 3,
      paddingVertical: 10,
      marginTop: hp(4),
    },
    AddBtn: {
      alignSelf: "center",
      width: "30%",
      alignItems: "center",
      borderRadius: 3,
      paddingVertical: 8,
      marginTop: hp(2),
      backgroundColor: colors.main3f,
    },
    mainView: {
      borderWidth: 1,
      paddingTop: 11,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderColor: colors.graya8,
      marginHorizontal: 24,
      paddingBottom: 10,
      marginTop: 10,
    },
    btnText: {
      ...commonFontStyle(500, 12, colors.white),
    },
    btnAddText: {
      ...commonFontStyle(500, 10, colors.white),
    },
    bodyView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    nameText: {
      ...commonFontStyle(500, 12, colors.black1e),
      lineHeight: 18,
    },
    nameTextValue: {
      ...commonFontStyle(500, 12, colors.black1e),
      opacity: 0.56,
      lineHeight: 18,
    },
    agencyText: {
      ...commonFontStyle(500, 12, colors.black1e),
      opacity: 0.56,
      lineHeight: 18,
    },
    agencyTextValue: {
      ...commonFontStyle(500, 12, colors.black1e),
      opacity: 0.56,
      lineHeight: 18,
    },
  });
};
