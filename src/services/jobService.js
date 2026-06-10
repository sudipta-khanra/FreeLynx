const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getMyJobs(token) {
  try {
    const response = await fetch(`${BASE_URL}/jobs/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Failed to fetch jobs:", error);
    throw error;
  }
}

export async function deleteJobById(jobId, token) {
  try {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Server responded with:", errorText);
      throw new Error("Failed to delete job");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Failed to delete job:", error);
    throw error;
  }
}
