import { Outlet } from "react-router-dom";
import Button from "../lib/components/Button";
import { useAuth } from "../lib/contexts/AuthContextProvider";
import { useState } from "react";

export default function DefaultLayout() {
    const { logout, token } = useAuth();
    const localToken = localStorage.getItem("app:access-token");
    const [error, setError] = useState<string | null>(null);

    const onClick = async () => {
        setError(null);
        try {
            await logout();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else if (typeof e === "string") {
                setError(e);
            } else {
                setError("An unexpected error occurred.");
            }
            console.error(e);
        }
    };

    return (
        <>
            <p>{localToken ?? "local token emtpy"}</p>
            <p>{token ?? "statefull token emtpy"}</p>
            <Button text="Logout" onClick={onClick} />
            {error && <div className="text-red-600">{error}</div>}
            <Outlet />
        </>
    );
}
