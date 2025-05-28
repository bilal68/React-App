import { createContext, useState, useContext, ReactNode } from "react";
import { GitHubUser } from "../types/userTypes";
import { AppContextType } from "../types/appTypes";

const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(
    sessionStorage.getItem("authToken") || null
  );

  const [userName, setUserName] = useState<string | null>(
    sessionStorage.getItem("userName") || null
  );
  const [displayName, setDisplayName] = useState<string | null>(
    sessionStorage.getItem("displayName") || null
  );
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    sessionStorage.getItem("profileImageUrl") || null
  );

  const handleLogin = (token: string | null, user: GitHubUser) => {
    const { userName, photoURL, displayName } = user;
    if (token) {
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("userName", userName || "");
      sessionStorage.setItem("profileImageUrl", photoURL || "");
      sessionStorage.setItem("displayName", displayName || "");
      // sessionStorage.setItem("profileLink", link || "");
    } else {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("displayName");
      sessionStorage.removeItem("profileImageUrl");
    }
    setAuthToken(token);
    setDisplayName(displayName);
    setUserName(userName);
    setProfileImageUrl(photoURL);
    // setProfileLink(link);
  };

  return (
    <AppContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        authToken,
        displayName,
        userName,
        profileImageUrl,
        setAuthData: handleLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useSearch must be used within an AppProvider");
  }
  return context;
};
