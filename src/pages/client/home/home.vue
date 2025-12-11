<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { Product } from "../../../services/product.service";
const router = useRouter();
const products = ref([]);
const productService = new Product();

onMounted(async () => {
  try {
    const res = await productService.list();
    // Nếu API trả về { products: [...] } hoặc mảng trực tiếp
    products.value = res.data.products?.slice(0, 6) || res.data.slice(0, 6);
  } catch (error) {
    console.error(error);
  }
});

const viewDetail = (id) =>
  router.push({ name: "product-detail", params: { id } });

const formatMoney = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v
  );
</script>

<template>
  <div class="container py-5 text-center bg-light rounded-4">
    <div class="d-flex justify-content-between mt-4 mb-2">
      <h4>Danh sách khuyến mãi</h4>
      <router-link to="product" class="btn btn-outline-success"
        >Xem tất cả</router-link
      >
    </div>

    <div class="row g-4 justify-content-center">
      <div v-for="p in products" :key="p.id" class="col-lg-4 col-md-6">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
          <img
            :src="p.images[0]"
            class="card-img-top"
            style="object-fit: cover; height: 250px"
          />

          <div class="card-body d-flex flex-column text-start">
            <h5 class="fw-semibold mb-1">{{ p.name }}</h5>
            <p class="text-muted small mb-3 description">
              {{ p.description }}
            </p>

            <button
              @click="viewDetail(p.id)"
              class="btn btn-sm btn-outline-primary mb-3"
            >
              Xem chi tiết
            </button>

            <div class="mt-auto text-primary fw-bold">
              {{ formatMoney(p.base_price) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-body {
  display: flex;
  flex-direction: column;
}

.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* hiển thị tối đa 3 dòng */
  overflow: hidden;
  text-overflow: ellipsis;

  /* Giữ khoảng trống cố định để nút và giá luôn nằm dưới */
  min-height: 4.5em; /* khoảng 3 dòng, tùy font-size */
}
</style>
