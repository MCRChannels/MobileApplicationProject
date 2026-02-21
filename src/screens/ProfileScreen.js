import React, { useState, useContext } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native'
import { UserContext } from "../context/userContext";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';


const ProfileScreen = ({ route, navigation }) => {
    const user = route.params?.user || {}
    const { dispatch } = useContext(UserContext)

    const [editUser, setEditUser] = useState(user)

    const handleEditUser = (key, value) => {
        setEditUser({ ...editUser, [key]: value })
    }

    const handleSave = () => {
        Alert.alert('Notification', 'บันทึกข้อมูลสำเร็จ')

        dispatch({
            type: 'UPDATE_USER',
            payload: editUser
        })
    }

    const handleDelete = () => {
        Alert.alert('Notification', 'มึงแน่ใจใช่ไหมที่จะลบข้อมูลนี้?', [
            { text: 'ยกเลิก', style: 'cancel' },
            {
                text: 'ลบข้อมูล',
                style: 'destructive',
                onPress: () => {
                    dispatch({ type: 'DELETE_USER', payload: user.id })
                    navigation.navigate('Register')
                }
            }
        ])
    }

    const PickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (status !== 'granted') {
            Alert.alert('Notifications', 'ไม่สามารถเข้าถึงคลังภาพได้')
            return
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'livePhotos'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        if (!result.canceled) {
            setEditUser({ ...editUser, image: result.assets[0].uri })
        }

    }

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
            {/* Profile Image Section */}
            <View style={[styles.avatarSection, { marginTop: 20 }]}>
                <TouchableOpacity onPress={PickImage} style={styles.avatarWrapper}>
                    {editUser.image ? (
                        <Image source={{ uri: editUser.image }} style={styles.avatarImage} />
                    ) : (
                        <Image source={{ uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png' }} style={styles.avatarImage} />
                    )}
                    {/* Camera Icon Overlay */}
                    <View style={styles.cameraIcon}>
                        <Ionicons name="camera" size={18} color="#fff" />
                    </View>
                </TouchableOpacity>

                <Text style={styles.usernameText}>{editUser?.username || 'Guest'}</Text>
                <Text style={styles.deptBadge}>{editUser?.Dept || 'ไม่ระบุคณะ'}</Text>
            </View>

            {/* Info Cards */}
            <View style={styles.cardsContainer}>

                {/* ชื่อ-นามสกุล */}
                <View style={styles.card}>
                    <View style={styles.cardLabelRow}>
                        <Ionicons name="person-outline" size={18} color="#006664" />
                        <Text style={styles.cardLabel}>ชื่อ-นามสกุล</Text>
                    </View>
                    <TextInput
                        style={styles.cardInput}
                        value={editUser.fullname}
                        onChangeText={(text) => handleEditUser('fullname', text)}
                        placeholder="กรอกชื่อ-นามสกุล"
                        placeholderTextColor="#bbb"
                    />
                </View>

                {/* คณะ */}
                <View style={styles.card}>
                    <View style={styles.cardLabelRow}>
                        <Ionicons name="school-outline" size={18} color="#006664" />
                        <Text style={styles.cardLabel}>คณะ</Text>
                    </View>
                    <View style={styles.pickerBox}>
                        <Picker selectedValue={editUser.Dept} style={styles.picker} onValueChange={(text) => handleEditUser('Dept', text)} mode="dropdown">
                            <Picker.Item label="ศิลปศาสตร์และวิทยาศาสตร์" value="ศิลปศาสตร์และวิทยาศาสตร์" />
                            <Picker.Item label="เกษตร" value="เกษตร" />
                            <Picker.Item label="วิทยาศาสตร์การกีฬาและสุขภาพ" value="วิทยาศาสตร์การกีฬาและสุขภาพ" />
                            <Picker.Item label="ศึกษาศาสตร์และพัฒนศาสตร์" value="ศึกษาศาสตร์และพัฒนศาสตร์" />
                            <Picker.Item label="อุตสาหกรรมบริการ" value="อุตสาหกรรมบริการ" />
                            <Picker.Item label="สัตว์แพทย์" value="สัตว์แพทย์" />
                        </Picker>
                    </View>
                </View>

                {/* ชั้นปี */}
                <View style={styles.card}>
                    <View style={styles.cardLabelRow}>
                        <Ionicons name="calendar-outline" size={18} color="#006664" />
                        <Text style={styles.cardLabel}>ชั้นปีที่</Text>
                    </View>
                    <View style={styles.pickerBox}>
                        <Picker selectedValue={editUser.year} style={styles.picker} onValueChange={(text) => handleEditUser('year', text)} mode="dropdown">
                            <Picker.Item label="ชั้นปี" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                            <Picker.Item label="7" value="7" />
                            <Picker.Item label="8" value="8" />
                        </Picker>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.85}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.saveButtonText}>บันทึกการแก้ไข</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton} activeOpacity={0.85}>
                    <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.deleteButtonText}>ลบบัญชี</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f0f2f0',
    },

    /* ---- Avatar Section ---- */
    avatarSection: {
        alignItems: 'center',
        marginTop: -45,
        marginBottom: 10,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#006664',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    usernameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a3a3a',
        marginTop: 10,
    },
    deptBadge: {
        fontSize: 13,
        color: '#fff',
        backgroundColor: '#006664',
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 6,
        overflow: 'hidden',
        fontWeight: '500',
    },

    /* ---- Info Cards ---- */
    cardsContainer: {
        paddingHorizontal: 20,
        marginTop: 15,
        gap: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    cardLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#006664',
        marginLeft: 8,
    },
    cardInput: {
        backgroundColor: '#f5f7f6',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e4e3',
    },
    pickerBox: {
        backgroundColor: '#f5f7f6',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e4e3',
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        color: '#333',
    },

    /* ---- Action Buttons ---- */
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
        marginTop: 24,
        paddingHorizontal: 20,
    },
    saveButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#006664',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#006664',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#cc3333',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#cc3333',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
})

export default ProfileScreen