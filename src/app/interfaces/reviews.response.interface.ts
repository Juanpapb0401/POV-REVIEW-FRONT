export interface Reviews {
    id:        string;
    name:      string;
    rating:    number;
    comment:   string;
    movie:     Movie;
    user:      User;
    createdAt: Date;
    updatedAt: Date;
}

export interface Movie {
    id:          string;
    title:       string;
    description: string;
    director:    string;
    releaseDate: Date;
    genre:       string;
    createdAt:   Date;
    updatedAt:   Date;
}

export interface User {
    id:        string;
    name:      string;
    email:     string;
    roles:     string[];
    createdAt: Date;
    updatedAt: Date;
    isActive:  boolean;
}
