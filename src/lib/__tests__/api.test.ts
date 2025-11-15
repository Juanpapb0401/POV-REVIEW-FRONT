import { authRequestInterceptor } from '../api';

describe('authRequestInterceptor', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('sets Authorization header when token exists', () => {
        localStorage.setItem('authToken', 'test-token');
        const baseConfig = { headers: {} } as any;

        const config = authRequestInterceptor(baseConfig);

        expect(config.headers.Authorization).toBe('Bearer test-token');
        expect(config).toBe(baseConfig);
    });

    it('preserves existing headers structure when using set function', () => {
        localStorage.setItem('authToken', 'another-token');
        const headers = {
            set: jest.fn(function (key: string, value: string) {
                (this as any)[key] = value;
            }),
        };
        const baseConfig = { headers } as any;

        const config = authRequestInterceptor(baseConfig);

        expect(headers.set).toHaveBeenCalledWith('Authorization', 'Bearer another-token');
        expect((headers as any).Authorization).toBe('Bearer another-token');
        expect(config).toBe(baseConfig);
    });

    it('returns config unchanged when token is missing', () => {
        const baseConfig = { headers: {} } as any;

        const config = authRequestInterceptor(baseConfig);

        expect(config.headers.Authorization).toBeUndefined();
        expect(config).toBe(baseConfig);
    });
});

