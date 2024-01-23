
"use client"
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import LoginForm from "./components/login";
import { toast } from "sonner";
import { useCookies } from 'react-cookie';
import PageLoading from "../loading/PageLoading";

export default function AccessProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const passwordQuery = useQuery(api.password.verifyPassword, { password })
    const [cookies, setCookie, removeCookie] = useCookies(['password']);
    const [firstLoad, setFirstLoad] = useState(false)
    useEffect(() => {
        if (cookies.password !== undefined) {
            setPassword(cookies.password + "")
        }
        setFirstLoad(true)
    }, [])

    useEffect(() => {
        if (passwordQuery !== undefined) {
            setIsAuthenticated(passwordQuery)
            if (password.length > 0 && !passwordQuery) {
                toast.error("Nieprawidłowe hasło!")
                removeCookie('password')
            } else if (password.length > 0 && passwordQuery) {
                toast.success("Pomyślnie zalogowano!")
                setCookie('password', password as string, { path: '/' })
            }
        }
    }, [passwordQuery])


    return (
        <>
            {!firstLoad || passwordQuery === undefined ? <PageLoading /> : isAuthenticated ? children : <LoginForm setPassword={setPassword} />}
        </>
    );
}