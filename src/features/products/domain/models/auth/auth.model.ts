export interface User {
    id: string;
    email: string;
    username: string;
}

export interface AuthResponseData {
    accessToken: string;
    user: User;
}