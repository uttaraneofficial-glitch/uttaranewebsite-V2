import axios from "axios";

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem('accessToken');

    const res = await axios.post(
        "https://uttaranewebsite-v2-4.onrender.com/api/admin/upload-image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            },
        }
    );

    return res.data.url;
}
