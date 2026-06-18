// app/notes/page.tsx

import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface Props {
    params: Promise<{
        slug: string[];
    }>;
}

export default async function NotesPage({ params }: Props) {
    const resolvedParams = await params;

    const currentTag = resolvedParams.slug?.[0] || "all";

    const queryClient = new QueryClient();
    const defaultPage = 1;
    const defaultPerPage = 12;
    const defaultSearch = "";

    await queryClient.prefetchQuery({
        queryKey: ["notes", defaultPage, defaultSearch, currentTag],
        queryFn: () => fetchNotes(defaultPage, defaultPerPage, defaultSearch, currentTag),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={currentTag} />
        </HydrationBoundary>
    );
}