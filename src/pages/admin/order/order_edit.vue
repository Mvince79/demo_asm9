<template>
  <div class="p-4">
    <h3 class="fw-bold mb-4">Chi tiết đơn hàng</h3>

    <div class="card shadow-sm p-4 rounded-4 mb-4">
      <p><b>Mã đơn:</b> {{ order.id }}</p>
      <p><b>Người đặt:</b> {{ order.user_name || order.user_id }}</p>
      <p><b>Tổng tiền:</b> {{ formatMoney(order.total_price) }}</p>
      <p>
        <b>Trạng thái:</b>
        <span class="badge bg-success" v-if="order.status === 'completed'"
          >Hoàn thành</span
        >
        <span class="badge bg-warning" v-else>{{ order.status }}</span>
      </p>
      <p><b>Ngày tạo:</b> {{ formatDate(order.created_at) }}</p>
    </div>

    <div class="table-responsive bg-white shadow-sm p-3 rounded-4">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Sản phẩm</th>
            <th>Biến thể</th>
            <th>Số lượng</th>
            <th>Giá</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="i in items" :key="i.id">
            <td>{{ i.id }}</td>
            <td>{{ i.product_name || i.product_id }}</td>
            <td>{{ i.variant_name || i.variant_id }}</td>
            <td>{{ i.quantity }}</td>
            <td>{{ formatMoney(i.price) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Order } from "../../../services/order.service";
import axios from "axios";
import { API_URL } from "../../../environments/environment";

const route = useRoute();
const service = new Order();

const order = ref({});
const items = ref([]);

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", { hour12: false });
};

onMounted(async () => {
  // Lấy dữ liệu đơn
  const res = await service.get(route.params.id);
  order.value = res.data;

  // Lấy chi tiết đơn
  const detail = await axios.get(
    `${API_URL}/order_items?order_id=${route.params.id}`
  );
  items.value = detail.data;
});
</script>
