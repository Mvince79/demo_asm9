<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Product } from "../../../services/product.service";
import { Category } from "../../../services/category.service";

const router = useRouter();
const products = ref([]);
const categories = ref([]);

const selectedCategory = ref("");
const minPrice = ref("");
const maxPrice = ref("");
const searchName = ref("");

const productService = new Product();
const categoryService = new Category();

onMounted(async () => {
  try {
    const resProducts = await productService.list();
    const resCategories = await categoryService.list();
    products.value = resProducts.data.products || resProducts.data; // tùy API trả về
    categories.value = resCategories.data.categories || resCategories.data;
  } catch (error) {
    console.error(error);
  }
});

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchCat =
      !selectedCategory.value || p.category_id === selectedCategory.value;
    const matchMin = !minPrice.value || p.base_price >= minPrice.value;
    const matchMax = !maxPrice.value || p.base_price <= maxPrice.value;
    const matchSearch =
      !searchName.value ||
      p.name.toLowerCase().includes(searchName.value.toLowerCase());
    return matchCat && matchMin && matchMax && matchSearch;
  });
});

const getCategoryName = (id) => {
  const cat = categories.value.find((c) => c.id === id);
  return cat ? cat.name : "";
};

const formatMoney = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v
  );

const viewDetail = (id) =>
  router.push({ name: "product-detail", params: { id } });
const resetFilter = () => {
  selectedCategory.value = "";
  minPrice.value = "";
  maxPrice.value = "";
  searchName.value = "";
};
</script>

<template>
  <section class="container mt-4">
    <h2 class="text-center fw-bold mb-5">Danh sách sản phẩm</h2>
    <div class="row g-4">
      <aside class="col-md-3">
        <div class="filter-box p-4 rounded-4 shadow-sm bg-white">
          <h5 class="fw-semibold mb-4">Bộ lọc sản phẩm</h5>

          <div class="mb-3">
            <label class="form-label fw-semibold small">Danh mục</label>
            <select
              v-model="selectedCategory"
              class="form-select form-select-sm"
            >
              <option value="">Tất cả</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold small">Khoảng giá</label>
            <input
              type="number"
              v-model.number="minPrice"
              class="form-control form-control-sm mb-2"
              placeholder="Từ..."
            />
            <input
              type="number"
              v-model.number="maxPrice"
              class="form-control form-control-sm"
              placeholder="Đến..."
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold small">Tìm kiếm</label>
            <input
              type="text"
              v-model="searchName"
              class="form-control form-control-sm"
              placeholder="Nhập tên sản phẩm..."
            />
          </div>

          <button
            @click="resetFilter"
            class="btn btn-outline-secondary btn-sm w-100 mt-2"
          >
            Đặt lại
          </button>
        </div>
      </aside>

      <div class="col-md-9">
        <div class="row g-4">
          <div v-for="p in filteredProducts" :key="p.id" class="col-md-4">
            <div class="card h-100 shadow-sm rounded-4">
              <img
                :src="p.images[0]"
                class="card-img-top"
                style="height: 200px; object-fit: cover"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="fw-semibold">{{ p.name }}</h5>
                <p class="text-muted small mb-2">
                  {{ getCategoryName(p.category_id) }}
                </p>
                <p class="fw-bold text-primary mt-auto">
                  {{ formatMoney(p.base_price) }}
                </p>
                <button
                  @click="viewDetail(p.id)"
                  class="btn btn-sm btn-outline-primary mt-2"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
