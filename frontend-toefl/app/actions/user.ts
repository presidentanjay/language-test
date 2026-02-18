"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    try {
        return await api.get('/users');
    } catch (e) {
        console.error("Error getting users:", e);
        return [];
    }
}

export async function getUser(id: string) {
    try {
        return await api.get(`/users/${id}`);
    } catch (e) {
        console.error("Error getting user:", e);
        return null;
    }
}

export async function deleteUser(id: string) {
    try {
        await api.delete(`/users/${id}`);
        revalidatePath("/manage-users");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete user" };
    }
}

export async function updateUser(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const npm = formData.get("npm") as string;
    // Note: Handling file uploads (picture) would require multipart/form-data or Base64 in a real API
    // For now, let's just update the text fields

    try {
        await api.patch(`/users/${id}`, { name, npm });
        revalidatePath("/manage-users");
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to update" };
    }
}
