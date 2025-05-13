import { FC } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { colors } from "../theme/colors";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import { commonFontStyle, hp } from "../theme/fonts";
import { BackIcon, MenuIcon } from "../assets/Icons";
import MovementScreen from "../screens/MovementScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../screens/ProfileScreen";
import SettingScreen from "../screens/SettingScreen";
import ThemeScreen from "../screens/ThemeScreen";

import LoginScreen from "../screens/LoginScreen";
import AddPilotScreen from "../screens/AddPilotScreen";
import AddVehicalScreen from "../screens/AddVehicalScreen";
import AddAgencyScreen from "../screens/AddAgencyScreen";
import AgenciesScreen from "../screens/AgenciesScreen";
import DriversScreen from "../screens/DriversScreen";
import VehiclesScreen from "../screens/VehiclesScreen";
import { icons } from "../utils/Icon";
import AddMovement from "../screens/AddMovement";
import DriverHomeScreen from "../screens/Driver/DriverHomeScreen";
import AgencyCustomDrawer from "../compoment/DrawerContent/AgencyCustomDrawer";
import DriverCustomDrawer from "../compoment/DrawerContent/DriverCustomDrawer";
import DriverAddMovement from "../screens/Driver/DriverAddMovement";
import DriverMovement from "../screens/Driver/DriverMovement";
import AgencyHomeScreen from "../screens/Agency/AgencyHomeScreen";
import AgencyAddMovement from "../screens/Agency/AgencyAddMovement";
import AgencyMovementScreen from "../screens/Agency/AgencyMovementScreen";
import AgencyListMovement from "../screens/Agency/AgencyListMovement";
import RegisterAgency from "../screens/Agency/RegisterAgency";
import Loading from "../screens/Loading";
import NewMovement from "../screens/Driver/NewMovement";
import PrivacyPolicy from "../screens/PrivacyPolicy";

const Drawer = createDrawerNavigator();

function MyDriverDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DriverCustomDrawer {...props} />}
    >
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Movements",
          headerLeft: () => <HeaderLeftDrawerMenu navigation={navigation} />,
        })}
        name="DriverHomeScreen"
        component={DriverHomeScreen}
      />
    </Drawer.Navigator>
  );
}
function MyAgencyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DriverCustomDrawer {...props} />}
    >
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Dashboard",
          headerLeft: () => <HeaderLeftDrawerMenu navigation={navigation} />,
        })}
        name="AgencyHomeScreen"
        component={AgencyHomeScreen}
      />
    </Drawer.Navigator>
  );
}
function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AgencyCustomDrawer {...props} />}
    >
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Dashboard",
          headerLeft: () => <HeaderLeftDrawerMenu navigation={navigation} />,
        })}
        name="HomeScreen"
        component={HomeScreen}
      />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Movements",
          headerLeft: () => <HeaderLeftDrawerMenu navigation={navigation} />,
        })}
        name="DriverHomeScreen"
        component={DriverHomeScreen}
      />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Profile",
          headerLeft: () => <HeaderLeftDrawerMenu navigation={navigation} />,
        })}
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Setting",
          headerLeft: () => <HeaderLeftDrawerMenu navigation={navigation} />,
        })}
        name="SettingScreen"
        component={SettingScreen}
      />
      <Drawer.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Theme",
          headerLeft: () => <HeaderLeftDrawerMenu navigation={navigation} />,
        })}
        name="ThemeScreen"
        component={ThemeScreen}
      />
    </Drawer.Navigator>
  );
}

const headerStyleTransparent = {
  headerStyle: {
    backgroundColor: colors.black37,
    shadowOpacity: 0,
    elevation: 0,
    borderBottomColor: "transparent",
    borderBottomWidth: 0,
    // height: Platform.OS == 'ios' ?  100 :0
  },
  headerTitleStyle: {
    ...commonFontStyle(700, 24, colors.white),
  },
  // ...TransitionPresets.SlideFromRightIOS,
};
const Stack = createStackNavigator<RootStackParamList>();
const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: hp(2),
  },
  headerDrawer: {
    flexDirection: "row",
    marginVertical: hp(2),
    alignItems: "center",
    paddingHorizontal: hp(3),
  },
  avatarIcon: {
    height: 40,
    width: 40,
    marginRight: 10,
  },
  hoLine: {
    height: 1,
    backgroundColor: colors.graye9,
    marginHorizontal: hp(2),
    marginBottom: hp(1),
  },
  drawerItem: {
    flexDirection: "row",
    paddingHorizontal: hp(3),
    paddingVertical: hp(1),
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginLeft:10
  },
  notificationIcon: {
    width: 30,
    height: 30,
  },
});

const HeaderLeftDrawerMenu = ({ navigation }: any) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={styles.headerLeft}
    >
      <MenuIcon />
    </TouchableOpacity>
  );
};

const HeaderLeftBack = ({ navigation, props }: any) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerLeft}
      >
        <BackIcon />
      </TouchableOpacity>
      {props && <Image source={icons.bpolicelogo} style={styles.iconStyle} />}
    </View>
  );
};

const StackNavigator: FC = () => {
  const { movementID } = useAppSelector((state) => state.common);

  return (
    <Stack.Navigator initialRouteName={"Loading"}>
      <Stack.Screen
        // @ts-ignore
        name={"Loading"}
        component={Loading}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name={"MyDrawer"}
        component={MyDrawer}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name={"MyDriverDrawer"}
        component={MyDriverDrawer}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name={"MyAgencyDrawer"}
        component={MyAgencyDrawer}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Movements",
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"MovementScreen"}
        component={MovementScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name={"LoginScreen"}
        component={LoginScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerTitle: "Add Pilot",
          ...headerStyleTransparent,
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerShadowVisible: false,
          headerLeft: null,
          headerTitleAlign: "center",
          headerTitleStyle: {
            ...commonFontStyle(700, 16, colors.main3f),
          },
        })}
        name={"AddPilotScreen"}
        component={AddPilotScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerTitle: "Add Vehicle",
          ...headerStyleTransparent,
          headerStyle: { backgroundColor: colors.white },
          headerShadowVisible: false,
          headerLeft: null,
          headerTitleAlign: "center",
          headerTitleStyle: {
            ...commonFontStyle(700, 16, colors.main3f),
          },
        })}
        name={"AddVehicalScreen"}
        component={AddVehicalScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerTitle: "Add Agency",
          ...headerStyleTransparent,
          headerStyle: { backgroundColor: colors.white },
          headerShadowVisible: false,
          headerLeft: null,
          headerTitleAlign: "center",
          headerTitleStyle: {
            ...commonFontStyle(700, 16, colors.main3f),
          },
        })}
        name={"AddAgencyScreen"}
        component={AddAgencyScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Add Movement",
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"AddMovement"}
        component={AddMovement}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Add Movement",
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"DriverAddMovement"}
        component={DriverAddMovement}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Add Movement",
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"AgencyAddMovement"}
        component={AgencyAddMovement}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: `Movement #${movementID}`,
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"AgencyMovement"}
        component={DriverMovement}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Movements",
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"AgencyMovementScreen"}
        component={AgencyMovementScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: `Movement #${movementID}`,
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"AuthorityMovement"}
        component={DriverMovement}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: `Movement #${movementID}`,
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"DriverMovement"}
        component={DriverMovement}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: `Movement #${movementID}`,
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"NewMovement"}
        component={NewMovement}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Movement",
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"AgencyListMovement"}
        component={AgencyListMovement}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Agencies",
          headerLeft: () => <HeaderLeftBack navigation={navigation} />,
        })}
        name={"AgenciesScreen"}
        component={AgenciesScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Vehicles",
          headerLeft: (props) => (
            <HeaderLeftBack navigation={navigation} props={true} />
          ),
        })}
        name={"VehiclesScreen"}
        component={VehiclesScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitleStyle: {
            ...commonFontStyle(700, 18, colors.white),
            marginLeft:5
          },
          headerTitle: "Privacy Policy and Terms",
          headerLeft: (props) => (
            <HeaderLeftBack navigation={navigation} props={true} />
          ),
        })}
        name={"PrivacyPolicy"}
        component={PrivacyPolicy}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          ...headerStyleTransparent,
          headerTitle: "Drivers",
          headerLeft: (props) => (
            <HeaderLeftBack navigation={navigation} props={true} />
          ),
        })}
        name={"DriversScreen"}
        component={DriversScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          headerShown: false,
        })}
        name={"RegisterAgency"}
        component={RegisterAgency}
      />
    </Stack.Navigator>
  );
};
export default StackNavigator;

export type RootStackParamList = {
  Loading: undefined;
  HomeScreen: undefined;
  MovementScreen: undefined;
  MyDrawer: undefined;
  ProfileScreen: undefined;
  SettingScreen: undefined;
  ThemeScreen: undefined;
  LoginScreen: undefined;
  AddPilotScreen: undefined;
  AddVehicalScreen: undefined;
  AddAgencyScreen: undefined;
  AddMovement: undefined;
  DriverMovement: undefined;
  DriverHomeScreen: undefined;
};
