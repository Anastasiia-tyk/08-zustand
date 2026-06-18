// app/notes/[id]/page.tsx

import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotesById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNotesById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient />
        </HydrationBoundary>
    );
}