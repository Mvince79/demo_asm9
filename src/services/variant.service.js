import axios from "axios";
import { API_URL } from "../environments/environment";
import { API_ENDPOINT } from "../config/api-endpoint.config";

export class VariantService {
    async add(productId, variant) {
        const product = await axios.get(
            `${API_URL + API_ENDPOINT.PRODUCT}/${productId}`
        );

        const variants = product.data.variants || [];
        variants.push({
            id: crypto.randomUUID(),
            ...variant,
        });

        return axios.put(`${API_URL + API_ENDPOINT.PRODUCT}/${productId}`, {
            ...product.data,
            variants,
        });
    }

    async update(productId, variantId, data) {
        const product = await axios.get(
            `${API_URL + API_ENDPOINT.PRODUCT}/${productId}`
        );

        const variants = product.data.variants.map((v) =>
            v.id === variantId ? { ...v, ...data } : v
        );

        return axios.put(`${API_URL + API_ENDPOINT.PRODUCT}/${productId}`, {
            ...product.data,
            variants,
        });
    }

    async delete(productId, variantId) {
        const product = await axios.get(
            `${API_URL + API_ENDPOINT.PRODUCT}/${productId}`
        );

        const variants = product.data.variants.filter(
            (v) => v.id !== variantId
        );

        return axios.put(`${API_URL + API_ENDPOINT.PRODUCT}/${productId}`, {
            ...product.data,
            variants,
        });
    }
}
