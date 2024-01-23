"use client"
import { useQuery } from "convex/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    password: z.string().min(4, { message: "Hasło musi zawierać co najmniej 4 znaki!" }).max(50),
})
export default function LoginForm({
    setPassword
}: {
    setPassword: Dispatch<SetStateAction<string>>;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },

    })


    const submitForm = (values: z.infer<typeof formSchema>) => {
        setPassword(values.password)
    }

    return (<div className="w-[100dvw] h-[100dvh] flex flex-col items-center justify-center">
        <div className="border py-12 px-8 rounded-md shadow-sm">
            <h1 className="text-xl">Zaloguj się do śpiewnika</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
                    <FormField name="password" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hasło</FormLabel>
                            <FormControl>
                                <Input placeholder="Wpisz hasło..." type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit">Zaloguj</Button>
                </form>
            </Form>
        </div>
    </div>
    );
}