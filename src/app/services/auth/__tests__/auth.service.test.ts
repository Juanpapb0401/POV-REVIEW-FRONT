import authService from '../auth.service';
import apiService from '../../api.service';

// Mock del apiService
jest.mock('../../api.service');

describe('AuthService', () => {
    beforeEach(() => {
        // Limpiar mocks y localStorage antes de cada test
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('login', () => {
        it('debe hacer login correctamente y guardar el token', async () => {
            const mockResponse = {
                token: 'mock-jwt-token',
                user: {
                    id: '1',
                    name: 'Test User',
                    email: 'test@example.com',
                    roles: ['USER']
                }
            };

            (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(apiService.post).toHaveBeenCalledWith('auth/login', {
                email: 'test@example.com',
                password: 'password123'
            }, {});

            expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-jwt-token');
            expect(result).toEqual(mockResponse);
        });

        it('debe manejar errores de login', async () => {
            const mockError = new Error('Invalid credentials');
            (apiService.post as jest.Mock).mockRejectedValue(mockError);

            await expect(authService.login({
                email: 'test@example.com',
                password: 'wrong'
            })).rejects.toThrow('Invalid credentials');

            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
    });

    describe('register', () => {
        it('debe registrar correctamente y guardar el token', async () => {
            const mockResponse = {
                token: 'mock-jwt-token',
                user: {
                    id: '1',
                    name: 'New User',
                    email: 'new@example.com',
                    roles: ['USER']
                }
            };

            (apiService.post as jest.Mock).mockResolvedValue(mockResponse);

            const result = await authService.register({
                name: 'New User',
                email: 'new@example.com',
                password: 'password123'
            });

            expect(apiService.post).toHaveBeenCalledWith('auth/register', {
                name: 'New User',
                email: 'new@example.com',
                password: 'password123'
            }, {});

            expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-jwt-token');
            expect(result).toEqual(mockResponse);
        });

        it('debe manejar errores de registro', async () => {
            const mockError = new Error('Email already exists');
            (apiService.post as jest.Mock).mockRejectedValue(mockError);

            await expect(authService.register({
                name: 'Test',
                email: 'existing@example.com',
                password: 'password123'
            })).rejects.toThrow('Email already exists');

            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('debe eliminar el token del localStorage', () => {
            localStorage.setItem('authToken', 'some-token');

            authService.logout();

            expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
        });
    });

    describe('isAuthenticated', () => {
        it('debe retornar true cuando hay token', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce('mock-token');

            expect(authService.isAuthenticated()).toBe(true);
        });

        it('debe retornar false cuando no hay token', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

            expect(authService.isAuthenticated()).toBe(false);
        });
    });

    describe('getToken', () => {
        it('debe retornar el token del localStorage', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce('mock-token');

            expect(authService.getToken()).toBe('mock-token');
            expect(localStorage.getItem).toHaveBeenCalledWith('authToken');
        });

        it('debe retornar null cuando no hay token', () => {
            (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

            expect(authService.getToken()).toBeNull();
        });
    });
});
