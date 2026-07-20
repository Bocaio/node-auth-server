export interface IUserService {
    getUser: (email: string) => Promise<User>;
}

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}
