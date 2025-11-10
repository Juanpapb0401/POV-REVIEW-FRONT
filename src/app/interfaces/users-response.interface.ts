export interface Users {
    id:        string;
    name:      string;
    email:     string;
    password:  string;
    roles:     string[];
    createdAt: Date;
    updatedAt: Date;
    isActive:  boolean;
}
