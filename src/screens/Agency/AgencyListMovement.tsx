import PagerView from "react-native-pager-view";
import { useNavigation, useTheme } from "@react-navigation/native";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { colors } from "../../theme/colors";
import Loader from "../../compoment/Loader";
import { AppStyles } from "../../theme/appStyles";
import TopTabBar from "../../compoment/TopTabBar";
import { commonFontStyle } from "../../theme/fonts";
import { GET_MOVEMENT_ID } from "../../redux/actionTypes";
import { getMovementAction } from "../../action/movementAction";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import AgencyMovementItem from "../../compoment/AgencyMovementItem";
import NoDataFound from "../../compoment/NoDataFound";

type Props = {};

const AgencyListMovement = (props: Props) => {
  const navigation = useNavigation();
  const viewPager = useRef<any>(null);
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  const { getMovementList } = useAppSelector((state) => state.movement);

  const [isLoading, setIsLoading] = useState(false);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pages, setPages] = useState([
    { page: "Ongoing", id: 0, selected: true },
    { page: "Upcoming", id: 1, selected: false },
    { page: "Past", id: 2, selected: false },
  ]);

  const onPressTab = (i: any) => {
    setPageNumber(1);
    let temp = Object.assign([], pages);
    temp.forEach((element, index: number) => {
      if (i == index) {
        temp[index].selected = true;
        // viewPager.current.setPage(index);
      } else {
        temp[index].selected = false;
      }
    });
    setPages(temp);
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [pages]);

  const getData = () => {
    const updateData = pages.filter((item) => item.selected == true);
    const obj = {
      data: {
        type: updateData[0].page.toLocaleLowerCase(),
      },
      params: { page: pageNumber },
      onSuccess: () => {
        setIsLoading(false);
        setPageNumber(pageNumber + 1);
        setFooterLoading(false);
      },
      onFailure: () => {
        setIsLoading(false);
        setFooterLoading(false);
      },
    };
    dispatch(getMovementAction(obj));
  };

  const loadMore = () => {
    if (!onEndReachedCalled && !footerLoading) {
      setFooterLoading(true);
      setOnEndReachedCalled(true);
      getData();
    }
  };

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      <TopTabBar
        data={pages}
        onPressTab={onPressTab}
        containerStyle={styles.toptabcontainerStyle}
      />
       {getMovementList?.length > 0 ? (
          <FlatList
            data={getMovementList?.sort(
              (a: any, b: any) => b?.movement_id - a?.movement_id
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <AgencyMovementItem
                  data={item}
                  onPress={() => {
                    dispatch({
                      type: GET_MOVEMENT_ID,
                      payload: item?.movement_id,
                    });
                    //@ts-ignore
                    navigation.navigate("DriverMovement", {
                      data: { ...item, userType: "agency" },
                    });
                  }}
                />
              );
            }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            onMomentumScrollBegin={() => setOnEndReachedCalled(false)}
            ListFooterComponent={() => {
              if (footerLoading) {
                return (
                  <ActivityIndicator color={colors.gray79} size={"large"} />
                );
              } else {
                return null;
              }
            }}
          />
        ) : (
          <NoDataFound />
        )}
      {/* <PagerView ref={viewPager} style={styles.pagerView} initialPage={0}>
        {getMovementList?.length > 0 ? (
          <FlatList
            data={getMovementList?.sort(
              (a: any, b: any) => b?.movement_id - a?.movement_id
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <AgencyMovementItem
                  data={item}
                  onPress={() => {
                    dispatch({
                      type: GET_MOVEMENT_ID,
                      payload: item?.movement_id,
                    });
                    //@ts-ignore
                    navigation.navigate("DriverMovement", {
                      data: { ...item, userType: "agency" },
                    });
                  }}
                />
              );
            }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            onMomentumScrollBegin={() => setOnEndReachedCalled(false)}
            ListFooterComponent={() => {
              if (footerLoading) {
                return (
                  <ActivityIndicator color={colors.gray79} size={"large"} />
                );
              } else {
                return null;
              }
            }}
          />
        ) : (
          <NoDataFound />
        )}
      </PagerView> */}
    </View>
  );
};

export default AgencyListMovement;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    pagerView: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    tabView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    tabElement: {
      borderBottomWidth: 1,
      flex: 1,
      alignItems: "center",
      paddingVertical: 5,
      flexDirection: "row",
      justifyContent: "center",
    },
    tabText: {
      ...commonFontStyle(400, 16, colors.main3f),
    },
    notiView: {
      backgroundColor: colors.redLight,
      borderRadius: 100,
      marginLeft: 5,
    },
    numberText: {
      ...commonFontStyle(500, 12, colors.redDark),
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    toptabcontainerStyle: {
      marginTop: 0,
    },
  });
};
