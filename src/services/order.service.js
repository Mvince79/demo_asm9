import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_ENDPOINT } from "../config/api-endpoint.config";

export class Order {
    list() {
        return axios.get(API_URL + API_ENDPOINT.ORDER);
    }

    get(id) {
        return axios.get(`${API_URL + API_ENDPOINT.ORDER}/${id}`);
    }

    create(data) {
        return axios.post(API_URL + API_ENDPOINT.ORDER, data);
    }

    update(id, data) {
        return axios.put(`${API_URL + API_ENDPOINT.ORDER}/${id}`, data);
    }

    delete(id) {
        return axios.delete(`${API_URL + API_ENDPOINT.ORDER}/${id}`);
    }
}
