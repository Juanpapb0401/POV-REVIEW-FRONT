export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        roles: string[];
        isActive: boolean;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}
