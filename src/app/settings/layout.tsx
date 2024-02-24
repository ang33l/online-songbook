"use client"
import { SidebarNav } from "@/components/settings/sidebar-nav"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@radix-ui/react-scroll-area"

const sidebarNavItems = [
    {
        title: "Utwory i kategorie",
        href: "/settings",
    },
    {
        title: "Dostęp administratora",
        href: "/examples/forms/account",
    },
    {
        title: "Dostęp do aplikacji",
        href: "/examples/forms/appearance",
    },
]
export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="w-full">
        <div className="space-y-6 pt-10 pb-16 px-3   max-w-screen-2xl m-auto">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Ustawienia</h2>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className=" lg:w-1/5">
                    <ScrollArea className="w-full overflow-x-auto">
                        <SidebarNav items={sidebarNavItems} />
                    </ScrollArea>
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>
    </div>
}