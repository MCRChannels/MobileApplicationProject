import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { EventContext } from "../context/eventContext";
import { ExamContext } from "../context/examContext";
import { Ionicons } from '@expo/vector-icons';

const ActivityScreen = () => {
  const { events } = useContext(EventContext);
  const { exams } = useContext(ExamContext);

  // รวม events + exams เป็น activity log
  const activities = [
    ...events.map(e => ({
      id: 'event-' + e.id,
      type: 'class',
      title: e.title,
      detail: `${e.day} | ${e.startTime} - ${e.endTime}`,
      sub: e.roomNumber || 'No Room',
      icon: 'school-outline',
      color: '#006664',
    })),
    ...exams.map(e => ({
      id: 'exam-' + e.id,
      type: 'exam',
      title: e.title,
      detail: `${e.date} | ${e.startTime} - ${e.endTime}`,
      sub: e.roomNumber || '',
      icon: 'document-text-outline',
      color: '#A23B72',
    })),
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.typeBadge, { backgroundColor: item.color + '20' }]}>
            <Text style={[styles.typeBadgeText, { color: item.color }]}>
              {item.type === 'class' ? 'CLASS' : 'EXAM'}
            </Text>
          </View>
        </View>
        <View style={styles.cardDetailRow}>
          <Ionicons name="time-outline" size={13} color="#999" />
          <Text style={styles.cardDetail}>{item.detail}</Text>
        </View>
        {item.sub ? (
          <View style={styles.cardDetailRow}>
            <Ionicons name="location-outline" size={13} color="#999" />
            <Text style={styles.cardDetail}>{item.sub}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>ALL ACTIVITIES</Text>
      <Text style={styles.countText}>{activities.length} items</Text>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No activities yet</Text>
            <Text style={styles.emptySubText}>Add classes or exams to see them here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f0',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
    marginBottom: 2,
  },
  countText: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 14,
  },

  /* Card */
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardDetail: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },

  /* Empty */
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 17,
    color: '#999',
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 4,
  },
});

export default ActivityScreen