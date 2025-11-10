import { Users } from "../../interfaces/users-response.interface";
import apiService  from "../api.service";

const userService = {


    getAll: async(limit:number=6, offset:number= 2) =>{
        const users = await apiService.get<Users[]>(`users?limit=${limit}&offset=${offset}`);
        return users;
    }
}

export default userService;