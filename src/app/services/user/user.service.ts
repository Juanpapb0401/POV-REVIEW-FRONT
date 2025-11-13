import { Users } from "../../interfaces/users-response.interface";
import apiService from "../api.service";

const userService = {
    // Obtener todos los usuarios con paginación
    getAll: async (limit: number = 6, offset: number = 2) => {
        const users = await apiService.get<Users[]>(`users?limit=${limit}&offset=${offset}`);
        return users;
    },

    // Obtener un usuario por ID
    getById: async (id: string) => {
        const user = await apiService.get<Users>(`users/${id}`);
        return user;
    },

    // Eliminar un usuario
    delete: async (id: string) => {
        const response = await apiService.delete(`users/${id}`);
        return response;
    },

    // Actualizar roles de un usuario
    updateRoles: async (id: string, roles: string[]) => {
        const response = await apiService.patch<Users>(`users/${id}/roles`, { roles });
        return response;
    },

    // Actualizar información de un usuario
    update: async (id: string, data: Partial<Users>) => {
        const response = await apiService.patch<Users>(`users/${id}`, data);
        return response;
    },

    // Obtener usuario con sus reviews
    getUserWithReviews: async (id: string) => {
        const response = await apiService.get<Users>(`users/${id}`);
        return response;
    }
}

export default userService;