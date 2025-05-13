import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { hp } from "../theme/fonts";
import { colors } from "../theme/colors";
import { useNavigation, useTheme } from "@react-navigation/native";
import AddAgencyModal from "./AddAgencyModal";
import AddVehicalModal from "./AddVehicalModal";
import AddPilotModal from "./AddPilotModal";
import { infoToast } from "../utils/globalFunctions";

interface FloatingButtonProps extends ViewProps {
  onPress: () => void;
  onAgenice: boolean;
}

export function FloatingButton({
  onPress,
  style,
  onAgenice,
  ...rest
}: FloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [addAgencyModal, setAddAgencyModal] = useState(false);
  const [addVehicalModal, setAddVehicalModal] = useState(false);
  const [addPilotModal, setAddPilotModal] = useState(false);
  const animation = useSharedValue(0);
  const navigation = useNavigation();

  const rotationAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(isOpen ? "45deg" : "0deg"),
        },
      ],
    };
  });

  const pinAnimatedStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      animation.value,
      [0, 1],
      [0, -20],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          scale: withSpring(animation.value),
        },
        {
          translateY: withSpring(translateYAnimation),
        },
      ],
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      animation.value,
      [0, 1],
      [0, -30],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          scale: withSpring(animation.value),
        },
        {
          translateY: withSpring(translateYAnimation),
        },
      ],
    };
  });

  const heartAnimatedStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      animation.value,
      [0, 1],
      [0, -40],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          scale: withSpring(animation.value),
        },
        {
          translateY: withSpring(translateYAnimation),
        },
      ],
    };
  });

  const heart2AnimatedStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      animation.value,
      [0, 1],
      [0, -50],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          scale: withSpring(animation.value),
        },
        {
          translateY: withSpring(translateYAnimation),
        },
      ],
    };
  });

  const opacityAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      animation.value,
      [0, 0.5, 1],
      [0, 0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity: withSpring(opacityAnimation),
    };
  });

  function toggleMenu() {
    onPress();
    setIsOpen((current) => {
      animation.value = current ? 0 : 1;
      return !current;
    });
  }

  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  return (
    <View style={[styles.container, style]} {...rest}>
      <SafeAreaView>
        {!onAgenice && (
          <TouchableOpacity
            onPress={() => {
              setAddAgencyModal(true);
            }}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.button,
                styles.secondary,
                heart2AnimatedStyle,
                opacityAnimatedStyle,
              ]}
            >
              <Image
                style={styles.imageIcon}
                source={require("../assets/public.png")}
              />
            </Animated.View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            setAddVehicalModal(true);
          }}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.button,
              styles.secondary,
              heartAnimatedStyle,
              opacityAnimatedStyle,
            ]}
          >
            <Image
              style={styles.imageIcon}
              source={require("../assets/car.png")}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setAddPilotModal(true);
          }}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.button,
              styles.secondary,
              thumbAnimatedStyle,
              opacityAnimatedStyle,
            ]}
          >
            <Image
              style={styles.imageIcon}
              source={require("../assets/driving.png")}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(
              onAgenice ? "AgencyAddMovement" : "AddMovement"
            ),
              toggleMenu();
          }}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.button,
              styles.secondary,
              pinAnimatedStyle,
              opacityAnimatedStyle,
            ]}
          >
            <Image
              style={styles.imageIcon}
              source={require("../assets/movement.png")}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={toggleMenu}>
          <Animated.View
            style={[styles.button, styles.menu, rotationAnimatedStyle]}
          >
            <Image
              style={styles.imageIcon}
              source={require("../assets/plus.png")}
            />
          </Animated.View>
        </TouchableOpacity>
        <AddAgencyModal
          isVisible={addAgencyModal}
          onPressCancel={(success) => {
            setAddAgencyModal(false);
            if (success) {
              infoToast("Profile created successfully");
            } else {
              infoToast("Profile creation unsuccessfull");
            }
          }}
        />
        <AddVehicalModal
          isVisible={addVehicalModal}
          onPressCancel={() => {
            setAddVehicalModal(false);
          }}
        />
        <AddPilotModal
          isVisible={addPilotModal}
          onPressCancel={() => {
            setAddPilotModal(false);
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      right: 0,
      margin: hp(2),
    },
    button: {
      width: 64,
      height: 64,
      borderRadius: 64 / 2,
      alignItems: "center",
      justifyContent: "center",
      shadowRadius: 10,
      shadowColor: colors.black,
      shadowOpacity: 0.2,
      shadowOffset: { height: 10, width: 0 },
      elevation: 10,
    },
    menu: {
      backgroundColor: colors.main3f,
    },
    secondary: {
      width: 55,
      height: 55,
      borderRadius: 55 / 2,
      backgroundColor: colors.white,
    },
    imageIcon: {
      width: 30,
      height: 30,
      resizeMode: "contain",
    },
  });
};
