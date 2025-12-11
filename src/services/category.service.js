import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_ENDPOINT } from "../config/api-endpoint.config";

export class Category {
    list() {
        return axios.get(API_URL + API_ENDPOINT.CATEGORY);
    }

    get(id) {
        return axios.get(`${API_URL + API_ENDPOINT.CATEGORY}/${id}`);
    }

    create(data) {
        return axios.post(API_URL + API_ENDPOINT.CATEGORY, data);
    }

    update(id, data) {
        return axios.put(`${API_URL + API_ENDPOINT.CATEGORY}/${id}`, data);
    }

    delete(id) {
        return axios.delete(`${API_URL + API_ENDPOINT.CATEGORY}/${id}`);
    }
}
