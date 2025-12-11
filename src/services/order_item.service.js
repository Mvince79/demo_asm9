import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_ENDPOINT } from "../config/api-endpoint.config";

export class OrderItem {
    list() {
        return axios.get(API_URL + API_ENDPOINT.ORDER_ITEM);
    }

    get(id) {
        return axios.get(`${API_URL + API_ENDPOINT.ORDER_ITEM}/${id}`);
    }

    create(data) {
        return axios.post(API_URL + API_ENDPOINT.ORDER_ITEM, data);
    }

    update(id, data) {
        return axios.put(`${API_URL + API_ENDPOINT.ORDER_ITEM}/${id}`, data);
    }

    delete(id) {
        return axios.delete(`${API_URL + API_ENDPOINT.ORDER_ITEM}/${id}`);
    }

    getByOrderId(orderId) {
        return axios.get(`${API_URL + API_ENDPOINT.ORDER_ITEM}?order_id=${orderId}`);
    }
}
