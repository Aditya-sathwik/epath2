import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from "react-native";
import ReactNativeModal from "react-native-modal";
import { hp, wp, commonFontStyle, SCREEN_WIDTH } from "../theme/fonts";
import { colors } from "../theme/colors";
import { icons } from "../utils/Icon";
import { useAppDispatch } from "../redux/hooks";
import { getAgenciesDetailsAction,updatePilotAction } from "../action/commonAction";
import { countAge, successToast } from "../utils/globalFunctions";
import { useTheme } from "@react-navigation/native";

type Props = {
  onPressCancel?: () => void;
  isVisible: boolean;
  driver: boolean;
  data: any;
};

const DriversDetailsModal = ({ isVisible, onPressCancel, data }: Props) => {
  const dispatch = useAppDispatch();
  const [ageData, setAgeData] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFields, setEditFields] = useState({
    name: data?.name || "",
    gender: data?.gender || "",
    driving_license_number: data?.driving_license_number || "",
    phone_number: data?.phone_number || "",
    permanent_address: data?.permanent_address || "",
    dob: data?.dob || "",
  });

  const [displayData, setDisplayData] = useState(data);
const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setEditFields({
      name: data?.name || "",
      gender: data?.gender || "",
      driving_license_number: data?.driving_license_number || "",
      phone_number: data?.phone_number || "",
      permanent_address: data?.permanent_address || "",
      dob: data?.dob || "",
    });

    setDisplayData(data);

  }, [data, isVisible]);

  const handleFieldChange = (key: string, value: string) => {
    setEditFields((prev) => ({ ...prev, [key]: value }));
  };


  console.log("Received driver details:", data);



  const validateForm = () => {
  const newErrors: { [key: string]: string } = {};
  if (!editFields.name.trim()) newErrors.name = "Name is required";
  if (!editFields.gender.trim()) newErrors.gender = "Gender is required";
  if (!editFields.dob.trim()) {
    newErrors.dob = "DOB is required";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(editFields.dob.trim())) {
    newErrors.dob = "DOB must be in YYYY-MM-DD format";
  }
  if (!editFields.driving_license_number.trim()) newErrors.driving_license_number = "License number is required";
  if (!editFields.phone_number.trim()) newErrors.phone_number = "Phone number is required";
  if (!editFields.permanent_address.trim()) newErrors.permanent_address = "Address is required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSave = () => {
if (!validateForm()) return;



    const formData = new FormData();
    formData.append("name", editFields.name);
    formData.append("gender", editFields.gender);
    formData.append("driving_license_number", editFields.driving_license_number);
    formData.append("phone_number", editFields.phone_number);
    formData.append("permanent_address", editFields.permanent_address);
    formData.append("agency_id", data?.agency_id?.toString() || "");
    formData.append("dob", editFields?.dob || "");
    // If you have file/image pickers, append them like:
    // formData.append("photos", { uri: ..., name: ..., type: ... });
    // formData.append("driving_licenses", { uri: ..., name: ..., type: ... });

    dispatch(updatePilotAction({
      id: data?.pilot_id, // or data?.pk or whatever your pilot ID field is
      data: formData,
      onSuccess: (res) => {
        setIsEditMode(false);
        console.log('success in updating', res.data);
        successToast('Driver details updated successfully!');
        // Optionally show a toast or refresh data

        setEditFields({
          name: res?.data?.name || "",
          gender: res?.data?.gender || "",
          driving_license_number: res?.data?.driving_license_number || "",
          phone_number: res?.data?.phone_number || "",
          permanent_address: res?.data?.permanent_address || "",
          dob: res?.data?.dob || "",
        });
        setDisplayData(res?.data);
      },
      onFailure: (err) => {
        console.log('error in updating', err)

        // Optionally show an error toast
      },
    }));
  };


  const { colors } = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  useEffect(() => {
    if (data?.agency_id) {
      const obj = {
        params: data?.agency_id,
        onSuccess: (res) => {
          console.log("Agency Details: ", res);
          setAgeData(res?.name);
        },
        onFailure: () => { },
      };
      dispatch(getAgenciesDetailsAction(obj));
    }
  }, [data?.agency_id]);



  const handleCancel = () => {
  setIsEditMode(false);
  setEditFields({
    name: data?.name || "",
    gender: data?.gender || "",
    driving_license_number: data?.driving_license_number || "",
    phone_number: data?.phone_number || "",
    permanent_address: data?.permanent_address || "",
    dob: data?.dob || "",
  });
  if (onPressCancel) onPressCancel();
};

  return (
    <ReactNativeModal
      onBackButtonPress={onPressCancel}
      onBackdropPress={onPressCancel}
      isVisible={isVisible}
      style={{ margin: 0 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: data?.photos }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.nameText}>{data?.name}</Text>
              <Text style={styles.statusText}>
                Status: <Text style={{ color: colors.main3f }}>Available</Text>
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
              <Text style={styles.actionText}>
                {isEditMode ? "Cancel" : "Edit"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressCancel}>
              <Image source={icons.close} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoRow}>
              <Image source={icons.user} style={styles.icon} />
              {isEditMode ? (
                <TextInput
                  value={editFields.name}
                  onChangeText={(text) => handleFieldChange("name", text)}
                  style={styles.input}
                  placeholder="Full Name"
                />
              ) : (
                <Text style={styles.infoText}>{displayData?.name}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Image source={icons.gender} style={styles.icon} />
              {isEditMode ? (
                <TextInput
                  value={editFields.gender}
                  onChangeText={(text) => handleFieldChange("gender", text)}
                  style={styles.input}
                  placeholder="Gender"
                />
              ) : (
                <Text style={styles.infoText}>{displayData?.gender}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Image source={icons.calendar} style={styles.icon} />
              {isEditMode ? (
                <TextInput
                  value={editFields.dob}
                  onChangeText={(text) => handleFieldChange("dob", text)}
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                />
              ) : (
                <Text style={styles.infoText}>{countAge(displayData?.dob)} years</Text>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact & License</Text>
            <View style={styles.infoRow}>
              <Image source={icons.agency} style={styles.icon} />
              <Text style={styles.infoText}>{ageData}</Text>
            </View>
            <View style={styles.infoRow}>
              <Image source={icons.drivinglicense} style={styles.icon} />
              {isEditMode ? (
                <TextInput
                  value={editFields.driving_license_number}
                  onChangeText={(text) => handleFieldChange("driving_license_number", text)}
                  style={styles.input}
                  placeholder="License Number"
                />
              ) : (
                <Text style={styles.infoText}>{displayData?.driving_license_number}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Image source={icons.callIcon} style={styles.icon} />
              {isEditMode ? (
                <TextInput
                  value={editFields.phone_number}
                  onChangeText={(text) => handleFieldChange("phone_number", text)}
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{displayData?.phone_number}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Image source={icons.home} style={styles.icon} />
              {isEditMode ? (
                <TextInput
                  value={editFields.permanent_address}
                  onChangeText={(text) => handleFieldChange("permanent_address", text)}
                  style={[styles.input, styles.addressInput]}
                  placeholder="Permanent Address"
                  multiline
                />
              ) : (
                <Text style={styles.infoText}>{displayData?.permanent_address}</Text>
              )}
            </View>
          </View>
          {isEditMode && (
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </ReactNativeModal>
  );
};

export default DriversDetailsModal;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: hp(10),
      flex: 1,
      borderWidth: 1,
      borderColor: colors.black,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: colors.grayaeb,
    },
    profileSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: colors.grayaeb,
      backgroundColor: "#F3F3F3",
      marginRight: wp(3),
    },
    profileInfo: {
      justifyContent: "center",
    },
    nameText: {
      ...commonFontStyle(600, 16, colors.black),
    },
    statusText: {
      ...commonFontStyle(500, 12, colors.black33),
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionText: {
      ...commonFontStyle(600, 14, colors.main3f),
      marginRight: wp(3),
    },
    closeIcon: {
      width: 18,
      height: 18,
      tintColor: colors.black,
    },
    content: {
      padding: wp(4),
    },
    section: {
      marginBottom: hp(3),
    },
    sectionTitle: {
      ...commonFontStyle(600, 16, colors.black),
      marginBottom: hp(1.5),
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: hp(1),
      borderBottomWidth: 1,
      borderBottomColor: colors.grayaeb,
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: colors.black,
      marginRight: wp(3),
    },
    infoText: {
      ...commonFontStyle(500, 14, colors.black),
      flex: 1,
    },
    input: {
      ...commonFontStyle(500, 14, colors.black),
      flex: 1,
      borderWidth: 1,
      borderColor: colors.grayaeb,
      borderRadius: 6,
      padding: wp(2),
    },
    addressInput: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    saveButton: {
      backgroundColor: colors.main3f,
      borderRadius: 10,
      paddingVertical: hp(2),
      alignItems: "center",
      marginTop: hp(2),
    },
    saveButtonText: {
      ...commonFontStyle(600, 16, colors.white),
    },
  });
};