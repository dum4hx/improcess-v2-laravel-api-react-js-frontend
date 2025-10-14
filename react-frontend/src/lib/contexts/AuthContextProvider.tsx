import { createContext, useContext, useState } from "react";
import {
    type IAuth,
    type ILogin,
    type ILoginData,
    type TToken,
    type TUser,
} from "../types/Auth";
import { Auth } from "../api/endpoints";

// Initialize context
const AuthContext = createContext<IAuth | undefined>(undefined);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const TOKEN_NAME = "app:access-token";

    // Get states for user and token
    const [user, setUser] = useState<TUser>(null);
    const [token, setToken] = useState<TToken>(
        localStorage.getItem(TOKEN_NAME) ?? ""
    );

    /**
     * Removes local storage item when **`token`** is falsy.
     * Sets its value in local storage when truthy.
     * @param token
     */
    const setTokenInMemory = (token: TToken) => {
        if (!token || token.trim().length === 0) {
            try {
                localStorage.removeItem(TOKEN_NAME);
            } catch {
                throw new Error("Token doesn't exist.");
            }
        } else {
            localStorage.setItem(TOKEN_NAME, token);
        }
    };

    const login = async ({
        email,
        password,
        device_name = "app:react",
        remember = false,
    }: ILogin) => {
        const response = await fetch(Auth.login, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, device_name }),
        });

        if (!response.ok) {
            throw new Error(
                "Invalid credentials. Enter a valid email and password."
            );
        }

        const data: ILoginData = await response.json();

        setUser(data.user);
        setToken(data.token);

        // Save data
        if (remember) {
            setTokenInMemory(data.token);
        }
        console.log(data);
    };

    // Define logout function call
    const logout = async (token: TToken) => {
        const response = await fetch(Auth.logout, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error while loggint out. Try again later.");
        }

        // Clear user data and token
        setUser(null);
        setToken(null);
        setTokenInMemory(null);
    };

    const AuthContextValue: IAuth = {
        login: login,
        logout: logout,
        setUser: setUser,
        setTokenInMemory: setTokenInMemory,
        user: user,
        token: token,
    };
    // Return context
    return (
        <AuthContext.Provider value={AuthContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthContextProvider");
    }
    return context;
};
