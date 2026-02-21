import React, { useState, useContext } from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image, Button } from 'react-native'
import TextInputJS from "../../components/TextinputJS";
import { Picker } from '@react-native-picker/picker'
import { UserContext } from "../context/userContext";

const Register = ({ navigation }) => {

    const { users, dispatch } = useContext(UserContext)

    const [form, setForm] = useState({
        fullname: '',
        username: '',
        password: '',
        confirmPassword: '',
        Dept: 'ศิลปศาสตร์และวิทยาศาสตร์',
        year: '1',
        image: null,
    })

    const handleRegister = () => {
        const { fullname, username, password, confirmPassword } = form

        if (!fullname || !username || !password || !confirmPassword) {
            Alert.alert('Notification', 'กรุณากรอกข้อมูลให้ครบไอ้ควาย')
            return
        }

        if (password !== confirmPassword) {
            Alert.alert('Notification', 'Password & ConfirmPassword ไม่ตรงกันไอโง่!')
            return
        }

        if (password.length < 6) {
            Alert.alert('Notification', 'รหัสผ่านต้องมากกว่า 6 ตัวขึ้นไป')
            return
        }

        const isDuplicate = users.find(user => user.username.toLowerCase() === username.toLowerCase())

        if (isDuplicate) {
            Alert.alert('Notifications', 'ชื่อซ้ำจ้า')
            return
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
        }

        dispatch({ type: 'ADDED', payload: newUser })

        Alert.alert('Notification', 'สมัครสมาชิกสำเร็จ!',
            [{
                text: 'ตกลง',
                onPress: () => navigation.navigate('HomeApp',
                    {
                        screen: 'ProfileScreen',
                        params: { user: newUser }
                    })
            }])
    }

    const handleInput = (key, value) => {
        setForm({ ...form, [key]: value })
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Image source={{ uri: 'https://media.discordapp.net/attachments/1097251790602375319/1472155637910732842/Test2-removebg-preview_1.png?ex=69918b47&is=699039c7&hm=027dc8a9620906094d6cb314f6e763e1c7ff7ed27e7c7da09471e0aa10c7b27e&=&format=webp&quality=lossless' }} style={{ width: 350, height: 350, marginBottom: 15 }} />
            </View>

            <View style={{ gap: 20, alignItems: 'center' }}>
                <TextInputJS holder={'Fullname'} value={form.fullname} onChange={(text) => handleInput('fullname', text)} />
                <TextInputJS holder={'Username'} value={form.username} onChange={(text) => handleInput('username', text)} />
                <TextInputJS holder={'Password'} value={form.password} onChange={(text) => handleInput('password', text)} />
                <TextInputJS holder={'ConfirmPassword'} value={form.confirmPassword} onChange={(text) => handleInput('confirmPassword', text)} />
                <View style={styles.PickerCon}>
                    <Picker selectedValue={form.Dept} onValueChange={(text) => handleInput('Dept', text)} mode="dropdown">
                        <Picker.Item label="ศิลปศาสตร์และวิทยาศาสตร์" value="ศิลปศาสตร์และวิทยาศาสตร์" />
                        <Picker.Item label="เกษตร" value="เกษตร" />
                        <Picker.Item label="วิทยาศาสตร์การกีฬาและสุขภาพ" value="วิทยาศาสตร์การกีฬาและสุขภาพ" />
                        <Picker.Item label="ศึกษาศาสตร์และพัฒนศาสตร์" value="ศึกษาศาสตร์และพัฒนศาสตร์" />
                        <Picker.Item label="อุตสากรรมบริการ" value="อุตสากรรมบริการ" />
                        <Picker.Item label="สัตว์แพทย์" value="สัตว์แพทย์" />
                    </Picker>
                </View>
                <View style={styles.PickerCon}>
                    <Picker selectedValue={form.year} onValueChange={(text) => handleInput('year', text)} mode="dropdown">
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

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttontext}>สมัครสมาชิก</Text>
                </TouchableOpacity>
                <Button
                    title="กดไปไอควายพวกโง่"
                    onPress={() => navigation.navigate('HomeApp', { screen: 'ProfileScreen', params: { user: form } })}
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    button: {
        height: 50,
        width: 300,
        backgroundColor: '#006664',
        justifyContent: 'center',
        borderRadius: 15
    },
    buttontext: {
        textAlign: 'center',
        color: '#c3eb32ff',
        fontWeight: 'bold',
        fontSize: 16
    },
    PickerCon: {
        width: 350,
        height: 50,
        borderWidth: 1.5,
        borderColor: '#b6b6b6',
        borderRadius: 10,
        justifyContent: 'center'
    }

})

export default Register