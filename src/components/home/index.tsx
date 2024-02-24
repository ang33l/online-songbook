"use client"
import { usePaginatedQuery } from "convex/react";
import Search from "./components/search";
import { api } from "../../../convex/_generated/api";
import { useIntersection, useWindowScroll } from '@mantine/hooks';
import { useEffect, useState } from "react";
import Song from "./components/song";
import { useSearchParams } from 'next/navigation'

export default function HomeContent() {
    const searchParams = useSearchParams()

    const [category, setCategory] = useState(searchParams.get("category") || "")
    const [search, setSearch] = useState(searchParams.get("query") || "")
    const { results, status, loadMore } = usePaginatedQuery(
        api.song.getSongsWithFilter, { filter: search, category: category },
        { initialNumItems: 30 }
    );

    const [scroll, scrollTo] = useWindowScroll();
    useEffect(() => {
        if (entry?.isIntersecting) {
            loadMore(30);
        }
    }, [scroll.y])
    console.log(search)
    const { ref, entry } = useIntersection();
    return (
        <div className="container px-2 max-w-screen-2xl flex flex-col gap-2 px-2 py-3">
            <h1 className="text-2xl font-bold">Znajdź interesujący Cię utwór</h1>
            <Search setSearch={setSearch} setCategory={setCategory} />
            <div className="flex gap-2 flex-col items-start text-xl">
                <div className="text-xl my-2 font-bold">{results?.length === 0 && status !== "LoadingFirstPage" ? "Nie znaleziono piosenek." : "Wyniki wyszukiwania"}</div>
                {
                    results?.map((song, i) => {
                        return <Song song={song} key={song._id} index={i} />
                    })
                }
            </div>
            {
                status === "LoadingMore" ?
                    <div className="text-sm py-4">...</div>
                    : status === "CanLoadMore" && <div ref={ref}></div>
            }

        </div>
    );
}