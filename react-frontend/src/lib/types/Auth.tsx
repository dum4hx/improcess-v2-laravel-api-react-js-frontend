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

export type TRegister = {
    name: string;
    email: string;
    password: string;
    phone: string;
};

export type TResourceLessResponse = {
    message: string;
};

export interface IAuth {
    setUser: (user: TUser) => void;
    user: TUser | null;
    setTokenInMemory: (token: string) => void;
    token: TToken;
    register: (userData: TRegister) => Promise<TResourceLessResponse>;
    login: ({
        email,
        password,
        device_name,
        remember,
    }: ILogin) => Promise<void>;
    logout: () => Promise<void>;
}
