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
                classesToday = classesToday.filter(e => {
                    const [h, m] = e.startTime.split(':').map(Number);
                    const classTimeInMinutes = h * 60 + m;
                    return classTimeInMinutes > currentTimeInMinutes;
                });
            }

            if (classesToday.length > 0) {
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

            {/* --- Stats Row --- */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#006664' + '18' }]}>
                        <Ionicons name="school-outline" size={20} color="#006664" />
                    </View>
                    <Text style={styles.statNumber}>{totalClasses}</Text>
                    <Text style={styles.statLabel}>Classes</Text>
                </View>
                <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#A23B72' + '18' }]}>
                        <Ionicons name="document-text-outline" size={20} color="#A23B72" />
                    </View>
                    <Text style={styles.statNumber}>{totalExams}</Text>
                    <Text style={styles.statLabel}>Exams</Text>
                </View>
                <View style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: '#2E86AB' + '18' }]}>
                        <Ionicons name="today-outline" size={20} color="#2E86AB" />
                    </View>
                    <Text style={styles.statNumber}>{totalClasses + totalExams}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
            </View>

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
                    <Text style={styles.headText}>NEXT CLASS</Text>
                </View>

                {nextClass ? (
                    <View style={styles.nextClassBody}>
                        <Text style={styles.subHeadText}>{nextClass.title}</Text>
                        <View style={styles.nextClassDetails}>
                            <View style={styles.nextClassInfoRow}>
                                <Ionicons name="time-outline" size={15} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.infoText}>
                                    {nextClass.startTime} - {nextClass.endTime}
                                </Text>
                            </View>
                            <View style={styles.nextClassInfoRow}>
                                <Ionicons name="calendar-outline" size={15} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.infoText}>{nextClass.day}</Text>
                            </View>
                            <View style={styles.nextClassInfoRow}>
                                <Ionicons name="location-outline" size={15} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.infoText}>{nextClass.roomNumber || 'No Room'}</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.nextClassBody}>
                        <Text style={[styles.subHeadText, { fontSize: 17 }]}>
                            No upcoming classes
                        </Text>
                        <Text style={styles.infoText}>Enjoy your free time!</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* --- Quick Add Section --- */}
            <View style={styles.quickHeader}>
                <Text style={styles.sectionTitle}>QUICK ADD</Text>
            </View>
            <View style={styles.quickRow}>
                <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('TimeTableScreen', { screen: 'Create' })} activeOpacity={0.8}>
                    <View style={[styles.quickIconWrap, { backgroundColor: '#006664' }]}>
                        <Ionicons name="calendar-outline" size={18} color="#fff" />
                    </View>
                    <Text style={styles.quickText}>Class</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickButton} activeOpacity={0.8}>
                    <View style={[styles.quickIconWrap, { backgroundColor: '#2E86AB' }]}>
                        <Ionicons name="checkbox-outline" size={18} color="#fff" />
                    </View>
                    <Text style={styles.quickText}>Task</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('TimeTableScreen', { screen: 'CreateExam' })} activeOpacity={0.8}>
                    <View style={[styles.quickIconWrap, { backgroundColor: '#A23B72' }]}>
                        <Ionicons name="document-text-outline" size={18} color="#fff" />
                    </View>
                    <Text style={styles.quickText}>Exam</Text>
                </TouchableOpacity>
            </View>

            {/* --- Upcoming Exam Section --- */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>UPCOMING EXAMS</Text>
                {upcomingExams.length > 0 && (
                    <TouchableOpacity onPress={() => navigation.navigate('TimeTableScreen', { screen: 'Exam' })}>
                        <Text style={styles.seeAllText}>See All</Text>
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
                                        <Ionicons name="calendar-outline" size={12} color="#999" />
                                        <Text style={styles.examDetail}>{exam.date}</Text>
                                    </View>
                                    <View style={styles.examInfoRow}>
                                        <Ionicons name="time-outline" size={12} color="#999" />
                                        <Text style={styles.examDetail}>{exam.startTime} - {exam.endTime}</Text>
                                    </View>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#ddd" />
                        </TouchableOpacity>
                    );
                })
            ) : (
                <View style={styles.emptyExamCard}>
                    <Ionicons name="document-text-outline" size={36} color="#ccc" />
                    <Text style={styles.emptyExamText}>No upcoming exams</Text>
                    <TouchableOpacity
                        style={styles.emptyAddBtn}
                        onPress={() => navigation.navigate('TimeTableScreen', { screen: 'CreateExam' })}
                    >
                        <Text style={styles.emptyAddText}>+ Add Exam</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f0',
        paddingTop: 10,
        paddingHorizontal: 20,
    },

    /* Stats Row */
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a3a3a',
    },
    statLabel: {
        fontSize: 11,
        color: '#999',
        fontWeight: '600',
        marginTop: 2,
    },

    /* Section */
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#999',
        letterSpacing: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 22,
        marginBottom: 12,
    },
    seeAllText: {
        fontSize: 13,
        color: '#006664',
        fontWeight: '600',
    },

    /* Next Class Card */
    nextClassCard: {
        backgroundColor: '#006664',
        borderRadius: 20,
        padding: 22,
        width: '100%',
        shadowColor: '#006664',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        minHeight: 160,
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    nextClassHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    nextClassBadge: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextClassBody: {
        gap: 6,
    },
    nextClassDetails: {
        marginTop: 6,
        gap: 5,
    },
    nextClassInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1.2,
    },
    subHeadText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },

    /* Quick Add */
    quickHeader: {
        marginTop: 22,
        marginBottom: 12,
    },
    quickRow: {
        flexDirection: 'row',
        gap: 10,
    },
    quickButton: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        paddingVertical: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    quickIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#444',
    },

    /* Exam Cards */
    examCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 10,
        paddingVertical: 16,
        paddingRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    examAccent: {
        width: 4,
        height: '100%',
        marginRight: 16,
    },
    examContent: {
        flex: 1,
    },
    examTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 4,
    },
    examMeta: {
        flexDirection: 'row',
        gap: 14,
    },
    examInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    examDetail: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    },

    /* Empty Exam */
    emptyExamCard: {
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 28,
        gap: 8,
    },
    emptyExamText: {
        color: '#bbb',
        fontSize: 14,
        fontWeight: '500',
    },
    emptyAddBtn: {
        marginTop: 4,
        backgroundColor: '#006664',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 8,
    },
    emptyAddText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
});

export default DashBoardScreen;