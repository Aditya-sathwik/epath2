//import liraries
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import ReactNativeModal from 'react-native-modal';
import {hp, wp, commonFontStyle} from '../theme/fonts';
import {colors} from '../theme/colors';
import {icons} from '../utils/Icon';
import PrimaryButton from './PrimaryButton';

type Props = {
  onPressCancel?:() => void;
  isVisible: boolean;

};

const listData = [
  {id: 1, name: 'Forged documents', icons: icons.warning},
  {id: 2, name: 'Authentication Error', icons: icons.cancel},
  {id: 3, name: 'Mismatched Details', icons: icons.magnifyingglass},
  {id: 4, name: 'Application Error', icons: icons.googledocs},
  {id: 5, name: 'Others', icons: icons.warning},
];

const DeclineAgencyModal = ({isVisible,onPressCancel}: Props) => {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      // onBackdropPress={onPressCancel}
      // onBackButtonPress={onPressCancel}
    >
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.titleTextStyle}>{'Decline Agency'}</Text>
          <TouchableOpacity onPress={onPressCancel}>

          <Image source={icons.close} style={styles.cancelIcon} />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <Text style={styles.headerText}>
            Why do you want to decline agency ?
          </Text>
          {listData.map(item => {
            return (
              <View style={styles.bodyView}>
                <Image source={item?.icons} style={styles.iconStyle} />
                <View
                  style={{
                    borderBottomWidth: 1,
                    flex: 1,
                    borderBottomColor: colors.graya9,
                  }}>
                  <Text style={styles.bodyText}>{item?.name}</Text>
                </View>
              </View>
            );
          })}
          <PrimaryButton
            label="Decline"
            containerStyle={{width: '90%', alignSelf: 'center', marginTop: 21}}
            onPress={onPressCancel}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderRadius: 25,
    backgroundColor: colors.white,
    paddingBottom: 30,
  },
  headerView: {
    backgroundColor: colors.black37,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 40,
    paddingRight: 19,
  },
  bodyView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  cancelIcon: {
    width: 16,
    height: 16,
  },
  iconStyle: {
    width: 12,
    height: 12,
    marginRight: 9,
  },
  titleTextStyle: {
    ...commonFontStyle(400, 20, colors.white),
  },
  bodyText: {
    ...commonFontStyle(500, 14, colors.black2),
    lineHeight: 21,
    paddingBottom: 5,
  },
  headerText: {
    ...commonFontStyle(600, 14, colors.black),
    marginVertical: 15,
  },
  subTitleTextStyle: {
    ...commonFontStyle(400, 16, colors.gray5d),
    marginVertical: hp(10),
    marginBottom: hp(30),
  },
});

export default DeclineAgencyModal;
