import { createContext, useContext, useState } from "react";
import {
    type IAuth,
    type ILogin,
    type ILoginData,
    type TRegister,
    type TResourceLessResponse,
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

    // Private unsanitised function for setting token
    const [token, _setToken] = useState<TToken>(
        localStorage.getItem(TOKEN_NAME) ?? null
    );

    /**
     * Sanitises the token by removing conflicting characters such as "|" and calls **`_setToken`**
     * @param {TToken} token
     */
    const setToken = (token: TToken) => {
        if (token?.startsWith("|")) {
            token = token.slice(1);
        }
        _setToken(token);
    };
    /**
     * Removes local storage item when **`token`** is falsy.
     * Sets its value in local storage when truthy.
     * @param token
     */
    const setTokenInMemory = (token: TToken) => {
        if (!token || token.trim().length === 0) {
            try {
                // Remove token
                localStorage.removeItem(TOKEN_NAME);
                setToken(null);
            } catch {
                throw new Error("Token doesn't exist.");
            }
        } else {
            localStorage.setItem(TOKEN_NAME, token);
            setToken(token);
        }
    };

    /**
     * Makes register request, on success returns database response
     * @param userData
     * @returns
     */
    const register = async (userData: TRegister) => {
        const response = await fetch(Auth.register, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = (await response.json()) as { message: string };

            throw new Error(errorData.message);
        }

        return (await response.json()) as TResourceLessResponse;
    };

    /**
     * Makes a login request, on success returns the user data and token.
     * @param {ILogin} data - The login data to be sent in the request body
     * @returns {Promise<ILoginData>} - The user data and token on success
     * @throws {Error} - If the credentials are invalid or there is an error with the request
     */
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

    const logout = async () => {
        // Delete this conditional
        if (!token) {
            throw new Error("Token can't be empty");
        }

        const response = await fetch(Auth.logout, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            // Parse error response and throw the message
            const errorData = await response.json();
            throw new Error(errorData.message || "Logout failed");
        }

        setUser(null);
        setToken(null);
        setTokenInMemory(null);

        return response.json();
    };

    const AuthContextValue: IAuth = {
        register: register,
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
