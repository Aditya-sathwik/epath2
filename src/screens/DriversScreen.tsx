import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../theme/appStyles";
import DriversList from "../compoment/DriversList";
import DriversDetailsModal from "../compoment/DriversDetailsModal";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getPilotAction, getVehicleAction } from "../action/commonAction";
import Loader from "../compoment/Loader";
import NoDataFound from "../compoment/NoDataFound";
import { useTheme } from "@react-navigation/native";

type Props = {};

const DriversScreen = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [driversDetailsModal, setDriversDetailsModal] = useState(false);
  const [driversDetails, setDriversDetails] = useState([]);
  const { getPilotData, getVehicleData } = useAppSelector(
    (state) => state.common
  );
  const dispatch = useAppDispatch();

  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  useEffect(() => {
    setIsLoading(true);
    const obj = {
      onSuccess: () => {
        setIsLoading(false);
      },
      onFailure: () => {
        setIsLoading(false);
      },
    };
    dispatch(getVehicleAction(obj));
    dispatch(getPilotAction(obj));
    // dispatch(getAgenciesAction(obj));
  }, []);


  const reloadDrivers = () => {
  setIsLoading(true);
  const obj = {
    onSuccess: () => setIsLoading(false),
    onFailure: () => setIsLoading(false),
  };
  dispatch(getVehicleAction(obj));
  dispatch(getPilotAction(obj));
};
console.log('getPilotData',getPilotData);

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      {getPilotData?.length > 0 ? (
        <FlatList
          data={getPilotData}
          renderItem={({ item, index }) => {
            return (
              <DriversList
                driver={true}
                data={item}
                onUserImagePress={() => {
                  setDriversDetails(item);
                  setDriversDetailsModal(true);
                }}
              />
            );
          }}
        />
      ) : (
        <NoDataFound />
      )}

<DriversDetailsModal
  isVisible={driversDetailsModal}
  data={driversDetails}
  onPressCancel={() => {
    setDriversDetailsModal(false);
    reloadDrivers(); // <-- reload data when modal closes
  }}
  driver={true}
/>
    </View>
  );
};

export default DriversScreen;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
};
