import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { AppStyles } from '../theme/appStyles'
import CommonInput from '../compoment/CommonInput'
import { colors } from '../theme/colors'
import { commonFontStyle, hp } from '../theme/fonts'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native'
import ImageCropPicker from 'react-native-image-crop-picker'
import DocumentPicker from 'react-native-document-picker'

type Props = {}

const AddVehicalScreen = (props: Props) => {
    const [vehical, setVehical] = useState({
        no: '',
        model: '',
        ownerName: '',
        color: '',
        rcNo: '',
        image: '',
        document: ''
    })
    const navigation = useNavigation()

    const openImage = () => {
        ImageCropPicker.openPicker({
            mediaType: 'photo'
        }).then(image => {
            console.log(image);
            setVehical({ ...vehical, image: image })
        });
    }
    const openFilePicker = async () => {
        try {
            const pickerResult = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
            })
            setVehical({ ...vehical, document: pickerResult })
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <KeyboardAwareScrollView style={[AppStyles.mainWhiteContainer, { paddingBottom: hp(2) }]}>
            <View style={AppStyles.mainWhiteContainerPaddingHo}>
                <CommonInput
                    title={'Vehicle No'}
                    value={vehical.no}
                    onChangeText={(text) => setVehical({ ...vehical, no: text })}
                    placeHolder={'Vehicle No'}
                    isInfoView={true}
                />
                <CommonInput
                    title={'Vehicle Model'}
                    value={vehical.model}
                    onChangeText={(text) => setVehical({ ...vehical, model: text })}
                    placeHolder={'Vehicle Model'}
                    secureTextEntry={true}
                />
                <CommonInput
                    title={'Owner Name'}
                    value={vehical.ownerName}
                    onChangeText={(text) => setVehical({ ...vehical, ownerName: text })}
                    placeHolder={'Owner Name'}
                />

                <CommonInput
                    title={'Vehicle Colour'}
                    value={vehical.color}
                    onChangeText={(text) => setVehical({ ...vehical, color: text })}
                    placeHolder={'Vehicle Colour'}
                    isInfoView={true}
                />
                <CommonInput
                    title={'RC No'}
                    value={vehical.rcNo}
                    onChangeText={(text) => setVehical({ ...vehical, rcNo: text })}
                    placeHolder={'RC No'}
                    isInfoView={true}
                />

                <View style={styles.iconMainView}>
                    <TouchableOpacity onPress={() => openFilePicker()} style={[styles.iconView, { marginRight: 10 }]}>
                        <Image style={styles.imageIcon} source={require('../assets/file.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openImage()} style={styles.iconView}>
                        {vehical.image !== '' ?
                            <Image style={styles.imageIcon} source={{ uri: vehical.sourceURL }} />
                            :
                            <Image style={styles.imageIcon} source={require('../assets/photo.png')} />
                        }
                    </TouchableOpacity>
                </View>
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

export default AddVehicalScreen

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