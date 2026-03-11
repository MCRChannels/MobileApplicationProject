/**
 * Unit Tests — Utility / Business Logic Functions
 * ทดสอบ pure functions ที่ไม่ต้องพึ่งพา React หรือ Firebase
 */

// ─── parseCustomDate (จาก DashBoardScreen) ────────────────────────────────────
const parseCustomDate = (dateString) => {
    if (!dateString) return null;

    // Handle "DD/MM/YYYY"
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
    }

    // Handle "YYYY-MM-DD"
    if (dateString.includes('-') && dateString.length === 10) {
        const [y, m, d] = dateString.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    // Handle Thai short month format (e.g. "15 มี.ค. 2026")
    const thaiMonths = {
        'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3,
        'พ.ค.': 4, 'มิ.ย.': 5, 'ก.ค.': 6, 'ส.ค.': 7,
        'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11,
    };
    const thaiParts = dateString.trim().split(' ');
    if (thaiParts.length >= 3) {
        const day = parseInt(thaiParts[0]);
        const month = thaiMonths[thaiParts[1]];
        const year = parseInt(thaiParts[2]) - 543; // Buddhist to CE
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }

    return null;
};

// ─── findConflictingClass (จาก ActivityScreen) ────────────────────────────────
const findConflictingClass = (events, activityDate) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[activityDate.getDay()];
    const actMinutes = activityDate.getHours() * 60 + activityDate.getMinutes();

    return events.find(e => {
        if (e.day !== dayName) return false;
        const [startH, startM] = e.startTime.split(':').map(Number);
        const [endH, endM] = e.endTime.split(':').map(Number);
        const classStart = startH * 60 + startM;
        const classEnd = endH * 60 + endM;
        return actMinutes >= classStart && actMinutes < classEnd;
    });
};

// ─── Time Overlap Checker (จาก CreateScreen) ──────────────────────────────────
const checkTimeOverlap = (events, day, newStart, newEnd) => {
    const [newStartH, newStartM] = newStart.split(':').map(Number);
    const [newEndH, newEndM] = newEnd.split(':').map(Number);
    const newStartMin = newStartH * 60 + newStartM;
    const newEndMin = newEndH * 60 + newEndM;

    return events.find(e => {
        if (e.day !== day) return false;
        const [eStartH, eStartM] = e.startTime.split(':').map(Number);
        const [eEndH, eEndM] = e.endTime.split(':').map(Number);
        const eStart = eStartH * 60 + eStartM;
        const eEnd = eEndH * 60 + eEndM;
        return newStartMin < eEnd && newEndMin > eStart;
    });
};

// ═════════════════════════════════════════════════════════════════════════════
describe('parseCustomDate', () => {
    test('ควรแปลง DD/MM/YYYY ได้ถูกต้อง', () => {
        const result = parseCustomDate('15/03/2026');
        expect(result.getDate()).toBe(15);
        expect(result.getMonth()).toBe(2); // 0-indexed
        expect(result.getFullYear()).toBe(2026);
    });

    test('ควรแปลง YYYY-MM-DD ได้ถูกต้อง', () => {
        const result = parseCustomDate('2026-03-15');
        expect(result.getDate()).toBe(15);
        expect(result.getMonth()).toBe(2);
        expect(result.getFullYear()).toBe(2026);
    });

    test('ควรแปลงรูปแบบวันที่ภาษาไทย ได้ถูกต้อง', () => {
        const result = parseCustomDate('15 มี.ค. 2569'); // 2569 BE = 2026 CE
        expect(result.getDate()).toBe(15);
        expect(result.getMonth()).toBe(2);
        expect(result.getFullYear()).toBe(2026);
    });

    test('ควร return null เมื่อไม่มี input', () => {
        expect(parseCustomDate(null)).toBeNull();
        expect(parseCustomDate(undefined)).toBeNull();
        expect(parseCustomDate('')).toBeNull();
    });

    test('ควรแยกแยะเดือนต่างๆ ได้ถูกต้อง – มกราคม', () => {
        const result = parseCustomDate('01/01/2026');
        expect(result.getMonth()).toBe(0); // January
    });

    test('ควรแยกแยะเดือนต่างๆ ได้ถูกต้อง – ธันวาคม', () => {
        const result = parseCustomDate('31/12/2026');
        expect(result.getMonth()).toBe(11); // December
        expect(result.getDate()).toBe(31);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
const mondayClass = {
    day: 'Monday',
    title: 'คณิตศาสตร์',
    startTime: '09:00',
    endTime: '12:00',
};

describe('findConflictingClass', () => {
    // Monday 2026-03-09 is a real Monday
    const MondayAt1000 = new Date(2026, 2, 9, 10, 0); // Mon 10:00
    const MondayAt0800 = new Date(2026, 2, 9, 8, 0);  // Mon 08:00 (before class)
    const MondayAt1200 = new Date(2026, 2, 9, 12, 0); // Mon 12:00 (exactly end — not included)
    const TuesdayAt1000 = new Date(2026, 2, 10, 10, 0); // Tue 10:00

    test('ควร detect conflict เมื่อกิจกรรมอยู่ในช่วงเวลาเรียน', () => {
        const conflict = findConflictingClass([mondayClass], MondayAt1000);
        expect(conflict).toBeDefined();
        expect(conflict.title).toBe('คณิตศาสตร์');
    });

    test('ไม่ควร detect conflict เมื่อกิจกรรมก่อนเวลาเรียน', () => {
        const conflict = findConflictingClass([mondayClass], MondayAt0800);
        expect(conflict).toBeUndefined();
    });

    test('ไม่ควร detect conflict เมื่อกิจกรรมพอดีเวลาสิ้นสุดวิชา (endTime exclusive)', () => {
        const conflict = findConflictingClass([mondayClass], MondayAt1200);
        expect(conflict).toBeUndefined();
    });

    test('ไม่ควร detect conflict เมื่อกิจกรรมอยู่คนละวัน', () => {
        const conflict = findConflictingClass([mondayClass], TuesdayAt1000);
        expect(conflict).toBeUndefined();
    });

    test('ควรทำงานได้เมื่อ events array ว่างเปล่า', () => {
        const conflict = findConflictingClass([], MondayAt1000);
        expect(conflict).toBeUndefined();
    });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('checkTimeOverlap (class schedule)', () => {
    const existingEvents = [
        { day: 'Monday', title: 'คณิต', startTime: '09:00', endTime: '12:00' },
        { day: 'Tuesday', title: 'ฟิสิกส์', startTime: '13:00', endTime: '15:00' },
    ];

    test('ควร detect overlap เมื่อเวลาใหม่ทับซ้อนกับวิชาที่มีอยู่', () => {
        const result = checkTimeOverlap(existingEvents, 'Monday', '10:00', '11:00');
        expect(result).toBeDefined();
        expect(result.title).toBe('คณิต');
    });

    test('ควร detect overlap เมื่อวิชาใหม่เริ่มก่อนแต่จบระหว่างกลาง', () => {
        const result = checkTimeOverlap(existingEvents, 'Monday', '08:00', '10:00');
        expect(result).toBeDefined();
    });

    test('ไม่ควร detect overlap เมื่อต่างวันกัน', () => {
        const result = checkTimeOverlap(existingEvents, 'Wednesday', '09:00', '12:00');
        expect(result).toBeUndefined();
    });

    test('ไม่ควร detect overlap เมื่อเวลาไม่ชนกันเลย (ก่อนหน้า)', () => {
        const result = checkTimeOverlap(existingEvents, 'Monday', '07:00', '09:00');
        expect(result).toBeUndefined(); // ends exactly at 09:00 = no overlap
    });

    test('ไม่ควร detect overlap เมื่อเวลาไม่ชนกันเลย (หลัง)', () => {
        const result = checkTimeOverlap(existingEvents, 'Monday', '12:00', '14:00');
        expect(result).toBeUndefined();
    });

    test('ควร detect overlap วิชา Tuesday ได้ถูกต้อง', () => {
        const result = checkTimeOverlap(existingEvents, 'Tuesday', '13:30', '14:00');
        expect(result).toBeDefined();
        expect(result.title).toBe('ฟิสิกส์');
    });

    test('ควรทำงานได้เมื่อไม่มีวิชาเรียนเลย', () => {
        const result = checkTimeOverlap([], 'Monday', '09:00', '12:00');
        expect(result).toBeUndefined();
    });
});
