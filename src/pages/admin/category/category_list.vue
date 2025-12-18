<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Danh mục sản phẩm</h3>
      <router-link
        to="/category_add"
        class="btn btn-success btn-lg rounded-3 px-4"
      >
        <i class="bi bi-plus-lg me-2"></i> Thêm danh mục
      </router-link>
    </div>

    <div class="table-responsive shadow-sm rounded-4 bg-white p-3 border">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.id }}</td>
            <td class="fw-semibold">{{ item.name }}</td>
            <td class="text-center">
              <router-link
                :to="`/category_edit/${item.id}`"
                class="btn btn-primary btn-sm rounded-3 me-2"
              >
                <i class="bi bi-pencil-square"></i>
              </router-link>
              <button
                @click="remove(item.id)"
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
import { Category } from "../../../services/category.service";
import { Product } from "../../../services/product.service";

const productService = new Product();
const products = ref([]);

const service = new Category();
const list = ref([]);

onMounted(async () => {
  const res = await service.list();
  list.value = res.data || [];

  const productRes = await productService.list();
  products.value = productRes.data || [];
});

// const remove = async (id) => {
//   if (!confirm("Xóa danh mục này?")) return;
//   await service.delete(id);
//   list.value = list.value.filter((x) => x.id !== id);
//   alert("Đã xóa");
// };

const remove = async (id) => {
  const used = products.value.some((p) => p.category_id === id);

  if (used) {
    alert("❌ Không thể xóa: Danh mục đang có sản phẩm!");
    return;
  }

  if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

  await service.delete(id);
  list.value = list.value.filter((x) => x.id !== id);
  alert("✅ Đã xóa danh mục");
};
</script>
