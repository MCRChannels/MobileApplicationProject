/**
 * Unit Tests — Exam Context Reducer
 */

const examReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EXAMS':
            return action.payload;

        case 'ADD_EXAM': {
            const newExam = {
                ...action.payload,
                id: action.payload.firestoreId || action.payload.id || 'gen-id',
            };
            return [newExam, ...state];
        }

        case 'DELETE_EXAM': {
            const deleteTitle =
                typeof action.payload === 'string' ? action.payload : action.payload?.title;
            if (!deleteTitle) return state;
            return state.filter((item) => item.title?.toLowerCase() !== deleteTitle.toLowerCase());
        }

        case 'CLEAR_ALL':
            return [];

        default:
            return state;
    }
};

const INITIAL_STATE = [];

const mockExam1 = {
    id: 'ex1',
    firestoreId: 'ex1',
    title: 'คณิตศาสตร์',
    date: '15/03/2026',
    startTime: '09:00',
    endTime: '12:00',
    roomNumber: 'SC-101',
};

const mockExam2 = {
    id: 'ex2',
    firestoreId: 'ex2',
    title: 'ฟิสิกส์',
    date: '20/03/2026',
    startTime: '13:00',
    endTime: '16:00',
    roomNumber: 'SC-202',
};

// ─────────────────────────────────────────────────────────────────────────────
describe('examReducer — SET_EXAMS', () => {
    test('ควรตั้งค่า exams array ใหม่', () => {
        const result = examReducer(INITIAL_STATE, {
            type: 'SET_EXAMS',
            payload: [mockExam1, mockExam2],
        });
        expect(result).toHaveLength(2);
    });

    test('ควรล้าง exams เดิมเมื่อ SET ด้วย array ว่าง', () => {
        const result = examReducer([mockExam1], { type: 'SET_EXAMS', payload: [] });
        expect(result).toHaveLength(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('examReducer — ADD_EXAM', () => {
    test('ควรเพิ่ม exam ใหม่ได้', () => {
        const result = examReducer(INITIAL_STATE, {
            type: 'ADD_EXAM',
            payload: mockExam1,
        });
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('คณิตศาสตร์');
    });

    test('exam ใหม่ควรอยู่ด้านบนสุดของ list', () => {
        const state = [mockExam1];
        const result = examReducer(state, {
            type: 'ADD_EXAM',
            payload: mockExam2,
        });
        expect(result[0].title).toBe('ฟิสิกส์'); // ใหม่สุดอยู่บนสุด
    });

    test('ควรใช้ firestoreId เป็น id', () => {
        const result = examReducer(INITIAL_STATE, {
            type: 'ADD_EXAM',
            payload: { ...mockExam1, firestoreId: 'fs-123' },
        });
        expect(result[0].id).toBe('fs-123');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('examReducer — DELETE_EXAM', () => {
    const state = [mockExam1, mockExam2];

    test('ควรลบ exam ตามชื่อวิชาได้', () => {
        const result = examReducer(state, {
            type: 'DELETE_EXAM',
            payload: { title: 'คณิตศาสตร์', firestoreId: 'ex1', userId: 'uid' },
        });
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('ฟิสิกส์');
    });

    test('ถ้าไม่มี title ในเพย์โหลดไม่ควรลบอะไร', () => {
        const result = examReducer(state, {
            type: 'DELETE_EXAM',
            payload: { firestoreId: 'ex1' },
        });
        expect(result).toHaveLength(2);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('examReducer — CLEAR_ALL', () => {
    test('ควรล้าง exams ทั้งหมด', () => {
        const result = examReducer([mockExam1, mockExam2], { type: 'CLEAR_ALL' });
        expect(result).toHaveLength(0);
    });
});
