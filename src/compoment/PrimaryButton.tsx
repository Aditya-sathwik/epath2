//import liraries
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {hp, commonFontStyle, wp} from '../theme/fonts';
import {colors} from '../theme/colors';

export type PrimaryButtonProps = {
  label?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  isAddIconShow?: boolean;
  textStyle?:TextStyle
};
const PrimaryButton = ({
  label,
  onPress,
  containerStyle,
  isAddIconShow,
  textStyle
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}>
      <Text style={[styles.labelTextStyle,textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(4),
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.main3f,
  },
  labelTextStyle: {
    textAlign: 'center',
    ...commonFontStyle(600, 16, colors.white),
  },
  addIconStyle: {
    height: wp(15),
    width: wp(15),
  },
  addIconContainer: {
    height: wp(33),
    width: wp(33),
    alignItems: 'center',
    marginLeft: -wp(20),
    marginRight: wp(20),
    borderRadius: wp(33 / 2),
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});

export default PrimaryButton;
