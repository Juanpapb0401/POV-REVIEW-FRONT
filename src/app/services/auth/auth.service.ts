import apiService from "../api.service";

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        roles: string[];
    };
}

const authService = {
    login: async (data: LoginData) => {
        const response = await apiService.post<AuthResponse>('auth/login', data, {});

        // Guardar el token en localStorage
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }

        return response;
    },

    register: async (data: RegisterData) => {
        const response = await apiService.post<AuthResponse>('auth/register', data, {});

        // Guardar el token en localStorage después del registro
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }

        return response;
    },

    logout: () => {
        localStorage.removeItem('authToken');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    }
};

export default authService;
