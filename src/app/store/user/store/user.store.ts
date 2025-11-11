import { create } from "zustand";
import { UserStore } from "../interfaces/type";
import userService from "@/src/app/services/user/user.service";
import { Users } from "@/src/app/interfaces/users-response.interface";


export const useUserStore = create<UserStore>()((set) => ({
    users: [],
    getUsers: async(limit:number = 10, offset: number = 1) => {
            const users: Users[] = await userService.getAll(limit, offset);
            return set((state) => ({...state, users}))
    }
}))