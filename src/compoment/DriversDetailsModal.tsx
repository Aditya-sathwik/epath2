import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Picker } from "react-native";
import ReactNativeModal from "react-native-modal";
import { hp, commonFontStyle, SCREEN_WIDTH } from "../theme/fonts";
import { colors } from "../theme/colors";
import { icons } from "../utils/Icon";
import { useAppDispatch } from "../redux/hooks";
import { getAgenciesDetailsAction } from "../action/commonAction";
import { countAge } from "../utils/globalFunctions";
import { useTheme } from "@react-navigation/native";
import { api } from "../utils/apiConstants";

type Props = {
  onPressCancel?: () => void;
  isVisible: boolean;
  driver: boolean;
  data: any;
  onUpdate?: (updatedData: any) => void;
};

const DriversDetailsModal = ({ isVisible, onPressCancel, data, onUpdate }: Props) => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: data?.name || '',
    agency: data?.agencyName || '',
    gender: data?.gender || 'Male',
    dob: data?.dob || '',
    contact_number: data?.phone_number || '',
    license_number: data?.driving_license_number || '',
    permanent_address: data?.permanent_address || '',
    photo: null,
  });
  const [agencyList, setAgencyList] = useState([]);
  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);

  useEffect(() => {
    if (data?.agency_id) {
      const obj = {
        params: data?.agency_id,
        onSuccess: (res) => {
          setFormData((prev) => ({ ...prev, agency: res?.name || '' }));
        },
        onFailure: () => {},
      };
      dispatch(getAgenciesDetailsAction(obj));
    }
    // Simulate fetching agency list (you may replace this with an actual API call)
    setAgencyList(['Yashoda Hospital', 'Testagency']);
  }, [data?.agency_id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsEditMode(false);
    try {
      const updatedData = {
        name: formData.name,
        agency: formData.agency,
        gender: formData.gender,
        dob: formData.dob,
        phone_number: formData.contact_number,
        driving_license_number: formData.license_number,
        permanent_address: formData.permanent_address,
        // In a real app, you'd handle file upload separately (e.g., via FormData)
        photo: formData.photo ? formData.photo.name : null,
      };

      // API call to update the driver/pilot details
      const response = await api.put(`/drivers/${data?.id}`, updatedData, {
        onSuccess: (res) => {
          console.log("Driver updated successfully:", res);
          if (onUpdate) {
            onUpdate(updatedData);
          }
        },
        onFailure: (error) => {
          console.error("Failed to update driver:", error);
        },
      });

      if (response) {
        console.log("API response:", response);
      }
    } catch (error) {
      console.error("Error updating driver:", error);
    }
  };

  return (
    <ReactNativeModal
      onBackButtonPress={onPressCancel}
      onBackdropPress={onPressCancel}
      isVisible={isVisible}
      style={{ margin: 20 }}
    >
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>View Pilot</Text>
          <TouchableOpacity onPress={onPressCancel}>
            <Image source={icons.close} style={styles.cancelIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.profileImageContainer}>
            {formData.photo ? (
              <Image source={{ uri: URL.createObjectURL(formData.photo) }} style={styles.profileImage} />
            ) : (
              <Image source={{ uri: data?.photos }} style={styles.profileImage} />
            )}
          </View>

          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.labelText}>Pilot Name *</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  placeholder="Pilot Name"
                />
              ) : (
                <Text style={styles.valueText}>{formData.name}</Text>
              )}
            </View>
            <View style={styles.formField}>
              <Text style={styles.labelText}>Agency *</Text>
              {isEditMode ? (
                <Picker
                  selectedValue={formData.agency}
                  onValueChange={(itemValue) => handleInputChange('agency', itemValue)}
                  style={styles.picker}
                >
                  {agencyList.map((agency, index) => (
                    <Picker.Item key={index} label={agency} value={agency} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.valueText}>{formData.agency}</Text>
              )}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.labelText}>Gender *</Text>
              {isEditMode ? (
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              ) : (
                <Text style={styles.valueText}>{formData.gender}</Text>
              )}
            </View>
            <View style={styles.formField}>
              <Text style={styles.labelText}>Date of Birth *</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.dob}
                  onChangeText={(text) => handleInputChange('dob', text)}
                  placeholder="YYYY/MM/DD"
                />
              ) : (
                <Text style={styles.valueText}>{formData.dob}</Text>
              )}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formField}>
              <Text style={styles.labelText}>Contact Number *</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.contact_number}
                  onChangeText={(text) => handleInputChange('contact_number', text)}
                  placeholder="Contact Number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.valueText}>{formData.contact_number}</Text>
              )}
            </View>
            <View style={styles.formField}>
              <Text style={styles.labelText}>License Number *</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.input}
                  value={formData.license_number}
                  onChangeText={(text) => handleInputChange('license_number', text)}
                  placeholder="License Number"
                />
              ) : (
                <Text style={styles.valueText}>{formData.license_number}</Text>
              )}
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.labelText}>Permanent Address *</Text>
            {isEditMode ? (
              <TextInput
                style={[styles.input, { height: 60 }]}
                value={formData.permanent_address}
                onChangeText={(text) => handleInputChange('permanent_address', text)}
                placeholder="Permanent Address"
                multiline
              />
            ) : (
              <Text style={styles.valueText}>{formData.permanent_address}</Text>
            )}
          </View>

          <View style={styles.formField}>
            <Text style={styles.labelText}>Previous Driving License Document: NA</Text>
          </View>

          <View style={styles.formField}>
            <Text style={styles.labelText}>Photo</Text>
            {isEditMode ? (
              <View style={styles.fileInputContainer}>
                <Text style={styles.fileText}>
                  {formData.photo ? formData.photo.name : "No file chosen"}
                </Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.valueText}>{formData.photo ? formData.photo.name : "No file chosen"}</Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF5733' }]}
            onPress={onPressCancel}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          {isEditMode ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF8C00' }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF8C00' }]}
              onPress={() => setIsEditMode(true)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default DriversDetailsModal;

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      borderRadius: 10,
      backgroundColor: colors.white,
      paddingBottom: 20,
      margin: 0,
      borderWidth: 1,
      borderColor: colors.grayaeb,
    },
    headerView: {
      backgroundColor: colors.white,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.grayaeb,
    },
    headerText: {
      ...commonFontStyle(600, 16, colors.black),
    },
    cancelIcon: {
      width: 16,
      height: 16,
      tintColor: colors.black,
    },
    formContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
    },
    profileImageContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "#F3F3F3",
    },
    formRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    formField: {
      flex: 1,
      marginHorizontal: 5,
    },
    labelText: {
      ...commonFontStyle(500, 12, colors.black),
      marginBottom: 5,
    },
    valueText: {
      ...commonFontStyle(400, 14, colors.black),
      padding: 10,
      borderWidth: 1,
      borderColor: colors.grayaeb,
      borderRadius: 5,
      backgroundColor: "#F5F5F5",
    },
    input: {
      ...commonFontStyle(400, 14, colors.black),
      padding: 10,
      borderWidth: 1,
      borderColor: colors.grayaeb,
      borderRadius: 5,
      backgroundColor: colors.white,
    },
    picker: {
      ...commonFontStyle(400, 14, colors.black),
      padding: 10,
      borderWidth: 1,
      borderColor: colors.grayaeb,
      borderRadius: 5,
      backgroundColor: colors.white,
    },
    fileInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.grayaeb,
      borderRadius: 5,
      padding: 10,
    },
    fileText: {
      ...commonFontStyle(400, 14, colors.black),
      flex: 1,
    },
    uploadButton: {
      backgroundColor: "#4A90E2",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    uploadButtonText: {
      ...commonFontStyle(500, 12, colors.white),
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    actionButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonText: {
      ...commonFontStyle(600, 14, colors.white),
      textAlign: "center",
    },
  });
};