import React, { useState, useContext } from "react";
import {
    Text,
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from "../context/userContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Register = ({ navigation }) => {
    const { users, dispatch } = useContext(UserContext);

    const [form, setForm] = useState({
        fullname: '',
        username: '',
        password: '',
        confirmPassword: '',
        Dept: 'ศิลปศาสตร์และวิทยาศาสตร์',
        year: '1',
        image: null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = () => {
        const { fullname, username, password, confirmPassword } = form;

        if (!fullname || !username || !password || !confirmPassword) {
            Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบทุกช่องครับ');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('แจ้งเตือน', 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกันครับ');
            return;
        }

        if (password.length < 6) {
            Alert.alert('แจ้งเตือน', 'รหัสผ่านต้องมีความยาว 6 ตัวอักษรขึ้นไป');
            return;
        }

        const isDuplicate = users.find(user => user.username.toLowerCase() === username.toLowerCase());

        if (isDuplicate) {
            Alert.alert('แจ้งเตือน', 'ชื่อผู้ใช้งานนี้มีในระบบแล้ว กรุณาใช้ชื่ออื่นครับ');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            fullname: fullname,
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            Dept: form.Dept,
            year: form.year,
            image: form.image,
        };

        dispatch({ type: 'ADDED', payload: newUser });

        Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อยแล้ว!',
            [{
                text: 'ตกลง',
                onPress: () => navigation.navigate('HomeApp',
                    {
                        screen: 'ProfileScreen',
                        params: { user: newUser }
                    })
            }]
        );
    };

    const handleInput = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    {/* Header Image */}
                    <View style={styles.headerContainer}>
                        <Image
                            source={{ uri: 'https://media.discordapp.net/attachments/1097251790602375319/1472155637910732842/Test2-removebg-preview_1.png?ex=69918b47&is=699039c7&hm=027dc8a9620906094d6cb314f6e763e1c7ff7ed27e7c7da09471e0aa10c7b27e&=&format=webp&quality=lossless' }}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerTitle}>Create Account</Text>
                        <Text style={styles.headerSubtitle}>Please fill in the form to continue</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>

                        {/* Fullname */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#006664" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#999"
                                value={form.fullname}
                                onChangeText={(text) => handleInput('fullname', text)}
                            />
                        </View>

                        {/* Username */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="at-outline" size={20} color="#006664" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#999"
                                value={form.username}
                                onChangeText={(text) => handleInput('username', text)}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#006664" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                value={form.password}
                                onChangeText={(text) => handleInput('password', text)}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#006664" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="#999"
                                value={form.confirmPassword}
                                onChangeText={(text) => handleInput('confirmPassword', text)}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        {/* Department Picker */}
                        <Text style={styles.label}>Faculty / Department</Text>
                        <View style={styles.pickerWrapper}>
                            <Ionicons name="business-outline" size={20} color="#006664" style={styles.pickerIcon} />
                            <Picker
                                selectedValue={form.Dept}
                                onValueChange={(text) => handleInput('Dept', text)}
                                mode="dropdown"
                                style={styles.picker}
                            >
                                <Picker.Item label="ศิลปศาสตร์และวิทยาศาสตร์" value="ศิลปศาสตร์และวิทยาศาสตร์" />
                                <Picker.Item label="เกษตร" value="เกษตร" />
                                <Picker.Item label="วิทยาศาสตร์การกีฬาและสุขภาพ" value="วิทยาศาสตร์การกีฬาและสุขภาพ" />
                                <Picker.Item label="ศึกษาศาสตร์และพัฒนศาสตร์" value="ศึกษาศาสตร์และพัฒนศาสตร์" />
                                <Picker.Item label="อุตสาหกรรมบริการ" value="อุตสาหกรรมบริการ" />
                                <Picker.Item label="สัตวแพทย์" value="สัตวแพทย์" />
                            </Picker>
                        </View>

                        {/* Year Picker */}
                        <Text style={styles.label}>Year</Text>
                        <View style={styles.pickerWrapper}>
                            <Ionicons name="school-outline" size={20} color="#006664" style={styles.pickerIcon} />
                            <Picker
                                selectedValue={form.year}
                                onValueChange={(text) => handleInput('year', text)}
                                mode="dropdown"
                                style={styles.picker}
                            >
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

                        {/* Register Button */}
                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.85}>
                            <Text style={styles.buttonText}>Register</Text>
                            <Ionicons name="arrow-forward-outline" size={20} color="#c3eb32" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>

                        {/* Debug bypass button */}
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => navigation.navigate('HomeApp', { screen: 'ProfileScreen', params: { user: form } })}
                        >
                            <Text style={styles.skipButtonText}>Skip for Testing</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f2f0',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },

    /* Header Section */
    headerContainer: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    logoImage: {
        width: 180,
        height: 180,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1a3a3a',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
    },

    /* Form Section */
    formContainer: {
        paddingHorizontal: 25,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#006664',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
        marginTop: 10,
    },

    /* Inputs */
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        height: 55,
        paddingHorizontal: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#e8ebe8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#2D3748',
        height: '100%',
    },

    /* Pickers */
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        height: 55,
        paddingLeft: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#e8ebe8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    pickerIcon: {
        marginRight: 6,
    },
    picker: {
        flex: 1,
        color: '#2D3748',
    },

    /* Register Button */
    registerButton: {
        flexDirection: 'row',
        backgroundColor: '#006664',
        height: 55,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        shadowColor: '#006664',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: '#c3eb32',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    /* Skip Testing Button */
    skipButton: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
    },
    skipButtonText: {
        color: '#999',
        fontSize: 13,
        textDecorationLine: 'underline',
    },
});

export default Register;