import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_ENDPOINT } from "../config/api-endpoint.config";


export class Product {
    list() {
        return axios.get(API_URL + API_ENDPOINT.PRODUCT);
    }

    create(data) {
        return axios.post(API_URL + API_ENDPOINT.PRODUCT, data);
    }

    delete(id) {
        return axios.delete(`${API_URL + API_ENDPOINT.PRODUCT}/${id}`);
    }

    update(id, data) {
        return axios.put(`${API_URL + API_ENDPOINT.PRODUCT}/${id}`, data);
    }

    get(id) {
        return axios.get(`${API_URL + API_ENDPOINT.PRODUCT}/${id}`);
    }
}