import React, { useState, useContext, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, StatusBar,
  SafeAreaView, Alert
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserContext } from "../context/userContext";
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ActivityScreen = () => {
  const { currentUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('planner');
  const [inputText, setInputText] = useState("");
  const [locationText, setLocationText] = useState("");

  // Date & Time States
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [items, setItems] = useState([]);

  // Load activities from Firestore on mount
  useEffect(() => {
    const loadActivities = async () => {
      if (!currentUser?.id) return;
      try {
        const snap = await getDocs(collection(db, "users", currentUser.id, "activities"));
        const loaded = snap.docs.map(d => ({ ...d.data(), id: d.id, firestoreId: d.id }));
        setItems(loaded);
      } catch (error) {
        console.log("Load activities error:", error);
      }
    };
    loadActivities();
  }, [currentUser?.id]);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setDate(selectedTime);
  };

  const handleAddItem = async () => {
    if (!inputText.trim()) return;

    const dateLabel = date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeLabel = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    const newItem = {
      title: inputText,
      type: activeTab,
      completed: false,
      ...(activeTab === 'activity' && {
        location: locationText || 'ไม่ระบุสถานที่',
        time: timeLabel,
        dateLabel: dateLabel
      })
    };

    // Save to Firestore
    if (currentUser?.id) {
      try {
        const docRef = await addDoc(collection(db, "users", currentUser.id, "activities"), newItem);
        newItem.id = docRef.id;
        newItem.firestoreId = docRef.id;
      } catch (error) {
        console.log("Add activity error:", error);
        newItem.id = Date.now().toString();
      }
    } else {
      newItem.id = Date.now().toString();
    }

    setItems([newItem, ...items]);
    setInputText("");
    setLocationText("");
  };

  const deleteItem = async (id) => {
    // Delete from Firestore
    if (currentUser?.id) {
      try {
        await deleteDoc(doc(db, "users", currentUser.id, "activities", id));
      } catch (error) {
        console.log("Delete activity error:", error);
      }
    }
    setItems(items.filter(item => item.id !== id));
  };

  const toggleItem = async (id) => {
    const item = items.find(i => i.id === id);
    if (item && currentUser?.id && item.firestoreId) {
      try {
        await updateDoc(doc(db, "users", currentUser.id, "activities", item.firestoreId), {
          completed: !item.completed,
        });
      } catch (error) {
        console.log("Toggle activity error:", error);
      }
    }
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const plannerCount = items.filter(i => i.type === 'planner').length;
  const activityCount = items.filter(i => i.type === 'activity').length;
  const completedPlanner = items.filter(i => i.type === 'planner' && i.completed).length;

  const renderPlanner = ({ item }) => (
    <View style={[styles.planCard, item.completed && styles.planCardCompleted]}>
      <TouchableOpacity
        style={[styles.checkCircle, item.completed && styles.checkCircleDone]}
        onPress={() => toggleItem(item.id)}
        activeOpacity={0.7}
      >
        {item.completed && <Ionicons name="checkmark" size={15} color="#fff" />}
      </TouchableOpacity>
      <View style={styles.planContent}>
        <Text style={[styles.planTitle, item.completed && styles.planTitleDone]} numberOfLines={2}>
          {item.title}
        </Text>
        {item.completed && (
          <Text style={styles.planDoneBadge}>เสร็จแล้ว ✓</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteIconBtn}
        onPress={() => Alert.alert('ลบรายการ', `ลบ "${item.title}" หรือไม่?`, [
          { text: 'ยกเลิก', style: 'cancel' },
          { text: 'ลบ', style: 'destructive', onPress: () => deleteItem(item.id) }
        ])}
      >
        <Ionicons name="close-circle" size={22} color="#E53E3E" />
      </TouchableOpacity>
    </View>
  );

  const renderActivity = ({ item }) => (
    <View style={styles.actCard}>
      <View style={styles.actAccent} />
      <View style={styles.actBody}>
        <View style={styles.actTopRow}>
          <View style={styles.actIconCircle}>
            <Ionicons name="flag" size={16} color="#006664" />
          </View>
          <Text style={styles.actTitle} numberOfLines={1}>{item.title}</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('ลบกิจกรรม', `ลบ "${item.title}" หรือไม่?`, [
              { text: 'ยกเลิก', style: 'cancel' },
              { text: 'ลบ', style: 'destructive', onPress: () => deleteItem(item.id) }
            ])}
          >
            <Ionicons name="trash-outline" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
        <View style={styles.actTagRow}>
          <View style={styles.actTag}>
            <Ionicons name="location" size={12} color="#006664" />
            <Text style={styles.actTagText}>{item.location}</Text>
          </View>
          <View style={styles.actTag}>
            <Ionicons name="calendar" size={12} color="#006664" />
            <Text style={styles.actTagText}>{item.dateLabel}</Text>
          </View>
          <View style={styles.actTag}>
            <Ionicons name="time" size={12} color="#006664" />
            <Text style={styles.actTagText}>{item.time}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons
          name={activeTab === 'planner' ? 'book-outline' : 'rocket-outline'}
          size={40}
          color="#006664"
        />
      </View>
      <Text style={styles.emptyTitle}>
        {activeTab === 'planner' ? 'ยังไม่มีแผนการเรียน' : 'ยังไม่มีกิจกรรม'}
      </Text>
      <Text style={styles.emptySubText}>
        {activeTab === 'planner' ? 'เพิ่มสิ่งที่ต้องทำวันนี้ได้เลย!' : 'เพิ่มกิจกรรมใหม่ได้เลย!'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ===== Header ===== */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>กิจกรรม & แผน</Text>
          <Text style={styles.headerSubtitle}>จัดการทุกอย่างในที่เดียว</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="layers" size={18} color="#fff" />
        </View>
      </View>

      {/* ===== Tab Switcher ===== */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'planner' && styles.tabBtnActive]}
          onPress={() => setActiveTab('planner')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'planner' ? 'book' : 'book-outline'}
            size={18}
            color={activeTab === 'planner' ? '#fff' : '#94A3B8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabBtnText, activeTab === 'planner' && styles.tabBtnTextActive]}>
            แผนการเรียน
          </Text>
          {plannerCount > 0 && (
            <View style={[styles.tabBadge, activeTab === 'planner' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, activeTab === 'planner' && styles.tabBadgeTextActive]}>
                {completedPlanner}/{plannerCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'activity' && styles.tabBtnActive]}
          onPress={() => setActiveTab('activity')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'activity' ? 'flag' : 'flag-outline'}
            size={18}
            color={activeTab === 'activity' ? '#fff' : '#94A3B8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabBtnText, activeTab === 'activity' && styles.tabBtnTextActive]}>
            กิจกรรม
          </Text>
          {activityCount > 0 && (
            <View style={[styles.tabBadge, activeTab === 'activity' && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, activeTab === 'activity' && styles.tabBadgeTextActive]}>
                {activityCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

        {/* ===== Input Card ===== */}
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            <View style={styles.inputIconCircle}>
              <Ionicons
                name={activeTab === 'planner' ? 'create-outline' : 'add-outline'}
                size={18}
                color="#006664"
              />
            </View>
            <TextInput
              style={styles.mainInput}
              placeholder={activeTab === 'planner' ? "เพิ่มแผนการเรียน..." : "ชื่อกิจกรรม..."}
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
            />
          </View>

          {activeTab === 'activity' && (
            <>
              <View style={styles.subInputRow}>
                <Ionicons name="location-outline" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.subInput}
                  placeholder="สถานที่..."
                  placeholderTextColor="#CBD5E1"
                  value={locationText}
                  onChangeText={setLocationText}
                />
              </View>

              <View style={styles.dateTimeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>วันที่</Text>
                  <TouchableOpacity style={styles.dtPickerBtn} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                    <Ionicons name="calendar-outline" size={18} color="#006664" />
                    <Text style={styles.dtPickerText}>
                      {date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>เวลา</Text>
                  <TouchableOpacity style={styles.dtPickerBtn} onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
                    <Ionicons name="time-outline" size={18} color="#006664" />
                    <Text style={styles.dtPickerText}>
                      {date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={handleAddItem}>
            <Ionicons name="add-circle" size={20} color="#c3eb32" style={{ marginRight: 6 }} />
            <Text style={styles.addBtnText}>บันทึกรายการ</Text>
          </TouchableOpacity>
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={onTimeChange}
          />
        )}

        {/* ===== List Section ===== */}
        <FlatList
          data={items.filter(i => i.type === activeTab)}
          keyExtractor={(item) => item.id}
          renderItem={activeTab === 'planner' ? renderPlanner : renderActivity}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f0',
  },

  /* ===== Header ===== */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a3a3a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#006664',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#006664',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  /* ===== Tab Bar ===== */
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  tabBtnActive: {
    backgroundColor: '#006664',
    borderColor: '#006664',
    shadowColor: '#006664',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  tabBtnText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#94A3B8',
  },
  tabBtnTextActive: {
    color: '#fff',
  },
  tabBadge: {
    marginLeft: 6,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(195,235,50,0.25)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
  },
  tabBadgeTextActive: {
    color: '#c3eb32',
  },

  /* ===== Input Card ===== */
  inputCard: {
    margin: 20,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f2f0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,102,100,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mainInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3a3a',
  },
  subInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faf9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8ebe8',
  },
  subInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  dtPickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,102,100,0.06)',
    paddingVertical: 11,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,102,100,0.12)',
  },
  dtPickerText: {
    color: '#006664',
    fontWeight: '700',
    fontSize: 13,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#006664',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#006664',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },

  /* ===== List ===== */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 4,
  },

  /* ===== Planner Cards ===== */
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f2f0',
  },
  planCardCompleted: {
    backgroundColor: '#f8faf9',
    borderColor: '#e0e4e3',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#006664',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkCircleDone: {
    backgroundColor: '#006664',
    borderColor: '#006664',
  },
  planContent: {
    flex: 1,
  },
  planTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a3a3a',
    lineHeight: 22,
  },
  planTitleDone: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  planDoneBadge: {
    fontSize: 11,
    color: '#006664',
    fontWeight: '700',
    marginTop: 3,
  },
  deleteIconBtn: {
    padding: 4,
    marginLeft: 8,
  },

  /* ===== Activity Cards ===== */
  actCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f2f0',
  },
  actAccent: {
    width: 5,
    backgroundColor: '#006664',
  },
  actBody: {
    flex: 1,
    padding: 16,
  },
  actTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0,102,100,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1a3a3a',
  },
  actTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,102,100,0.06)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 5,
  },
  actTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
  },

  /* ===== Empty State ===== */
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(0,102,100,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#555',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default ActivityScreen;