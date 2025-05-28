import { GitHubUser } from "./userTypes";

export interface AppContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    authToken: string | null;
    userName: string | null;
    displayName: string | null;
    profileImageUrl: string | null;
    setAuthData: (token: string | null, user: GitHubUser) => void;
}

export interface GistFile {
    filename: string;
    type: string;
    language: string | null;
    raw_url: string;
    size: number;
    content: string | null;
}

export interface GistOwner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}
export interface Gist {
    url: string;
    forks_url: string;
    commits_url: string;
    id: string;
    node_id: string;
    git_pull_url: string;
    git_push_url: string;
    html_url: string;
    files: Record<string, GistFile>;
    public: boolean;
    created_at: string;
    updated_at: string;
    description: string;
    comments: number;
    user: null;
    comments_enabled: boolean;
    comments_url: string;
    owner: GistOwner;
    truncated: boolean;
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
export interface ApiError {
    status: number;
    message: string;
}
export interface CreateGistFile {
  filename: string;
  content: string;
}

export interface CreateGist {
  description: string;
  files: CreateGistFile[];
}