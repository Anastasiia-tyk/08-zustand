// app/notes/Notes.client.tsx

"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import css from "./NotesPage.module.css";

import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";


interface NotesClientProps {
    tag: string;
}

export default function Notes({ tag }: NotesClientProps) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const perPage = 12;

    const { data } = useQuery({
        queryKey: ["notes", currentPage, searchQuery, tag],
        queryFn: () => fetchNotes(currentPage, perPage, searchQuery, tag),
        placeholderData: keepPreviousData,
    });

    const notes = data?.notes || [];
    const totalPages = data?.totalPages || 0;

    const updateSearchQuery = useDebouncedCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
        },
        300
    );

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onChange={updateSearchQuery} />

                {totalPages > 1 && (
                    <Pagination
                        pageCount={totalPages}
                        forcePage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                )}
                
                <button className={css.button} onClick={() => setIsModalOpen(true)}>
                    Create note +
                </button>
            </header>
            
            {notes.length > 0 && (
                <NoteList notes={notes} />
            )}
            
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}