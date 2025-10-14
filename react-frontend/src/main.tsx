import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { AuthContextProvider } from "./lib/contexts/AuthContextProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
            <RouterProvider router={router} />
        </AuthContextProvider>
    </QueryClientProvider>
);
