import React, { useState, useEffect } from 'react';
import ReactNativeModal from "react-native-modal";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { hp, wp, fontSize, commonFontStyle } from "../../theme/fonts";
import { icons } from "../../utils/Icon";

interface EditUserModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  userData: any;
}

const EditUserModal = ({ isVisible, onClose, onSave, userData }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    agency: '',
    gender: '',
    dateOfBirth: new Date(),
    contactNumber: '',
    licenseNumber: '',
    address: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        agency: userData.agency || '',
        gender: userData.gender || '',
        dateOfBirth: new Date(userData.dateOfBirth) || new Date(),
        contactNumber: userData.contactNumber || '',
        licenseNumber: userData.licenseNumber || '',
        address: userData.address || '',
      });
    }
  }, [userData]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const onDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dateOfBirth: selectedDate });
    }
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Edit User Details</Text>
        <ScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Agency</Text>
            <TextInput
              style={styles.input}
              value={formData.agency}
              onChangeText={(text) => setFormData({ ...formData, agency: text })}
              placeholder="Enter agency"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              value={formData.gender}
              onChangeText={(text) => setFormData({ ...formData, gender: text })}
              placeholder="Enter gender"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formData.dateOfBirth.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              value={formData.contactNumber}
              onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
              placeholder="Enter contact number"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>License Number</Text>
            <TextInput
              style={styles.input}
              value={formData.licenseNumber}
              onChangeText={(text) => setFormData({ ...formData, licenseNumber: text })}
              placeholder="Enter license number"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter address"
              multiline
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.dateOfBirth}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
          />
        )}
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#00C851',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditUserModal;