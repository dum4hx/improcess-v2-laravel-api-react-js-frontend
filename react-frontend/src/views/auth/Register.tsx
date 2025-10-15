import type React from "react";
import { useState } from "react";
import { useAuth } from "../../lib/contexts/AuthContextProvider";
import { useMutation } from "@tanstack/react-query";

export default function Register() {
    // Get register function
    const { register } = useAuth();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const { mutate } = useMutation({
        mutationFn: () => {
            return register({ name, email, password, phone });
        },
        onSuccess: (data) =>
            setSuccessMessage(data.message ?? "Logged in successfully"),
        onError: (error) => setError(error.message),
    });
    /**
     * Prevents form submission and resquests user registration to backend
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate();
        console.log("Mutate called");
    };
    return (
        <div>
            <h1 className="text-green-600">{successMessage}</h1>
            <h1 className="text-red-600">{error}</h1>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="tel"
                        onChange={(e) => {
                            setPhone(e.target.value);
                        }}
                    />
                    <button
                        type="submit"
                        className="border-2 hover:cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
