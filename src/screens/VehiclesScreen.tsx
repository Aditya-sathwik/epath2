import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { hp, commonFontStyle, SCREEN_WIDTH } from "../theme/fonts";
import { icons } from "../utils/Icon";
import { colors } from "../theme/colors";
import { AppStyles } from "../theme/appStyles";
import DriversList from "../compoment/DriversList";
import DriversDetailsModal from "../compoment/DriversDetailsModal";
import VehiclesDetailsModal from "../compoment/VehiclesDetailsModal";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getPilotAction, getVehicleAction } from "../action/commonAction";
import Loader from "../compoment/Loader";
import NoDataFound from "../compoment/NoDataFound";
import { useTheme } from "@react-navigation/native";

type Props = {};

const Items = [
  { name: "Movements", icon: icons.userImg, onClickScreen: "MovementScreen" },
  { name: "Agencies", icon: icons.userImg, onClickScreen: "AgenciesScreen" },
];

const VehiclesScreen = (props: Props) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [driversDetailsModal, setDriversDetailsModal] = useState(false);
  const [driversDetails, setDriversDetails] = useState([]);
  const { getPilotData, getVehicleData } = useAppSelector(
    (state) => state.common
  );

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

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      {getVehicleData?.length > 0 ? (
        <FlatList
          data={getVehicleData}
          renderItem={({ item, index }) => {
            return (
              <DriversList
                driver={false}
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

      <VehiclesDetailsModal
        key={"1"}
        driver={false}
        isVisible={driversDetailsModal}
        data={driversDetails}
        onPressCancel={() => setDriversDetailsModal(false)}
      />
    </View>
  );
};

export default VehiclesScreen;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
};
