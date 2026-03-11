// __mocks__/firebase.js
// Mock all Firebase modules to avoid real network calls in tests

const mockAuth = {
    currentUser: { uid: 'test-uid-123', email: 'test@test.com' },
};

const mockDb = {};

module.exports = {
    // firebase/auth
    signInWithEmailAndPassword: jest.fn(() =>
        Promise.resolve({ user: { uid: 'test-uid-123', email: 'test@test.com', displayName: 'Test User' } })
    ),
    signOut: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() =>
        Promise.resolve({ user: { uid: 'new-uid-456', email: 'new@test.com' } })
    ),
    onAuthStateChanged: jest.fn((auth, cb) => { cb({ uid: 'test-uid-123' }); return jest.fn(); }),
    deleteUser: jest.fn(() => Promise.resolve()),
    // firebase/firestore
    collection: jest.fn(() => ({})),
    addDoc: jest.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
    getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
    getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({ fullname: 'Test', email: 'test@test.com' }) })),
    doc: jest.fn(() => ({})),
    deleteDoc: jest.fn(() => Promise.resolve()),
    updateDoc: jest.fn(() => Promise.resolve()),
    setDoc: jest.fn(() => Promise.resolve()),
    // firebase/app
    initializeApp: jest.fn(() => ({})),
    getApps: jest.fn(() => []),
    getApp: jest.fn(() => ({})),
    // firebase/auth (named)
    getAuth: jest.fn(() => mockAuth),
    // firebase/firestore (named)
    getFirestore: jest.fn(() => mockDb),
    // Default exports pattern
    auth: mockAuth,
    db: mockDb,
};
