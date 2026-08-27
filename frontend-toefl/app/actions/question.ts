"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export async function createSection(
  examId: string | number,
  formData: FormData,
) {
  try {
    const title = formData.get("title");
    const section = formData.get("section");
    const duration = formData.get("duration");

    const res = await fetch(`${API_URL}/exams/${examId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, section, duration }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to create section",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("createSection error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteSection(sectionId: number | string) {
  try {
    const res = await fetch(`${API_URL}/sections/${sectionId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to delete section",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("deleteSection error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function createQuestion(
  sectionId: string | number,
  formData: FormData,
) {
  try {
    // Generic implementation since we don't know the exact API structure
    const res = await fetch(`${API_URL}/sections/${sectionId}/questions`, {
      method: "POST",
      // Need to convert FormData to JSON appropriately in a real app
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to create question",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("createQuestion error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteQuestion(questionId: number | string) {
  try {
    const res = await fetch(`${API_URL}/questions/${questionId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to delete question",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("deleteQuestion error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
