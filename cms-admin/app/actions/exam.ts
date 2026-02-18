"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getExams() {
    try {
        return await api.get('/exams');
    } catch (e) {
        console.error("Error getting exams:", e);
        return [];
    }
}

export async function getExam(id: string) {
    try {
        return await api.get(`/exams/${id}`);
    } catch (e) {
        console.error("Error getting exam:", e);
        return null;
    }
}

export async function createExam(formData: FormData) {
    const code = formData.get("code") as string;
    const title = formData.get("title") as string;
    const category = formData.get("category") as any;

    try {
        await api.post('/exams', { code, title, category });
        revalidatePath("/exam");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to create exam" };
    }
}

export async function deleteExam(id: string) {
    try {
        await api.delete(`/exams/${id}`);
        revalidatePath("/exam");
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function toggleExamActivation(id: number, isActive: boolean) {
    try {
        await api.patch(`/exams/${id}/activation`, { activated: isActive });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function goToExamControl(formData: FormData) {
    const examCode = formData.get("exam_code");
    redirect(`/exam/${examCode}`);
}
