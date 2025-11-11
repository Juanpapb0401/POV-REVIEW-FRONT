import { User } from "@/POV-REVIEW/src/users/entities/user.entity";
import { Users } from "@/src/app/interfaces/users-response.interface"

export type UserStore = {
    users: Array<Users>;
    getUsers: (limit:number, offset:number) => Promise<void>;
}

export type StoreSet = 
(
    partial: UserStore |
             Partial<UserStore> |
             ((state: UserStore) => UserStore |
                Partial<UserStore>),
    replace?: boolean | undefined) => void