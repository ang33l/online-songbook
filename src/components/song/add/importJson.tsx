import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useState } from "react"
import { toast } from "sonner"
import addSongsFromJson from "./(actions)/addSongsFromJson"
import { Song } from "@/types/song";

const formSchema = z.object({
    file: z.string().min(1, { message: "Plik nie może być pusty!" }),
})
export default function ImportJson() {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            file: "",
        },

    })
    // const categoryMutation = useMutation(api.song.addCategory)
    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { file } = event.target as HTMLFormElement;
        if (!file || !file.files[0]) {
            form.setError("file", { message: "Musisz dołączyć plik!" });
            return;
        }
        const blob = new Blob([file.files[0]]);

        const formData = new FormData();
        //formData.append("file", blob, file.files[0].name);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                if (e.target?.result) {
                    const json = Array.from(JSON.parse(e.target.result as string));
                    const parsed: Song[] = [];
                    json.forEach((element: any) => {
                        if (element.song_title === undefined || element.song_text === undefined) {
                            return false;
                        }
                        parsed.push({
                            song_title: element.song_title,
                            song_text: element.song_text,
                            category: element.category || ""
                        })
                    })
                    if (parsed.length === 0) {
                        form.setError("file", { message: "Plik nie zawiera poprawnych danych!" });
                        return;
                    }
                    const result = await addSongsFromJson(parsed);

                    if (!result) {
                        throw new Error("Podczas dodawania piosenek wystąpił błąd!")
                    } else {
                        setOpen(false)
                        toast.success("Pomyślnie dodano piosenki!")
                    }
                    form.reset();
                }
            };
            reader.readAsText(blob);
        } catch (e: any) {
            form.setError("root", { message: e })
            console.error(e);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Dodaj z pliku json</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={submitForm} className="space-y-2">
                        <DialogHeader>
                            <DialogTitle>Dodaj piosenki z pliku json</DialogTitle>
                        </DialogHeader>
                        <div>
                            Plik musi mieć format json oraz następującą strukturę:
                            <pre className="overflow-x-auto max-w-full text-xs">{`[
    {
        "song_title": "Tytuł piosenki",
        "song_text": "Treść piosenki",
        "category": "Kategoria piosenki"
    }...
]`}</pre>
                        </div>
                        <FormField name="file" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Plik</FormLabel>
                                <FormControl>
                                    <Input type="file" placeholder="Wpisz nazwę kategorii..." {...field} accept=".json" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {form.formState.errors.root && <FormMessage>{form.formState.errors.root.message}</FormMessage>}
                        <DialogFooter>
                            <Button type="submit">Prześlij plik</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}