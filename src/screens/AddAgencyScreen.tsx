import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { AppStyles } from '../theme/appStyles'
import CommonInput from '../compoment/CommonInput'
import { colors } from '../theme/colors'
import { commonFontStyle, hp } from '../theme/fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native'

type Props = {}

const AddAgencyScreen = (props: Props) => {
    const [agencyData, setAgencyData] = useState({
        agencyName: '',
        representName: '',
        email: '',
        country: 'IN',
        phoneNumber: '',
        address: '',
        username: '',
    })
    const navigation = useNavigation()
    return (
        <KeyboardAwareScrollView style={[AppStyles.mainWhiteContainer, { paddingBottom: hp(2) }]}>
            <View style={AppStyles.mainWhiteContainerPaddingHo}>
                <CommonInput
                    title={'Agency Name'}
                    value={agencyData.agencyName}
                    onChangeText={(text) => setAgencyData({ ...agencyData, agencyName: text })}
                    placeHolder={'Enter Agency Name'}
                    isInfoView={true}
                />
                <CommonInput
                    title={'Representative Name'}
                    value={agencyData.representName}
                    onChangeText={(text) => setAgencyData({ ...agencyData, representName: text })}
                    placeHolder={'Enter Representative Name'}
                    // secureTextEntry={true}
                />
                <CommonInput
                    title={'Email'}
                    value={agencyData.email}
                    onChangeText={(text) => setAgencyData({ ...agencyData, email: text })}
                    placeHolder={'Enter email address'}
                />

                <CommonInput
                    title={'Phone number'}
                    value={agencyData.phoneNumber}
                    onChangeText={(text) => setAgencyData({ ...agencyData, phoneNumber: text })}
                    placeHolder={'Enter Phone number'}
                    type={'phone'}
                    isInfoView={true}
                    country={agencyData.country}
                    setCountry={(text) => setAgencyData({ ...agencyData, country: text })}
                />
                <CommonInput
                    title={'Address'}
                    value={agencyData.address}
                    onChangeText={(text) => setAgencyData({ ...agencyData, address: text })}
                    placeHolder={'Address'}
                    isInfoView={true}
                    multiline={true}
                />
                <CommonInput
                    title={'Username'}
                    value={agencyData.address}
                    onChangeText={(text) => setAgencyData({ ...agencyData, address: text })}
                    placeHolder={'Enter a User name'}
                />


                <View style={[styles.iconMainView, { alignSelf: 'flex-end' }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginBtn}>
                        <Text style={styles.btnText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.loginBtn, { backgroundColor: colors.graye6 }]}>
                        <Text style={[styles.btnText, { color: colors.black1e }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default AddAgencyScreen

const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        ...commonFontStyle(500, 14, colors.black1d),
        marginBottom: 10
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.graya8,
        height: 40,
        marginBottom: 15
    },
    input: {
        flex: 1,
        ...commonFontStyle(400, 12, colors.black1e),
        paddingHorizontal: 10
    },
    imageIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    iconView: {
        borderColor: colors.graye6,
        borderWidth: 1,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    iconMainView: {
        flexDirection: 'row',
    },
    loginBtn: {
        alignSelf: 'center',
        backgroundColor: colors.main3f,
        width: '30%',
        alignItems: 'center',
        borderRadius: 3,
        paddingVertical: 10,
        marginTop: hp(4)
    },
    btnText: {
        ...commonFontStyle(500, 12, colors.white)
    },
})