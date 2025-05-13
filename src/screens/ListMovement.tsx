import PagerView from "react-native-pager-view";
import { useNavigation, useTheme } from "@react-navigation/native";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { colors } from "../theme/colors";
import Loader from "../compoment/Loader";
import TopTabBar from "../compoment/TopTabBar";
import { AppStyles } from "../theme/appStyles";
import MovementItem from "../compoment/MovementItem";
import { commonFontStyle, hp } from "../theme/fonts";
import { GET_MOVEMENT_ID } from "../redux/actionTypes";
import { getMovementAction, getMovementDetailsAction } from "../action/movementAction";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import NoDataFound from "../compoment/NoDataFound";

type Props = {};

const ListMovement = (props: Props) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const viewPager = useRef<any>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [footerLoading, setFooterLoading] = useState(false);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(true);
  const { getMovementList } = useAppSelector((state) => state.movement);

  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  const [pages, setPages] = useState([
    { page: "Ongoing", id: 0, selected: true },
    { page: "Upcoming", id: 1, selected: false },
    { page: "Past", id: 2, selected: false },
  ]);

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [pages]);

  const onPressTab = (i: any) => {
    setPageNumber(1);
    let temp = Object.assign([], pages);
    temp.forEach((element, index) => {
      if (i == index) {
        temp[index].selected = true;
        // viewPager.current.setPage(index);
      } else {
        temp[index].selected = false;
      }
    });
    setPages(temp);
  };

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

   const onPressCard = (item: any) => {
    setIsLoading(true);
      const obj = {
        id: item?.movement_id,
        onSuccess: (res: any) => {
          setIsLoading(false);
          dispatch({ type: GET_MOVEMENT_ID, payload: item?.movement_id });
          //@ts-ignore
          navigation.navigate("DriverMovement", {
            data: { ...res, userType: "authority" },
          });
        },
        onFailure: () => {
          setIsLoading(false);
        },
      };
      dispatch(getMovementDetailsAction(obj));
    };

  return (
    <View style={AppStyles.flex}>
      <Loader visible={isLoading} />
      <TopTabBar
        data={pages}
        onPressTab={onPressTab}
        containerStyle={styles.toptabcontainerStyle}
      />
      {/* <PagerView ref={viewPager} style={styles.pagerView} initialPage={0}> */}
        {getMovementList?.length > 0 ? (
          <FlatList
            data={getMovementList?.sort(
              (a: any, b: any) => b?.movement_id - a?.movement_id
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <MovementItem
                  key={index}
                  data={item}
                  onPress={() => {
                    onPressCard(item)
                    // dispatch({
                    //   type: GET_MOVEMENT_ID,
                    //   payload: item?.movement_id,
                    // });
                    // navigation.navigate("DriverMovement", {
                    //   data: { ...item, userType: "authority" },
                    // });
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
      {/* </PagerView> */}
    </View>
  );
};

export default ListMovement;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    pagerView: {
      flex: 1,
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
