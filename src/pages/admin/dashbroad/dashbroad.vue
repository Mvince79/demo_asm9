<template>
  <div class="p-4">
    <h2 class="fw-bold mb-4">Dashboard</h2>

    <!-- Thẻ thống kê nhanh -->
    <div class="row g-4 mb-4">
      <div class="col-md-3" v-for="card in stats" :key="card.title">
        <div class="card shadow-sm rounded-4 p-3 text-center">
          <div class="fs-1 mb-2">{{ card.value }}</div>
          <div class="fw-semibold text-muted">{{ card.title }}</div>
        </div>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="mb-4">
      <h4 class="fw-bold mb-3">Sản phẩm</h4>
      <div class="table-responsive shadow-sm rounded-4 bg-white p-3">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Hình</th>
              <th>Tên</th>
              <th>Giá cơ bản</th>
              <th>Danh mục</th>
              <th>Biến thể</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>
                <img
                  :src="p.images[0] || '/placeholder.png'"
                  style="width: 60px; height: 60px; object-fit: cover"
                  class="rounded"
                />
              </td>
              <td>{{ p.name }}</td>
              <td>{{ formatMoney(p.base_price) }}</td>
              <td>{{ getCategoryName(p.category_id) }}</td>
              <td>{{ p.variants?.length || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Danh sách đơn hàng gần đây -->
    <div>
      <h4 class="fw-bold mb-3">Đơn hàng gần đây</h4>
      <div class="table-responsive shadow-sm rounded-4 bg-white p-3">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Người đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id">
              <td>{{ o.id }}</td>
              <td>{{ getUserName(o.user_id) }}</td>
              <td>{{ formatMoney(o.total_price) }}</td>
              <td>
                <span class="badge bg-success" v-if="o.status === 'completed'"
                  >Hoàn thành</span
                >
                <span class="badge bg-warning" v-else>{{ o.status }}</span>
              </td>
              <td>{{ o.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import data from "../../../assets/data/data.json";

const categories = ref([]);
const products = ref([]);
const users = ref([]);
const orders = ref([]);
const stats = ref([]);

onMounted(() => {
  console.log("JSON DATA:", data);
  // Gán dữ liệu từ JSON mock
  categories.value = data.categories || [];
  products.value = data.products || [];
  users.value = data.users || [];
  orders.value = data.orders || [];

  stats.value = [
    { title: "Danh mục", value: categories.value.length },
    { title: "Sản phẩm", value: products.value.length },
    { title: "Người dùng", value: users.value.length },
    { title: "Đơn hàng", value: orders.value.length },
  ];
});

// Lấy tên danh mục theo id
const getCategoryName = (id) => {
  const c = categories.value.find((x) => x.id === id);
  return c ? c.name : "-";
};

// Lấy tên người dùng theo id
const getUserName = (id) => {
  const u = users.value.find((x) => x.id === id);
  return u ? u.name : "-";
};

// Format tiền VND
const formatMoney = (v) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
};
</script>

<style scoped>
.card {
  transition: 0.3s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
table img {
  border: 1px solid #ddd;
}
</style>
