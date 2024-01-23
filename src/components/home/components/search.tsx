"use client"
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CaretSortIcon, CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function Search(
    { setSearch, setCategory: _setCategory }: { setSearch: Dispatch<SetStateAction<string>>, setCategory: Dispatch<SetStateAction<string>> }
) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState(searchParams.get("category") || "")
    const searchRef = useRef<HTMLInputElement>(null)
    const categories = useQuery(api.song.getCategories)
    const onSubmit = () => {
        setSearch(searchRef.current?.value || "")
        _setCategory(category)
        const params = new URLSearchParams();
        if (searchRef.current?.value && searchRef.current.value.length > 0) params.append("query", searchRef.current.value)
        if (category && category.length > 0) params.append("category", category)
        router.push(`/?${params.toString()}`)
    }
    return (
        <div className="flex flex-col md:flex-row gap-1 max-w-lg">
            <Input type="search" placeholder="Wyszukaj..." ref={searchRef} defaultValue={searchParams.get("query") || ""} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between"
                    >
                        {category
                            ? categories?.find((c) => c._id === category)?.label
                            : "Wybierz kategorię..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                    <Command>
                        <CommandInput placeholder="Wyszukaj kategorię..." className="h-9" />
                        <CommandEmpty>Nie znaleziono kategorii.</CommandEmpty>
                        <CommandGroup>
                            {categories?.map((c) => (
                                <CommandItem
                                    key={c._id}
                                    value={c._id}
                                    onSelect={(currentValue) => {
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
            <Button className="gap-1" onClick={onSubmit}><MagnifyingGlassIcon /> Szukaj </Button>
        </div>
    )
}