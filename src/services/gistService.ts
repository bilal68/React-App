// Fetch public gists from GitHub API

import { CreateGistPayload, Gist } from "../types/appTypes";

const baseUrl = 'https://api.github.com/gists';
const token = import.meta.env.VITE_GITHUB_TOKEN;

const handleApiError = async (response: Response) => {
    let errorMsg = "Unknown error";
    try {
        const data = await response.json();
        errorMsg = data?.message || JSON.stringify(data);
    } catch {
        errorMsg = response.statusText;
    }
    return { status: response.status, message: errorMsg };
};

export const fetchPublicGists = async (page: number = 1): Promise<Gist[]> => {
    try {
        const response = await fetch(`${baseUrl}/public?page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            throw await handleApiError(response);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchGistById = async (id: string) => {
    try {
        const response = await fetch(`${baseUrl}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw await handleApiError(response);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching gist:", error);
        throw error;
    }
};

export const fetchGistForks = async (gistId: string) => {
    try {
        const response = await fetch(`${baseUrl}/${gistId}/forks`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw await handleApiError(response);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching forks:", error);
        throw error;
    }
};

export const fetchGistStars = async (gistId: string) => {
    try {
        console.log(gistId)
        return [];
        // const response = await fetch(`${baseUrl}/${gistId}/forks`, {
        //     method: "GET",
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //         "Content-Type": "application/json",
        //     },
        // });

        // if (!response.ok) {
        //     throw await handleApiError(response);
        // }

        // const data = await response.json();
        // return data;
    } catch (error) {
        console.error("Error fetching stars:", error);
        throw error;
    }
};
// Fork a gist
export const forkGist = async (gistId: string) => {
    try {
        const response = await fetch(`${baseUrl}/${gistId}/forks`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw await handleApiError(response);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error forking gist:", error);
        throw error;
    }
};

// Star a gist
export const starGist = async (gistId: string) => {
    try {
        const response = await fetch(`${baseUrl}/${gistId}/star`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw await handleApiError(response);
        }

        return true; // Return true if the gist was successfully starred
    } catch (error) {
        console.error("Error starring gist:", error);
        throw error;
    }
};

export const createGist = async (
    payload: CreateGistPayload
) => {
    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw await handleApiError(response);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating gist:", error);
        throw error;
    }
};

export const fetchUserGists = async (username: string) => {
    console.log("Fetching user gists for:", username);
    const baseUrl = `https://api.github.com/users/${username}/gists`;
    const token = sessionStorage.getItem("authToken");

    try {
        const response = await fetch(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw await handleApiError(response);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user gists:", error);
        throw error;
    }
};