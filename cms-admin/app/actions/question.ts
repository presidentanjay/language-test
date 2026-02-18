"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

// Ported question actions... 
// For now, providing a wrapper around the API

export async function getQuestions(sectionId: string) {
    try {
        return await api.get(`/questions/section/${sectionId}`);
    } catch (e) {
        return [];
    }
}
