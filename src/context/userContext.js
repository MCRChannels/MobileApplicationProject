import React, { createContext, useReducer } from "react";
import { Alert } from 'react-native';
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const UserContext = createContext();

const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload,
            };
        case 'ADDED':
            const existUserIndex = state.users.findIndex((item) => item.username.toLowerCase() === action.payload.username.toLowerCase());
            if (existUserIndex !== -1) {
                Alert.alert('Notifications', 'Username นี้ถูกใช้งานไปแล้ว');
                return state;
            }
            const newUser = {
                ...action.payload,
                id: action.payload.id || Date.now().toString()
            };
            return { ...state, users: [...state.users, newUser] };
        case 'UPDATE_USER':
            // Update Firestore (fire-and-forget)
            if (action.payload.id) {
                updateDoc(doc(db, "users", action.payload.id), action.payload).catch(err => console.log("Update user error:", err));
            }
            return {
                ...state,
                currentUser: state.currentUser?.id === action.payload.id
                    ? { ...state.currentUser, ...action.payload }
                    : state.currentUser,
                users: state.users.map(item => item.id === action.payload.id ? { ...item, ...action.payload } : item),
            };
        case 'DELETE_USER':
            if (action.payload) {
                deleteDoc(doc(db, "users", action.payload)).catch(err => console.log("Delete user error:", err));
            }
            return {
                ...state,
                currentUser: null,
                users: state.users.filter(user => user.id !== action.payload),
            };
        case 'LOGOUT':
            return {
                ...state,
                currentUser: null,
            };
        default:
            return state;
    }
};

const initialState = {
    users: [],
    currentUser: null,
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{ users: state.users, currentUser: state.currentUser, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};
