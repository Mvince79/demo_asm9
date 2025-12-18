<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Danh sách sản phẩm</h3>
      <router-link
        to="/product_add"
        class="btn btn-success btn-lg rounded-3 px-4"
      >
        <i class="bi bi-plus-lg me-2"></i> Thêm sản phẩm
      </router-link>
    </div>

    <div class="table-responsive shadow-sm rounded-4 bg-white p-3 border">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Hình</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>
              <img
                :src="item.images?.[0]"
                class="rounded"
                style="width: 60px; height: 60px; object-fit: cover"
              />
            </td>
            <td class="fw-semibold">{{ item.name }}</td>
            <td>{{ formatMoney(item.base_price) }}</td>

            <td>{{ getCategoryName(item.category_id) }}</td>

            <td class="text-center">
              <router-link
                :to="`/product_edit/${item.id}`"
                class="btn btn-primary btn-sm rounded-3 me-2"
              >
                <i class="bi bi-pencil-square"></i>
              </router-link>
              <button
                @click="deleteItem(item.id)"
                class="btn btn-danger btn-sm rounded-3"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Product } from "../../../services/product.service";
import data from "../../../assets/data/data.json";

const categories = ref([]);

const productService = new Product();
const list = ref([]);

onMounted(async () => {
  const res = await productService.list();
  list.value = res.data || [];
  
  categories.value = data.categories || [];
});

const getCategoryName = (id) => {
  const c = categories.value.find((x) => x.id === id);
  return c ? c.name : "-";
};

const deleteItem = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa?")) return;

  await productService.delete(id);
  list.value = list.value.filter((p) => p.id !== id);
  alert("Đã xóa!");
};

const formatMoney = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
</script>

<style scoped>
table img {
  border: 1px solid #ddd;
}
</style>
