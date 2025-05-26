// Fetch public gists from GitHub API

import { CreateGistPayload } from "../types/appTypes";

const baseUrl = 'https://api.github.com/gists';
// const token = import.meta.env.VITE_GITHUB_TOKEN;
const token = sessionStorage.getItem("authToken");;
export const fetchPublicGists = async (page: number = 1) => {
    try {
        const response = await fetch(`${baseUrl}/public?page=${page}`,
            // {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // }
        );
        if (!response.ok) {
            throw new Error(`Error fetching gists: ${response.statusText}`);
        }
        return await response.json();// need to add a format function
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
            throw new Error(`Failed to fetch gist with ID: ${id}`);
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
            throw new Error(`Failed to fetch forks: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching forks:", error);
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
            throw new Error(`Failed to fork gist: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Return the forked gist data
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
            throw new Error(`Failed to star gist: ${response.statusText}`);
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
            throw new Error(`Failed to create gist: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating gist:", error);
        throw error;
    }
};

export const fetchUserGists = async (username: string) => {
    const baseUrl = `https://api.github.com/users/${username}/gists`;
    const token = sessionStorage.getItem("authToken"); 

    try {
        const response = await fetch(baseUrl, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching gists for user ${username}: ${response.statusText}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error fetching user gists:", error);
        throw error;
    }
};