import axios from "axios";
import { API_BASE_URL } from "../config/api";

export async function uploadImage(file, folder = "Uttarane-images") {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const token = localStorage.getItem('accessToken');

    const response = await axios.post(
        `${API_BASE_URL}/api/admin/upload-image`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.url;
}
