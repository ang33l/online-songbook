import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

export default function Song({ song, index }: {
    song: {
        _id: Id<"song">;
        _creationTime: number;
        title: string;
        text: string;
        category: Id<"category">;
    }
    index: number
}) {
    return (
        <Link href={`/song/${song._id}`} className="border-b">
            <p>{index + 1}. {song.title}</p>
        </Link>
    )
}