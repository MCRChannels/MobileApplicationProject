import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SectionList,
    SafeAreaView
} from 'react-native';

import { Feather } from "@expo/vector-icons";

const ExamScreen = ({ navigation }) => {
    
    const renderItem = ({ item }) => (
        <View style={[styles.card, { borderColor: item.borderColor }]}>
            <View style={styles.cardHeader}>
                <View style={styles.timeContainer}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>

                <View style={styles.rightActions}>
                    {item.badges.length > 0 && (
                        <View style={styles.badgeContainer}>
                            {item.badges.map((color, index) => (
                                <View key={index} style={[styles.badge, { backgroundColor: color }]} />
                            ))}
                        </View>
                    )}
                    <TouchableOpacity>
                        <Text style={styles.moreIcon}>⋮</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
    );

    const renderSectionHeader = ({ section: { dateTitle } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.dueText}>Due. </Text>
            <Text style={styles.dateTitleText}>{dateTitle}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
          
            <View style={styles.header}>

                <View style={styles.toggleContainer}>
                    <TouchableOpacity 
                        style={styles.cardheader} 
                        onPress={() => navigation.navigate('TimeTable')}
                    >
                        <Text style={styles.headertext}>ตารางเรียน</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.cardheader}
                        // หน้าตารางสอบ ไม่ต้องใส่ Action เพราะอยู่ที่หน้านี้อยู่แล้ว
                    >
                        <Text style={styles.headertext}>ตารางสอบ</Text>
                    </TouchableOpacity>
                </View>

             
                <View style={{ width: 24 }} />
            </View>


            
            <View style={styles.addActionContainer}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateExam')} >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.ongoingTitle}>Exam Schedule </Text>
                
            </View>

            
            <SectionList
                sections={examData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(233, 233, 233)',
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    
    toggleContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    cardheader: {
       width: 100,
       flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35,
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#006110',
        borderWidth: 1
    },
    headertext: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000'
    },

    addActionContainer: {
        flexDirection : 'row',
       alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#35CDBE',
        width: 35,
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        lineHeight: 26,
    },
    sectionHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    dueText: {
        fontSize: 14,
        color: '#A0AEC0',
    },
    dateTitleText: {
        fontSize: 14,
        color: '#4A5568',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    ongoingTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 16,
        marginRight: 8,
    },
    timeText: {
        fontSize: 12,
        color: '#A0AEC0',
        fontWeight: '500',
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    badgeContainer: {
        marginRight: 10,
        gap: 4,
    },
    badge: {
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    moreIcon: {
        fontSize: 20,
        color: '#CBD5E0',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 13,
        color: '#718096',
        lineHeight: 18,
    }
});

export default ExamScreen;