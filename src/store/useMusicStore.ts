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

interface Session {
  name: string; // 파일명 등 표시용
  audioSrc: string;
  comments: Comment[];
  playlist: Track[];
}

interface MusicStore {
  sessions: Session[];           // 여러 개의 세션 저장
  currentIndex: number | null;   // 현재 선택된 세션 인덱스

  addSession: (session: Session) => void;
  switchSession: (index: number) => void;

  audioSrc: string | null;
  comments: Comment[];
  playlist: Track[];

  updateComment: (index: number, text: string) => void;
  deleteComment: (index: number) => void;
  addComment: (time: number) => void;
  setPlaylist: (playlist: Track[]) => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  sessions: [],
  currentIndex: null,

  audioSrc: null,
  comments: [],
  playlist: [],

  addSession: (session) =>
    set((state) => {
      const newSessions = [...state.sessions, session];
      return {
        sessions: newSessions,
        currentIndex: newSessions.length - 1, // 마지막 세션 자동 선택
        audioSrc: session.audioSrc,
        comments: session.comments,
        playlist: session.playlist,
      };
    }),

  switchSession: (index) => {
    const target = get().sessions[index];
    if (!target) return;
    set({
      currentIndex: index,
      audioSrc: target.audioSrc,
      comments: target.comments,
      playlist: target.playlist,
    });
  },

  updateComment: (index, text) =>
    set((state) => {
      const updated = [...state.comments];
      updated[index].text = text;
      return { comments: updated };
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
}));
