/**
 * Unit Tests — Form Validation Logic
 * ทดสอบ input validation ที่ใช้ใน CreateScreen, CreateExamScreen, ActivityScreen
 */

// ─── Validation functions (extracted from screens for testing) ────────────────

/** CreateScreen: ตรวจสอบฟอร์มเพิ่มวิชาเรียน */
const validateClassForm = (form) => {
    if (!form.title || !form.title.trim()) return { valid: false, message: 'กรุณากรอกชื่อวิชา' };
    if (!form.startTime) return { valid: false, message: 'กรุณาเลือกเวลาเริ่ม' };
    if (!form.endTime) return { valid: false, message: 'กรุณาเลือกเวลาจบ' };
    if (form.endTime <= form.startTime) return { valid: false, message: 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น' };
    return { valid: true };
};

/** CreateExamScreen: ตรวจสอบฟอร์มเพิ่มตารางสอบ */
const validateExamForm = (form) => {
    if (!form.title || !form.title.trim()) return { valid: false, message: 'กรุณากรอกชื่อวิชา' };
    if (!form.date) return { valid: false, message: 'กรุณาเลือกวันที่สอบ' };
    if (!form.startTime || !form.endTime) return { valid: false, message: 'กรุณาเลือกเวลา' };
    return { valid: true };
};

/** ActivityScreen: ตรวจสอบ input ก่อนบันทึกกิจกรรม */
const validateActivityInput = (text) => {
    if (!text || !text.trim()) return false;
    return true;
};

/** Login: ตรวจสอบ email และ password */
const validateLoginForm = (email, password) => {
    if (!email || !password) return { valid: false, message: 'กรุณากรอก Email และ Password ให้ครบ' };
    if (!email.includes('@')) return { valid: false, message: 'รูปแบบ Email ไม่ถูกต้อง' };
    if (password.length < 6) return { valid: false, message: 'Password ต้องมีอย่างน้อย 6 ตัวอักษร' };
    return { valid: true };
};

// ═════════════════════════════════════════════════════════════════════════════
describe('validateClassForm — เพิ่มวิชาเรียน', () => {
    const validForm = { title: 'คณิตศาสตร์', day: 'Monday', startTime: '09:00', endTime: '12:00' };

    test('ฟอร์มที่ถูกต้องควร pass validation', () => {
        expect(validateClassForm(validForm).valid).toBe(true);
    });

    test('ไม่มีชื่อวิชาควร fail', () => {
        const result = validateClassForm({ ...validForm, title: '' });
        expect(result.valid).toBe(false);
    });

    test('ชื่อวิชาเป็นช่องว่างควร fail', () => {
        const result = validateClassForm({ ...validForm, title: '   ' });
        expect(result.valid).toBe(false);
    });

    test('เวลาจบน้อยกว่าเวลาเริ่มควร fail', () => {
        const result = validateClassForm({ ...validForm, startTime: '12:00', endTime: '09:00' });
        expect(result.valid).toBe(false);
        expect(result.message).toContain('เวลาสิ้นสุด');
    });

    test('เวลาจบเท่ากับเวลาเริ่มควร fail', () => {
        const result = validateClassForm({ ...validForm, startTime: '09:00', endTime: '09:00' });
        expect(result.valid).toBe(false);
    });

    test('ไม่มีเวลาเริ่มควร fail', () => {
        const result = validateClassForm({ ...validForm, startTime: '' });
        expect(result.valid).toBe(false);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('validateExamForm — เพิ่มตารางสอบ', () => {
    const validExam = { title: 'คณิต Final', date: '15/03/2026', startTime: '09:00', endTime: '12:00' };

    test('ฟอร์มที่ถูกต้องควร pass validation', () => {
        expect(validateExamForm(validExam).valid).toBe(true);
    });

    test('ไม่มีชื่อวิชาควร fail', () => {
        expect(validateExamForm({ ...validExam, title: '' }).valid).toBe(false);
    });

    test('ไม่มีวันที่ควร fail', () => {
        expect(validateExamForm({ ...validExam, date: '' }).valid).toBe(false);
    });

    test('ไม่มีเวลาควร fail', () => {
        expect(validateExamForm({ ...validExam, startTime: '' }).valid).toBe(false);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('validateActivityInput — เพิ่มกิจกรรม', () => {
    test('ชื่อที่มีข้อความควร pass', () => {
        expect(validateActivityInput('ไปห้างสรรพสินค้า')).toBe(true);
    });

    test('ข้อความว่างควร fail', () => {
        expect(validateActivityInput('')).toBe(false);
    });

    test('null ควร fail', () => {
        expect(validateActivityInput(null)).toBe(false);
    });

    test('ช่องว่างอย่างเดียวควร fail', () => {
        expect(validateActivityInput('   ')).toBe(false);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('validateLoginForm — เข้าสู่ระบบ', () => {
    test('email และ password ที่ถูกต้องควร pass', () => {
        expect(validateLoginForm('user@example.com', 'password123').valid).toBe(true);
    });

    test('ไม่มี email ควร fail', () => {
        expect(validateLoginForm('', 'password123').valid).toBe(false);
    });

    test('ไม่มี password ควร fail', () => {
        expect(validateLoginForm('user@example.com', '').valid).toBe(false);
    });

    test('email ไม่มี @ ควร fail', () => {
        const result = validateLoginForm('invalidemail.com', 'password123');
        expect(result.valid).toBe(false);
    });

    test('password น้อยกว่า 6 ตัวควร fail', () => {
        const result = validateLoginForm('user@example.com', '123');
        expect(result.valid).toBe(false);
    });

    test('ทั้ง email และ password ว่างควร fail', () => {
        expect(validateLoginForm('', '').valid).toBe(false);
    });
});
