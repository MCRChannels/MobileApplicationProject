import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { EventContext } from '../context/eventContext';
import { ExamContext } from '../context/examContext';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const DashBoardScreen = ({ navigation }) => {
    const { events } = useContext(EventContext);
    const { exams } = useContext(ExamContext);
    const [nextClass, setNextClass] = useState(null);

    const findNextClass = useCallback(() => {
        if (!events || events.length === 0) {
            setNextClass(null);
            return;
        }

        const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const now = new Date();
        const currentDayIndex = now.getDay();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        let foundClass = null;

        for (let i = 0; i < 7; i++) {
            const checkDayIndex = (currentDayIndex + i) % 7;
            const checkDayName = daysOrder[checkDayIndex];

            let classesToday = events.filter(e => e.day === checkDayName);

            if (i === 0) {
                // สำหรับวันนี้, หาคลาสที่เวลายังมาไม่ถึง
                classesToday = classesToday.filter(e => {
                    const [h, m] = e.startTime.split(':').map(Number);
                    const classTimeInMinutes = h * 60 + m;
                    return classTimeInMinutes > currentTimeInMinutes;
                });
            }

            if (classesToday.length > 0) {
                // เรียงตามเวลา
                classesToday.sort((a, b) => {
                    const [h1, m1] = a.startTime.split(':').map(Number);
                    const [h2, m2] = b.startTime.split(':').map(Number);
                    return (h1 * 60 + m1) - (h2 * 60 + m2);
                });

                foundClass = classesToday[0];
                break;
            }
        }

        setNextClass(foundClass);
    }, [events]);

    useFocusEffect(
        useCallback(() => {
            findNextClass();
        }, [findNextClass])
    );

    const upcomingExams = exams.slice(0, 3);

    // สรุปข้อมูล
    const totalClasses = events.length;
    const totalExams = exams.length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

            {/* --- Next Class Card --- */}
            <TouchableOpacity
                style={styles.nextClassCard}
                onPress={() => navigation.navigate('TimeTableScreen')}
                activeOpacity={0.9}
            >
                {/* Decorative circle */}
                <View style={styles.decorCircle} />

                <View style={styles.nextClassHeader}>
                    <View style={styles.nextClassBadge}>
                        <Ionicons name="school" size={16} color="#fff" />
                    </View>
                    <Text style={styles.headText}>คลาสเรียนต่อไป</Text>
                </View>

                {nextClass ? (
                    <View style={styles.nextClassBody}>
                        <Text style={styles.subHeadText} numberOfLines={2}>{nextClass.title}</Text>
                        <View style={styles.nextClassDetails}>
                            <View style={styles.nextClassInfoRow}>
                                <Ionicons name="time-outline" size={16} color="#E2E8F0" />
                                <Text style={styles.infoText}>
                                    เวลา: {nextClass.startTime} - {nextClass.endTime}
                                </Text>
                            </View>
                            <View style={styles.nextClassInfoRow}>
                                <Ionicons name="calendar-outline" size={16} color="#E2E8F0" />
                                <Text style={styles.infoText}>วัน: {nextClass.day}</Text>
                            </View>
                            <View style={styles.nextClassInfoRow}>
                                <Ionicons name="location-outline" size={16} color="#E2E8F0" />
                                <Text style={styles.infoText}>สถานที่: {nextClass.roomNumber || 'ไม่ระบุห้อง'}</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.nextClassBody, { paddingVertical: 10 }]}>
                        <Text style={[styles.subHeadText, { fontSize: 20, marginBottom: 4 }]}>
                            ไม่มีคลาสเร็วๆนี้
                        </Text>
                        <Text style={styles.infoText}>พักผ่อนให้เต็มที่ หรือทบทวนบทเรียนได้เลย!</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* --- Quick Add Section --- */}
            <View style={styles.quickHeader}>
                <Text style={styles.sectionTitle}>เมนูจัดการด่วน</Text>
            </View>
            <View style={styles.quickRow}>
                <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('TimeTableScreen', { screen: 'Create' })} activeOpacity={0.8}>
                    <View style={[styles.quickIconWrap, { backgroundColor: 'rgba(0,102,100,0.1)' }]}>
                        <Ionicons name="add-circle" size={24} color="#006664" />
                    </View>
                    <Text style={styles.quickText}>เพิ่มวิชา</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickButton} activeOpacity={0.8}>
                    <View style={[styles.quickIconWrap, { backgroundColor: 'rgba(46,134,171,0.1)' }]}>
                        <Ionicons name="list-circle" size={24} color="#2E86AB" />
                    </View>
                    <Text style={styles.quickText}>เพิ่มงาน</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('TimeTableScreen', { screen: 'CreateExam' })} activeOpacity={0.8}>
                    <View style={[styles.quickIconWrap, { backgroundColor: 'rgba(162,59,114,0.1)' }]}>
                        <Ionicons name="information-circle" size={24} color="#A23B72" />
                    </View>
                    <Text style={styles.quickText}>เพิ่มสอบ</Text>
                </TouchableOpacity>
            </View>

            {/* --- Upcoming Exam Section --- */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>สอบที่กำลังจะมาถึง</Text>
                {upcomingExams.length > 0 && (
                    <TouchableOpacity onPress={() => navigation.navigate('TimeTableScreen', { screen: 'Exam' })}>
                        <Text style={styles.seeAllText}>เปิดดูตารางสอบทั้งหมด</Text>
                    </TouchableOpacity>
                )}
            </View>

            {upcomingExams.length > 0 ? (
                upcomingExams.map((exam, index) => {
                    const colors = ['#FF8A8A', '#35CDBE', '#FFB347'];
                    return (
                        <TouchableOpacity
                            key={exam.id}
                            style={styles.examCard}
                            onPress={() => navigation.navigate('TimeTableScreen', { screen: 'Exam' })}
                            activeOpacity={0.85}
                        >
                            <View style={[styles.examAccent, { backgroundColor: colors[index % colors.length] }]} />
                            <View style={styles.examContent}>
                                <Text style={styles.examTitle}>{exam.title}</Text>
                                <View style={styles.examMeta}>
                                    <View style={styles.examInfoRow}>
                                        <Ionicons name="calendar-outline" size={14} color="#777" />
                                        <Text style={styles.examDetail}>{exam.date}</Text>
                                    </View>
                                    <View style={styles.examInfoRow}>
                                        <Ionicons name="time-outline" size={14} color="#777" />
                                        <Text style={styles.examDetail}>{exam.startTime} - {exam.endTime}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.examRoomBadge}>
                                <Ionicons name="location" size={12} color="#fff" />
                                <Text style={styles.examRoomText}>{exam.roomNumber || 'No Room'}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <View style={styles.emptyExamCard}>
                    <Ionicons name="document-text-outline" size={40} color="#ddd" />
                    <Text style={styles.emptyExamText}>ยังไม่มีวิชาสอบในตอนนี้</Text>
                    <TouchableOpacity
                        style={styles.emptyAddBtn}
                        onPress={() => navigation.navigate('TimeTableScreen', { screen: 'CreateExam' })}
                    >
                        <Ionicons name="add" size={16} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={styles.emptyAddText}>บันทึกตารางสอบเลย</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8faf9',
        paddingTop: 10,
        paddingHorizontal: 20,
    },

    /* Stats Row */
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a3a3a',
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#666',
        marginTop: 4,
    },

    /* Section */
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 14,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#006664',
        textDecorationLine: 'underline',
    },

    /* Next Class Card */
    nextClassCard: {
        backgroundColor: '#006664',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        shadowColor: '#006664',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
        minHeight: 180,
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    nextClassHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    nextClassBadge: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextClassBody: {
        gap: 8,
    },
    nextClassDetails: {
        marginTop: 8,
        gap: 8,
    },
    nextClassInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    subHeadText: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
    },
    infoText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        fontWeight: '500',
    },

    /* Quick Add */
    quickHeader: {
        marginTop: 24,
        marginBottom: 14,
    },
    quickRow: {
        flexDirection: 'row',
        gap: 12,
    },
    quickButton: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 18,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    quickIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
    },

    /* Exam Cards */
    examCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        paddingVertical: 18,
        paddingRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
        overflow: 'hidden',
    },
    examAccent: {
        width: 6,
        height: '100%',
        marginRight: 16,
    },
    examContent: {
        flex: 1,
    },
    examTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 6,
    },
    examMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    examInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    examDetail: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    examRoomBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A5568',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    examRoomText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },

    /* Empty Exam */
    emptyExamCard: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingVertical: 36,
        gap: 12,
    },
    emptyExamText: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyAddBtn: {
        marginTop: 6,
        backgroundColor: '#006664',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    emptyAddText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default DashBoardScreen;