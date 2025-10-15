import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/contexts/AuthContextProvider";
import { useEffect } from "react";

export default function GuestLayout() {
    const { token } = useAuth();
    const navigate = useNavigate();

    // Send user to home page if already logged
    useEffect(() => {
        if (token) {
            navigate("/home");
        }
    });

    return (
        <>
            <Outlet />
        </>
    );
}
