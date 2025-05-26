import { GitHubUser } from "./userTypes";

export interface AppContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    authToken: string | null;
    userName: string | null;
    profileImageUrl: string | null;
    setAuthData: (token: string | null, user: GitHubUser) => void;
}

export interface GistFile {
    filename: string;
    type: string;
    language: string | null;
    raw_url: string;
    size: number;
}

export interface Gist {
    id: string;
    description: string | null;
    html_url: string;
    files: Record<string, GistFile>;
    owner: GitHubUser;
    public: boolean;
    created_at: string;
    updated_at: string;
    forks_url: string;
    comments: number;
    comments_url: string;
    [key: string]: unknown;
}

export interface GistFilePayload {
    content: string;
}

export interface CreateGistPayload {
    description: string;
    public: boolean;
    files: Record<string, GistFilePayload>;
}

export type FileContentsMap = {
    [gistId: string]: {
        [fileName: string]: string;
    };
};