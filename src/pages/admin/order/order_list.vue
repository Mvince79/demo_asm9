<template>
  <div class="p-4">
    <h3 class="fw-bold mb-4">Đơn hàng</h3>

    <div class="table-responsive bg-white shadow-sm p-3 rounded-4">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Người đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th class="text-center">Chi tiết</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="o in list" :key="o.id">
            <td>{{ o.id }}</td>
            <td>{{ o.user_name || o.user_id }}</td>
            <td>{{ formatMoney(o.total_price) }}</td>
            <td>
              <span class="badge bg-success" v-if="o.status === 'completed'">
                Hoàn thành
              </span>
              <span class="badge bg-warning" v-else>{{ o.status }}</span>
            </td>
            <td>{{ formatDate(o.created_at) }}</td>

            <td class="text-center">
              <router-link
                :to="`/order_edit/${o.id}`"
                class="btn btn-primary btn-sm rounded-3"
              >
                <i class="bi bi-eye"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Order } from "../../../services/order.service";

const service = new Order();
const list = ref([]);

const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", { hour12: false });
};

onMounted(async () => {
  const res = await service.list();
  list.value = res.data || [];
});
</script>
