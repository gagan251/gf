import { Timestamp } from "firebase/firestore";

export type StenoTest = {
    id: string;
    title: string;
    language: string;
    speed: string;
    duration: string;
    isFree: boolean;
    audioUrl: string;
    originalText: string;
    createdAt: Timestamp;
};

export type PlaybookFile = {
    id: string;
    name: string;
    url: string;
    createdAt: Timestamp;
};
