require('@testing-library/jest-dom')

// Mock de localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    },
    writable: true
});

// Mock de window.alert
global.alert = jest.fn();

// Mock de window.confirm
global.confirm = jest.fn(() => true);
