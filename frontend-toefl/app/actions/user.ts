"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export async function updateUser(userId: string | number, formData: FormData) {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const role = formData.get("role");

    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to update user",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("updateUser error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteUser(userId: string | number) {
  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to delete user",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("deleteUser error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
