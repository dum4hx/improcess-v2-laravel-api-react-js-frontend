export interface ILogin {
    email: string;
    password: string;
    device_name?: string;
    remember: boolean;
}

export type TUser = {
    id: string;
    name: string;
    email: string;
} | null;

export type TToken = string | null;

export interface ILoginData {
    message?: string;
    user: TUser;
    token: string;
}

export interface IAuth {
    setUser: (user: TUser) => void;
    user: TUser | null;
    setTokenInMemory: (token: string) => void;
    token: TToken;
    login: ({
        email,
        password,
        device_name,
        remember,
    }: ILogin) => Promise<void>;
    logout: (token: TToken) => Promise<void>;
}
