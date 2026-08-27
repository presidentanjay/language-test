"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export async function createExam(formData: FormData) {
  try {
    const data = {
      code: formData.get("code"),
      title: formData.get("title"),
      category: formData.get("category"),
    };

    const res = await fetch(`${API_URL}/exams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to create exam",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("createExam error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteExam(examId: string) {
  try {
    const res = await fetch(`${API_URL}/exams/${examId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to delete exam",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("deleteExam error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
