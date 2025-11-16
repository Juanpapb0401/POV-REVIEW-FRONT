import { authRequestInterceptor } from '../api';

const createLocalStorageMock = () => {
    const store = new Map<string, string>();

    return {
        getItem: jest.fn((key: string) => store.get(key) ?? null),
        setItem: jest.fn((key: string, value: string) => {
            store.set(key, value);
        }),
        removeItem: jest.fn((key: string) => {
            store.delete(key);
        }),
        clear: jest.fn(() => {
            store.clear();
        }),
    };
};

describe('authRequestInterceptor', () => {
    let localStorageMock: ReturnType<typeof createLocalStorageMock>;

    beforeEach(() => {
        localStorageMock = createLocalStorageMock();

        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            configurable: true,
        });
    });

    it('sets Authorization header when token exists', () => {
        window.localStorage.setItem('authToken', 'test-token');
        const baseConfig = { headers: {} } as any;

        const config = authRequestInterceptor(baseConfig);

        expect(config.headers.Authorization).toBe('Bearer test-token');
        expect(config).toBe(baseConfig);
    });

    it('preserves existing headers structure when using set function', () => {
        window.localStorage.setItem('authToken', 'another-token');
        const headers = {
            set: jest.fn(function (this: Record<string, string>, key: string, value: string) {
                this[key] = value;
            }),
        };
        const baseConfig = { headers } as any;

        const config = authRequestInterceptor(baseConfig);

        expect(headers.set).toHaveBeenCalledWith('Authorization', 'Bearer another-token');
        expect((headers as any).Authorization).toBe('Bearer another-token');
        expect(config).toBe(baseConfig);
    });

    it('creates headers object when it is missing', () => {
        window.localStorage.setItem('authToken', 'token-without-headers');
        const baseConfig = {} as any;

        const config = authRequestInterceptor(baseConfig);

        expect(config.headers?.Authorization).toBe('Bearer token-without-headers');
    });

    it('returns config unchanged when token is missing', () => {
        const baseConfig = { headers: {} } as any;

        const config = authRequestInterceptor(baseConfig);

        expect(config.headers.Authorization).toBeUndefined();
        expect(config).toBe(baseConfig);
    });
});

