export type AuthStore = {
    user: {
        id: string;
        name: string;
        email: string;
        roles: string[];
    } | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
    isAdmin: () => boolean;
}

export type StoreSet =
    (
        partial: AuthStore |
            Partial<AuthStore> |
            ((state: AuthStore) => AuthStore |
                Partial<AuthStore>),
        replace?: boolean | undefined) => void
