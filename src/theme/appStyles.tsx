import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { hp } from "./fonts";

export const AppStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  mainWhiteContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainWhiteContainerPaddingHo: {
    flex: 1,
    paddingHorizontal: hp(2),
    backgroundColor: colors.white,
  },
});
