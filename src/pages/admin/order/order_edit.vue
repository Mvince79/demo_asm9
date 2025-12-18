<template>
  <div class="p-4">
    <h3 class="fw-bold mb-4">Chi tiết đơn hàng</h3>

    <!-- ORDER SUMMARY -->
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-3">
          <small class="text-muted">Mã đơn</small>
          <div class="fw-bold fs-5">{{ order.id }}</div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-3">
          <small class="text-muted">Người đặt</small>
          <div class="fw-semibold">
            {{ order.user_name || order.user_id }}
          </div>
        </div>
      </div>

      <!-- STATUS -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-3">
          <small class="text-muted d-block mb-1">Trạng thái</small>

          <select
            class="form-select"
            v-model="newStatus"
            @change="updateStatus"
            :disabled="isFinalStatus"
          >
            <option v-for="s in allowedStatuses" :key="s" :value="s">
              {{ statusText(s) }}
            </option>
          </select>

          <small v-if="isFinalStatus" class="text-muted mt-1 d-block">
            Trạng thái đã kết thúc
          </small>
        </div>
      </div>
    </div>

    <!-- TOTAL -->
    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
      <div class="d-flex justify-content-between">
        <span class="text-muted">Tổng giá trị đơn hàng</span>
        <span class="fw-bold fs-4 text-danger">
          {{ formatMoney(order.total_price) }}
        </span>
      </div>
      <div class="text-muted small mt-1">
        Ngày tạo: {{ formatDate(order.created_at) }}
      </div>
    </div>

    <!-- ITEMS -->
    <div class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="bg-light text-muted small">
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th>Biến thể</th>
              <th class="text-center">Số lượng</th>
              <th class="text-end">Giá</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(i, index) in items" :key="i.id">
              <td>{{ index + 1 }}</td>
              <td class="fw-semibold">
                {{ i.product_name || i.product_id }}
              </td>
              <td class="text-muted">
                {{ i.variant_name || i.variant_id }}
              </td>
              <td class="text-center">
                {{ i.quantity }}
              </td>
              <td class="text-end fw-bold">
                {{ formatMoney(i.price) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Order } from "../../../services/order.service";
import { API_URL } from "../../../environments/environment";

const route = useRoute();
const service = new Order();

const order = ref({});
const items = ref([]);
const newStatus = ref("");

// 🔒 THỨ TỰ TRẠNG THÁI (CỐ ĐỊNH)
const STATUS_FLOW = ["pending", "processing", "completed", "cancelled"];

/* ======================
   FORMAT
====================== */
const formatMoney = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", { hour12: false });
};

/* ======================
   COMPUTED
====================== */
const allowedStatuses = computed(() => {
  const index = STATUS_FLOW.indexOf(order.value.status);
  if (index === -1) return [];
  return STATUS_FLOW.slice(index);
});

const isFinalStatus = computed(() =>
  ["completed", "cancelled"].includes(order.value.status)
);

/* ======================
   LOAD DATA
====================== */
onMounted(async () => {
  const res = await service.get(route.params.id);
  order.value = res.data;
  newStatus.value = res.data.status;

  const detail = await axios.get(
    `${API_URL}/order_items?order_id=${route.params.id}`
  );
  items.value = detail.data || [];
});

/* ======================
   UPDATE STATUS
====================== */
const updateStatus = async () => {
  if (newStatus.value === order.value.status) return;

  const oldIndex = STATUS_FLOW.indexOf(order.value.status);
  const newIndex = STATUS_FLOW.indexOf(newStatus.value);

  // 🚫 CHẶN LÙI TRẠNG THÁI
  if (newIndex < oldIndex) {
    alert("Không thể lùi trạng thái đơn hàng");
    newStatus.value = order.value.status;
    return;
  }

  await service.update(order.value.id, {
    status: newStatus.value,
  });

  order.value.status = newStatus.value;
  alert("Cập nhật trạng thái thành công");
};

/* ======================
   UI TEXT
====================== */
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
</script>
