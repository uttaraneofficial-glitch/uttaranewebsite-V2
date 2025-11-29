export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem('accessToken');

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/upload-image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            // Content-Type is automatically set for FormData
        },
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    return data.url;
}
