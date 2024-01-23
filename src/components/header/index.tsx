"use client"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils";
import Link from "next/link"
import { Skeleton } from "../ui/skeleton";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, TextAlignJustifyIcon, EnterIcon, ExitIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "../ui/scroll-area";
import { Authenticated, Unauthenticated, AuthLoading, useQuery } from "convex/react";
import { SignInButton, SignOutButton } from "@clerk/clerk-react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { usePathname } from 'next/navigation';


export default function Header() {
    const { user } = useUser()
    const links = useQuery(api.path.getPaths, { user_id: user?.id })
    const path = usePathname();

    const { setTheme } = useTheme()

    return <header className="sticky flex flex-col  items-center top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-2">
        <div className="container px-2 flex items-center justify-between max-w-screen-2xl">
            <div className="flex items-center gap-2">

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size={"icon"} className="flex md:hidden">
                            <TextAlignJustifyIcon className="h-8 w-8" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={"left"}>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-[100vh] rounded-md">
                            <div className="flex flex-col">
                                {links?.map((link) => (
                                    <Link href={link.link} legacyBehavior passHref key={link.link} >
                                        <Button variant={path === link.link ? 'secondary' : 'ghost'} className={`${path === link.link && 'font-bold'} justify-start`}>
                                            {link.label}
                                        </Button>
                                    </Link>

                                ))}
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
                <Link href="/" className="font-bold text-lg">
                    Śpiewnik
                </Link>
                <NavigationMenu>
                    <NavigationMenuList className="hidden md:flex">
                        {links?.map((link) => (
                            <NavigationMenuItem key={link.link}>
                                <Link href={link.link} legacyBehavior passHref>
                                    <NavigationMenuLink active={path === link.link} className={cn(navigationMenuTriggerStyle(), `${path === link.link && 'font-bold'}`)}>
                                        {link.label}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        )
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">

                            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Zmień motyw</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Jasny
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Ciemny
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            Systemowy
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AuthLoading><Skeleton className="w-24 h-10" /></AuthLoading>
                <Authenticated>
                    <SignOutButton>
                        <Button variant="secondary" className="flex gap-1">
                            <ExitIcon />Wyloguj się
                        </Button>
                    </SignOutButton>
                </Authenticated>
                <Unauthenticated>
                    <SignInButton mode="modal">
                        <Button variant="secondary" className="flex gap-1">
                            <EnterIcon />
                            Logowanie
                        </Button>
                    </SignInButton>
                </Unauthenticated>

            </div>
        </div>
    </header>
}