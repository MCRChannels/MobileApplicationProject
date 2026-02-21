import React, { Children, createContext, useReducer } from "react";
import { Alert } from 'react-native'

export const UserContext = createContext()

const userReducer = (state, action) => {
    switch (action.type) {
        case 'ADDED':
            const existUserIndex = state.findIndex((item) => item.username.toLowerCase() === action.payload.username.toLowerCase())

            if (existUserIndex !== -1) {
                Alert.alert('Notifications', 'Username นี้ถูกใช้งานไปแล้ว')
                return state
            }

            const newUser = {
                ...action.payload,
                id: action.payload.id || Date.now().toString()
            }

            return [...state, newUser]
        case 'UPDATE_USER':
            return state.map(item => item.id === action.payload.id ? { ...item, ...action.payload } : item)
        case 'DELETE_USER':
            return state.filter(user => user.id !== action.payload);
        default:
            return state
    }
}

export const UserProvider = ({ children }) => {
    const [users, dispatch] = useReducer(userReducer, [])

    return (
        <UserContext.Provider value={{ users, dispatch }}>
            {children}
        </UserContext.Provider>
    )
}

