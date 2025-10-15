import { useState } from "react";
import { useAuth } from "../../lib/contexts/AuthContextProvider";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const { login } = useAuth();

    const { mutate } = useMutation({
        mutationFn: () => login({ email, password, remember }),
        onSuccess: () => {
            const navigate = useNavigate();
            navigate("/home");
        },
    });

    /**
     * Handles form submission by calling the mutate function from react-query.
     * Prevents default form submission behavior by calling **`e.preventDefault()`**
     * @param {React.FormEvent} e - The form submission event.
     */
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate();
    };
    return (
        <div>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <button type="submit">Log in</button>
                </div>
            </form>
        </div>
    );
}
