export default function PageLoading() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            <div className="text-xl mt-4">Śpiewnik online</div>
            <div className="text-2xl font-bold mt-2">Ładowanie aplikacji...</div>
        </div>
    );
}