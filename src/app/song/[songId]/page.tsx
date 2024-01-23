"use client"
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

export default function Page({ params }: { params: { songId: string } }) {
    const router = useRouter();
    const { songId } = params;
    const song = useQuery(api.song.getSong, { id: songId })
    if (song?.length === 0) return notFound()
    return <div className="px-2 py-3 flex flex-col items-start">
        <Button variant={"outline"} onClick={() => router.back()}><ChevronLeftIcon /> Wstecz</Button>
        {song ?
            <h1 className="text-2xl font-bold">{song[0].title}</h1> :
            <Skeleton className="w-64 h-8 rounded-sm mb-2" />
        }
        {
            song ? <pre>{song[0].text}</pre>
                :
                <div className="flex flex-col gap-1">
                    {[0, 1, 2, 3, 4, 5].map((_, i) => <Skeleton key={i} className="w-52 h-6 rounded-sm" />)}
                </div>
        }
    </div>
}