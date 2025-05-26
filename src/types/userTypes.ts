export interface GitHubUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    [key: string]: unknown;
}