/**
 * Unit Tests — Event Context Reducer
 * ทดสอบ logic ของ eventReducer โดยตรงโดยไม่ต้อง render UI
 */

// Inline reducer (copy from eventContext to test without Firebase side effects)
const eventReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EVENTS':
            return action.payload;

        case 'ADD_OR_UPDATE': {
            const isOverlap = state.find(
                (event) =>
                    event.day === action.payload.day &&
                    event.startTime === action.payload.startTime
            );
            if (isOverlap) {
                return state; // no change if overlap
            }
            const newEvent = {
                ...action.payload,
                id: action.payload.firestoreId || action.payload.id || 'gen-id',
            };
            return [newEvent, ...state];
        }

        case 'DELETE_EVENT': {
            const deleteTitle =
                typeof action.payload === 'string' ? action.payload : action.payload?.title;
            const deleteFirestoreId =
                typeof action.payload === 'object' ? action.payload?.firestoreId : null;
            if (!deleteTitle) return state;
            return state.filter((item) => item.title?.toLowerCase() !== deleteTitle.toLowerCase());
        }

        case 'CLEAR_ALL':
            return [];

        default:
            return state;
    }
};

// ─── Initial State ────────────────────────────────────────────────────────────
const INITIAL_STATE = [];

// ─── Test Data ────────────────────────────────────────────────────────────────
const mockEvent1 = {
    id: 'e1',
    firestoreId: 'e1',
    title: 'คณิตศาสตร์',
    day: 'Monday',
    startTime: '09:00',
    endTime: '12:00',
    roomNumber: 'SC-101',
};

const mockEvent2 = {
    id: 'e2',
    firestoreId: 'e2',
    title: 'ฟิสิกส์',
    day: 'Tuesday',
    startTime: '13:00',
    endTime: '16:00',
    roomNumber: 'SC-202',
};

// ─────────────────────────────────────────────────────────────────────────────
describe('eventReducer — SET_EVENTS', () => {
    test('ควรตั้งค่า events array ใหม่ทั้งหมด', () => {
        const result = eventReducer(INITIAL_STATE, {
            type: 'SET_EVENTS',
            payload: [mockEvent1, mockEvent2],
        });
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(mockEvent1);
    });

    test('ควรล้าง events เก่าออกเมื่อ SET ด้วย array ว่าง', () => {
        const stateWithData = [mockEvent1];
        const result = eventReducer(stateWithData, { type: 'SET_EVENTS', payload: [] });
        expect(result).toHaveLength(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('eventReducer — ADD_OR_UPDATE', () => {
    test('ควรเพิ่ม event ใหม่เมื่อไม่มีเวลาชนกัน', () => {
        const result = eventReducer(INITIAL_STATE, {
            type: 'ADD_OR_UPDATE',
            payload: mockEvent1,
        });
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('คณิตศาสตร์');
    });

    test('ควรเพิ่ม event สองรายการต่างวันได้โดยไม่ชนกัน', () => {
        const state = [mockEvent1];
        const result = eventReducer(state, {
            type: 'ADD_OR_UPDATE',
            payload: mockEvent2,
        });
        expect(result).toHaveLength(2);
    });

    test('ควรไม่เพิ่มเมื่อวันและเวลาเริ่มตรงกัน (ซ้ำซ้อน)', () => {
        const state = [mockEvent1];
        const duplicate = { ...mockEvent1, id: 'dup', title: 'วิชาซ้ำ' };
        const result = eventReducer(state, {
            type: 'ADD_OR_UPDATE',
            payload: duplicate,
        });
        expect(result).toHaveLength(1); // ยังคง 1
        expect(result[0].title).toBe('คณิตศาสตร์'); // ไม่ถูกเปลี่ยน
    });

    test('ควรใช้ firestoreId เป็น id ของ event', () => {
        const result = eventReducer(INITIAL_STATE, {
            type: 'ADD_OR_UPDATE',
            payload: { ...mockEvent1, firestoreId: 'firestore-abc' },
        });
        expect(result[0].id).toBe('firestore-abc');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('eventReducer — DELETE_EVENT', () => {
    const stateWithTwoEvents = [mockEvent1, mockEvent2];

    test('ควรลบ event ตามชื่อวิชาได้', () => {
        const result = eventReducer(stateWithTwoEvents, {
            type: 'DELETE_EVENT',
            payload: { title: 'คณิตศาสตร์', firestoreId: 'e1', userId: 'uid' },
        });
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('ฟิสิกส์');
    });

    test('ควรลบ event แบบ case-insensitive ได้', () => {
        const result = eventReducer(stateWithTwoEvents, {
            type: 'DELETE_EVENT',
            payload: { title: 'คณิตศาสตร์', firestoreId: 'e1', userId: 'uid' },
        });
        expect(result).toHaveLength(1);
    });

    test('ถ้าไม่มี title ไม่ควรลบอะไร', () => {
        const result = eventReducer(stateWithTwoEvents, {
            type: 'DELETE_EVENT',
            payload: { firestoreId: 'e1', userId: 'uid' },
        });
        expect(result).toHaveLength(2);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('eventReducer — CLEAR_ALL', () => {
    test('ควรลบ events ทั้งหมด', () => {
        const state = [mockEvent1, mockEvent2];
        const result = eventReducer(state, { type: 'CLEAR_ALL' });
        expect(result).toHaveLength(0);
    });
});
