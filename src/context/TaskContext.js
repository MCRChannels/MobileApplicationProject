import React, { createContext, useReducer } from "react";

export const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      const isDuplicate = state.find(
        (task) => task.title.toLowerCase() === action.payload.title.toLowerCase()
      );

      if (isDuplicate) return state;

      return [
        {
          id: Date.now().toString(),
          title: action.payload.title,
          description: action.payload.description || "",
          completed: false,
        },
        ...state,
      ];

    case "TOGGLE_COMPLETED":
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );

    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.payload);

    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};