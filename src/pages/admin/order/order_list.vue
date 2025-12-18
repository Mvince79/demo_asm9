<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Quản lý đơn hàng</h3>
      <span class="text-muted small"> Tổng: {{ list.length }} đơn </span>
    </div>

    <div class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="bg-light">
            <tr class="text-muted small">
              <th>Mã đơn</th>
              <th>Người đặt</th>
              <th class="text-end">Tổng tiền</th>
              <th class="text-center">Trạng thái</th>
              <th>Ngày tạo</th>
              <th class="text-center">Xem</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="o in list" :key="o.id">
              <td class="fw-semibold">{{ o.id }}</td>

              <td>
                {{ o.user_name || o.user_id }}
              </td>

              <td class="text-end fw-bold text-danger">
                {{ formatMoney(o.total_price) }}
              </td>

              <td class="text-center">
                <span
                  class="badge rounded-pill px-3"
                  :class="badgeClass(o.status)"
                >
                  {{ statusText(o.status) }}
                </span>
              </td>

              <td class="text-muted">
                {{ formatDate(o.created_at) }}
              </td>

              <td class="text-center">
                <router-link
                  :to="`/order_edit/${o.id}`"
                  class="btn btn-outline-primary btn-sm rounded-circle"
                  title="Xem chi tiết"
                >
                  <i class="bi bi-eye"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

const statusText = (status) => {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "processing":
      return "Đang xử lý";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const badgeClass = (status) => {
  switch (status) {
    case "completed":
      return "bg-success";
    case "processing":
      return "bg-primary";
    case "pending":
      return "bg-warning text-dark";
    case "cancelled":
      return "bg-secondary";
    default:
      return "bg-light text-dark";
  }
};
</script>
