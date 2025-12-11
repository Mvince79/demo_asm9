import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_ENDPOINT } from "../config/api-endpoint.config";

export class User {
    list() {
        return axios.get(API_URL + API_ENDPOINT.USER);
    }

    get(id) {
        return axios.get(`${API_URL + API_ENDPOINT.USER}/${id}`);
    }

    create(data) {
        return axios.post(API_URL + API_ENDPOINT.USER, data);
    }

    update(id, data) {
        return axios.put(`${API_URL + API_ENDPOINT.USER}/${id}`, data);
    }

    delete(id) {
        return axios.delete(`${API_URL + API_ENDPOINT.USER}/${id}`);
    }
}
