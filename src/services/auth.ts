import { GitHubUser } from "../types/userTypes";
import { auth } from "./firebase";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

const handleGitHubLogin = async (): Promise<{
    user: GitHubUser;
    accessToken: string;
    scope: string;
} | undefined> => {
    const provider = new GithubAuthProvider();
    provider.addScope('gist');
    try {
        const result = await signInWithPopup(auth, provider);
        const loggedInUser = result.user;
        const credential = GithubAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        
        if (!accessToken) {
            throw new Error("Failed to retrieve access token.");
        }
        const user: GitHubUser = {
            uid: loggedInUser.uid,
            displayName: loggedInUser.displayName,
            email: loggedInUser.email,
            photoURL: loggedInUser.photoURL,
            // Optionally include other fields
        }
        return {
            user, accessToken, scope: 'gist'
        }
    } catch (error) {
        console.error("GitHub login error:", error);
    }
};

export { handleGitHubLogin };