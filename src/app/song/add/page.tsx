"use client"
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { notFound } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../../../convex/_generated/api";
import PageLoading from "@/components/loading/PageLoading";
import { Button } from "@/components/ui/button";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useState } from "react";
import NewCategory from "@/components/song/add/newCategory";
import { toast } from "sonner";
import ImportJson from "@/components/song/add/importJson";

const formSchema = z.object({
    title: z.string().min(4, { message: "Tytuł musi mieć co najmniej 4 znaki!" }).max(50),
    text: z.string().min(4, { message: "Tekst musi mieć co najmniej 4 znaki!" }),
    category: z.string().min(1, { message: "Wybierz kategorię!" })
})

export default function Page() {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState("")

    const { isLoading, isAuthenticated } = useConvexAuth();
    const { user } = useUser();
    const isAdmin = useQuery(api.user.isAdmin, { user_id: user?.id || "" })
    const categories = useQuery(api.song.getCategories)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            text: ""
        },

    })
    const addSongMutation = useMutation(api.song.addSingleSong)
    const submitForm = async (values: z.infer<typeof formSchema>) => {
        //setPassword(values.password)
        console.log(values.category, values.text, values.title)
        const result = await addSongMutation({ category: values.category, text: values.text, title: values.title })
        if (result === false) {
            form.setError("root", { message: "Podana kategoria nie istnieje!" })
        } else {
            form.reset()
            setCategory("")
            toast.success("Pomyślnie dodano piosenkę!")
        }

    }

    if (!isLoading && !isAuthenticated) return notFound()
    if (!isLoading && isAdmin === false) return notFound()
    if (isLoading) return <PageLoading />
    return <div className="w-full">
        <div className="max-w-screen-2xl m-auto px-2 py-3">
            <div className="flex gap-2 flex-col sm:flex-row">
                <h1 className="text-2xl font-bold">Dodaj utwór</h1>
                <ImportJson />
                <NewCategory />
            </div>
            <div className="max-w-xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
                        <FormField name="title" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tytuł</FormLabel>
                                <FormControl>
                                    <Input placeholder="Wpisz tytuł..." type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="text" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Treść piosenki</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Wpisz treść..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="category" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Kategoria piosenki</FormLabel>
                                <FormControl>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <div className={'flex gap-1'}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="justify-between flex-1"
                                                >
                                                    {category
                                                        ? categories?.find((c) => c._id === category)?.label
                                                        : "Wybierz kategorię..."}
                                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>

                                            </PopoverTrigger>

                                        </div>
                                        <PopoverContent className=" p-0">
                                            <Command>
                                                <CommandInput placeholder="Wyszukaj kategorię..." className="h-9" />
                                                <CommandEmpty>Nie znaleziono kategorii.</CommandEmpty>
                                                <CommandGroup {...field}>
                                                    {categories?.map((c) => (
                                                        <CommandItem
                                                            key={c._id}
                                                            value={c._id}
                                                            onSelect={(currentValue) => {
                                                                field.onChange(currentValue === category ? "" : currentValue)
                                                                setCategory(currentValue === category ? "" : currentValue)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            {c.label}
                                                            <CheckIcon
                                                                className={cn(
                                                                    "ml-auto h-4 w-4",
                                                                    category === c._id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit">Zapisz</Button>
                    </form>
                </Form>
            </div>

        </div>

    </div>
}