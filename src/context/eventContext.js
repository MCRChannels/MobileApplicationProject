import React, { Children, createContext, useReducer } from "react";

export const EventContext = createContext();

const eventReducer = (state, action) => {
    switch (action.type) {
        case "ADD_OR_UPDATE":
            const isOverlap = state.find(
                (event) =>
                    event.day === action.payload.day &&
                    event.startTime === action.payload.startTime
            );

            if (isOverlap) {
                alert('เวลาชนกันไอสัส')
                return state;
            }

            return [
                {
                    ...action.payload,
                    id: Date.now().toString(),
                },
                ...state,
            ];
        case "UPDATE_EVENT":
            return state.map((item) =>
                item.id === action.payload.id ? action.payload : item,
            );
        case "DELETE_EVENT":
            return state.filter((item) => item.title.toLowerCase() !== action.payload.toLowerCase());
        default:
            return state;
    }
};

export const EventProvider = ({ children }) => {
    const [events, dispatch] = useReducer(eventReducer, []);

    return (
        <EventContext.Provider value={{ events, dispatch }}>
            {children}
        </EventContext.Provider>
    );
};
