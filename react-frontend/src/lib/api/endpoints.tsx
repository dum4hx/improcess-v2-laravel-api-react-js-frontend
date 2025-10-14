const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

export const Auth = {
    login: BASE_URL + "auth/" + "login",
    logout: BASE_URL + "auth/" + "logout",
    register: BASE_URL + "auth/" + "register",
};
