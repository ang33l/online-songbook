"use client"
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    return <div className="flex items-center justify-center mt-10 text-2xl gap-2 flex-col">
        <Button variant={"secondary"} onClick={() => router.push("/")}><ChevronLeftIcon /> Wróć do strony głównej</Button>

        <h1 className="font-bold">404</h1>
        <p className="text-base">Nie znaleziono strony</p>
    </div>
}