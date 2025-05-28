import { GitHubUser, LoggedInUser } from "../types/userTypes";
import { auth } from "./firebase";
import { GithubAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth";

const handleGitHubLogin = async (): Promise<{
    user: GitHubUser;
    accessToken: string;
    scope: string;
} | undefined> => {
    const provider = new GithubAuthProvider();
    provider.addScope('gist');
    try {
        const result = await signInWithPopup(auth, provider);
        const additionalUserInfo = getAdditionalUserInfo(result);
        const rawUserInfo = additionalUserInfo?.profile;
        console.log("Raw User Info:", rawUserInfo);
        const loggedInUser: LoggedInUser = rawUserInfo as unknown as LoggedInUser;
        const credential = GithubAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        if (!accessToken) {
            throw new Error("Failed to retrieve access token.");
        }
        const user: GitHubUser = {
            displayName: loggedInUser.name,
            email: loggedInUser.email,
            photoURL: loggedInUser.avatar_url,
            userName: loggedInUser.login
        }
        return {
            user, accessToken, scope: 'gist'
        }
    } catch (error) {
        console.error("GitHub login error:", error);
    }
};

export { handleGitHubLogin };