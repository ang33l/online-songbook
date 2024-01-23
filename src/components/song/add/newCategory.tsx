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

const formSchema = z.object({
    category_name: z.string().min(1, { message: "Nazwa kategorii nie moze być pusta!" }).max(50),
})
export default function NewCategory() {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category_name: "",
        },

    })
    const categoryMutation = useMutation(api.song.addCategory)
    const submitForm = async (values: z.infer<typeof formSchema>) => {
        const result = await categoryMutation({ name: values.category_name })
        console.log(result)
        if (!result) {
            form.setError("root", { message: "Podana kategoria już istnieje!" })
        } else {
            setOpen(false)
            toast.success("Pomyślnie dodano kategorię!")
        }

    }
    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" ><PlusIcon /> Dodaj kategorię</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
                    <DialogHeader>
                        <DialogTitle>Dodaj kategorię</DialogTitle>
                    </DialogHeader>
                    <FormField name="category_name" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nazwa</FormLabel>
                            <FormControl>
                                <Input placeholder="Wpisz nazwę kategorii..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {form.formState.errors.root && <FormMessage>{form.formState.errors.root.message}</FormMessage>}
                    <DialogFooter>
                        <Button type="submit">Dodaj kategorię</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>)
}