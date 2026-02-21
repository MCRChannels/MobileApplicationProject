import React, { createContext, useReducer } from "react";

// 1. สร้าง Context สำหรับการสอบ
export const ExamContext = createContext();

const examReducer = (state, action) => {
  switch (action.type) {
    case "ADD_OR_UPDATE":
      // เช็คว่ามีสอบใน "วัน" และ "เวลาเริ่ม" เดียวกันอยู่แล้วหรือไม่
      const isOverlap = state.find(
        (exam) =>
          exam.date === action.payload.date &&
          exam.startTime === action.payload.startTime
      );

      if (isOverlap) {
        // ถ้าซ้ำ วัน/เวลาเดิม จะไม่เพิ่มข้อมูลใหม่ (เพื่อกันความสับสนในตารางสอบ)
        return state;
      }

      // ถ้าไม่ซ้ำ ให้เพิ่มเป็นรายการใหม่
      return [
        {
          ...action.payload,
          id: Date.now().toString(), // สร้าง ID เฉพาะตัวด้วย Timestamp
        },
        ...state,
      ];

    case "UPDATE_EXAM":
      return state.map((exam) =>
        exam.id === action.payload.id ? { ...exam, ...action.payload } : exam
      );

    case "DELETE_EXAM":
      return state.filter((exam) => exam.title.toLowerCase() !== action.payload.toLowerCase());
    case "CLEAR_ALL":
      return [];

    default:
      return state;
  }
};

export const ExamProvider = ({ children }) => {
  const [exams, dispatch] = useReducer(examReducer, []);

  return (
    <ExamContext.Provider value={{ exams, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
};