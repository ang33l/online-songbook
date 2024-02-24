"use server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api.js";
import { Song } from "@/types/song";


const path = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const client = new ConvexHttpClient(path);


export default async function addSongsFromJson (JSONFile: Array<Song>) {
    if(JSONFile === undefined){
        return false;
    }
    if(JSONFile === null){
        return false;
    }
    try{
        JSONFile.forEach(async (element: Song)  => {
            if(element.song_title === undefined || element.song_text === undefined){
                return false;
            }
            if(element.song_title === null || element.song_text === null){
                return false;
            }
            if(element.song_title.length < 4 || element.song_text.length < 4){
                return false;
            }
            await client.mutation(api.song.addSingleSong, {
                title: element.song_title,
                text: element.song_text,
                category: element.category || ""
              }); 
    
        });
        return true;
    }  catch (e: any) {
        console.error(e);
        return false;
    }
    
}