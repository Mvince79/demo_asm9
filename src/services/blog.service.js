import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_ENDPOINT } from "../config/api-endpoint.config";

export class Blog {
    list() {
        return axios.get(API_URL + API_ENDPOINT.BLOG);
    }

    get(id) {
        return axios.get(`${API_URL + API_ENDPOINT.BLOG}/${id}`);
    }

    create(data) {
        return axios.post(API_URL + API_ENDPOINT.BLOG, data);
    }

    update(id, data) {
        return axios.put(`${API_URL + API_ENDPOINT.BLOG}/${id}`, data);
    }

    delete(id) {
        return axios.delete(`${API_URL + API_ENDPOINT.BLOG}/${id}`);
    }
}
