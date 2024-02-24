import CategoriesPage from "@/components/settings/home/categories";
import SongsPage from "@/components/settings/home/songs";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
    return <div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Utwory i kategorie</h3>
            <p className="text-sm text-muted-foreground">
                Zarządzaj utworami i kategoriami w śpiewniku.
            </p>
        </div>
        <Separator />
        <Tabs defaultValue="songs">
            <TabsList>
                <TabsTrigger value="songs">Utwory</TabsTrigger>
                <TabsTrigger value="categories">Kategorie</TabsTrigger>
            </TabsList>
            <TabsContent value="songs">
                <SongsPage />
            </TabsContent>
            <TabsContent value="categories">
                <CategoriesPage />
            </TabsContent>
        </Tabs>
    </div>
}