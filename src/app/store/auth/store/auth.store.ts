import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthStore } from "../interfaces/type";
import authService from "@/src/app/services/auth/auth.service";


export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                const response = await authService.login({ email, password });

                // El backend no retorna el user en el login, así que lo obtenemos del perfil
                const userProfile = await authService.getProfile();

                set({
                    user: userProfile,
                    token: response.token,
                    isAuthenticated: true
                });
            }, register: async (name: string, email: string, password: string) => {
                const response = await authService.register({ name, email, password });
                set((state) => ({
                    ...state,
                    user: response.user,
                    token: response.token,
                    isAuthenticated: true
                }));
            },

            logout: () => {
                authService.logout();
                return set((state) => ({
                    ...state,
                    user: null,
                    token: null,
                    isAuthenticated: false
                }));
            },

            checkAuth: () => {
                const token = authService.getToken();
                const isAuth = authService.isAuthenticated();

                if (isAuth && token) {
                    return set((state) => ({ ...state, isAuthenticated: true, token }));
                } else {
                    return set((state) => ({ ...state, isAuthenticated: false, token: null, user: null }));
                }
            },

            isAdmin: () => {
                const { user } = get();
                return user?.roles?.includes('admin') || false;
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);
