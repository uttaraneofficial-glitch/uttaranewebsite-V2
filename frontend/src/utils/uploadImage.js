import axios from "axios";
import { API_BASE_URL } from './config'; // Assuming API_BASE_URL is exported from a config file

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem('accessToken');

    const res = await axios.post(
        `${API_BASE_URL}/api/admin/upload-image`,
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
