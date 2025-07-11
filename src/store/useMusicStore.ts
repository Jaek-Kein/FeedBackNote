// stores/useMusicStore.ts
import { create } from "zustand";

interface Comment {
    time: number;
    text: string;
}

interface Track {
    title: string;
    performer: string;
    time: number;
}

interface AudioState {
    audioSrc: string | null;
    audioFile: File | null;
    comments: Comment[];
    playlist: Track[];

    setAudio: (src: string, file: File) => void;
    setComments: (comments: Comment[]) => void;
    setPlaylist: (playlist: Track[]) => void;
    updateComment: (index: number, text: string) => void;
    deleteComment: (index: number) => void;
    addComment: (time: number) => void;

    reset: () => void;
}

export const useMusicStore = create<AudioState>((set) => ({
    audioSrc: null,
    audioFile: null,
    comments: [],
    playlist: [],

    setAudio: (src, file) => set({ audioSrc: src, audioFile: file }),
    setComments: (comments) => set({ comments }),
    updateComment: (index, text) =>
        set((state) => {
            const newComments = [...state.comments];
            if (newComments[index]) newComments[index].text = text;
            return { comments: newComments };
        }),
    deleteComment: (index) =>
        set((state) => ({
            comments: state.comments.filter((_, i) => i !== index),
        })),
    addComment: (time) =>
        set((state) => ({
            comments: [...state.comments, { time, text: "" }],
        })),

    setPlaylist: (playlist) => set({ playlist }),

    reset: () => ({
        audioSrc: null,
        audioFile: null,
        comments: [],
        playlist: [],
    }),
}));
