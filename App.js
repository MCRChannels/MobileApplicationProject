import React from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, EvilIcons, MaterialCommunityIcons, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';


import ActivityScreen from "./src/screens/ActivityScreen";
import DashboardScreen from "./src/screens/DashBoardScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import TimeTableScreen from "./src/screens/TimeTableScreen";
import Register from "./src/screens/Register";
import { UserProvider } from "./src/context/userContext";
import CreateScreen from "./src/screens/CreateScreen";
import { TaskProvider } from "./src/context/TaskContext";
import { EventProvider } from "./src/context/eventContext";
import ExamScreen from "./src/screens/ExamScreen";
import CreateExamScreen from "./src/screens/CreateExamScreen"
import { ExamProvider } from "./src/context/examContext";

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const TimeTableStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='TimeTable'
        component={TimeTableScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Create'
        component={CreateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Exam'
        component={ExamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='CreateExam'
        component={CreateExamScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const AllTabsScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="ActivityScreen"
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { height: 100, backgroundColor: '#006664', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
        tabBarActiveTintColor: '#c3eb32ff',
        tabBarInactiveTintColor: '#e4e6e2ff',
        tabBarStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 60, backgroundColor: '#006664', position: 'absolute', borderTopWidth: 0 },
        headerTitle: () => (
          <Image
            source={{ uri: 'https://media.discordapp.net/attachments/1097251790602375319/1472152473077682301/Gemini_Generated_Image_agwzv4agwzv4agwz-removebg-preview_1.png?ex=69918854&is=699036d4&hm=b83d1ab66efb80e3760f01d62ba03a7943baf9b085fe418a8a0d679babc8f0e2&=&format=webp&quality=lossless' }}
            style={{ width: 100, height: 100, marginBottom: 10, resizeMode: 'contain' }}
          />
        ),
      }}
    >
      <Tab.Screen
        name='DashboardScreen'
        component={DashboardScreen}
        options={{ title: 'Dashboard', tabBarIcon: ({ focused, color, size }) => (<Ionicons name={focused ? 'grid' : 'grid-outline'} color={color} size={22} />) }}
      />
      <Tab.Screen
        name='TimeTableScreen'
        component={TimeTableStack}
        options={{ title: 'TimeTable', tabBarIcon: ({ focused, color, size }) => (<Ionicons name={focused ? 'time' : 'time-outline'} color={color} size={22} />) }}
      />
      <Tab.Screen
        name='ActivityScreen'
        component={ActivityScreen}
        options={{ title: 'Activity', tabBarIcon: ({ focused, color, size }) => (<Ionicons name={focused ? 'list-circle' : 'list-circle-outline'} color={color} size={24} />) }}
      />
      <Tab.Screen
        name='ProfileScreen'
        component={ProfileScreen}
        options={{ title: 'Profile', tabBarIcon: ({ focused, color, size }) => (<Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={22} />) }}
      />

    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <UserProvider>
      <TaskProvider>
        <EventProvider>
          <ExamProvider>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Register" screenOptions={{ headerTintColor: '#fff', headerStyle: { backgroundColor: '#006664', borderBottomRightRadius: 20, borderBottomLeftRadius: 20, position: 'absolute', height: 100 } }}>
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="HomeApp"
                  component={AllTabsScreen}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </NavigationContainer >
          </ExamProvider>
        </EventProvider>
      </TaskProvider>
    </UserProvider>
  );
}
