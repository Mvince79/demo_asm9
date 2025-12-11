import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_ENDPOINT } from "../config/api-endpoint.config";

export class Cart {
    list(userId) {
        return axios.get(`${API_URL + API_ENDPOINT.CART}?user_id=${userId}`);
    }

    add(data) {
        return axios.post(API_URL + API_ENDPOINT.CART, data);
    }

    update(id, data) {
        return axios.put(`${API_URL + API_ENDPOINT.CART}/${id}`, data);
    }

    delete(id) {
        return axios.delete(`${API_URL + API_ENDPOINT.CART}/${id}`);
    }
}
