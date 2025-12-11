<template>
  <div class="container py-5">
    <section v-if="product">
      <div class="row g-4">
        <!-- Hình ảnh sản phẩm -->
        <div class="col-md-6">
          <img
            :src="selectedImage || product.images?.[0] || '/placeholder.png'"
            class="w-100 rounded shadow-sm"
            style="object-fit: cover; height: 400px"
          />
          <div class="d-flex mt-2 gap-2">
            <img
              v-for="(img, idx) in product.images"
              :key="idx"
              :src="img"
              class="rounded border"
              style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
              @click="selectedImage = img"
            />
          </div>
        </div>

        <!-- Thông tin sản phẩm -->
        <div class="col-md-6">
          <h2 class="fw-bold">{{ product.name }}</h2>
          <p class="text-muted">{{ getCategoryName(product.category_id) }}</p>
          <h4 class="fw-bold text-primary">{{ formatMoney(totalPrice) }}</h4>

          <!-- Chọn biến thể -->
          <div v-if="product.variants?.length" class="mb-3">
            <label class="fw-semibold">Chọn biến thể:</label>
            <div class="d-flex gap-2 mt-2 flex-wrap">
              <button
                v-for="v in product.variants"
                :key="v.id"
                type="button"
                class="variant-btn"
                :class="selectedVariantId === v.id ? 'active' : ''"
                :disabled="v.stock === 0"
                @click="selectedVariantId = v.id"
              >
                {{ v.name }} (+{{ formatMoney(v.extra_price) }})<br/>
                <small class="text-muted">còn {{ v.stock }}</small>
              </button>
            </div>
          </div>

          <!-- Số lượng -->
          <div v-if="selectedVariant" class="mb-3">
            <label class="fw-semibold">Số lượng:</label>
            <input
              type="number"
              class="form-control w-25"
              v-model.number="quantity"
              :max="selectedVariant.stock"
              min="1"
            />
            <small class="text-muted">Tối đa: {{ selectedVariant.stock }}</small>
          </div>

          <!-- Thêm vào giỏ hàng -->
          <button class="btn btn-primary btn-lg mt-3" @click="addToCart">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <!-- Mô tả sản phẩm -->
      <div class="mt-5">
        <h5 class="fw-bold mb-3">Mô tả sản phẩm</h5>
        <p class="text-muted">{{ product.description || "Không có mô tả chi tiết" }}</p>
      </div>

      <!-- Sản phẩm liên quan -->
      <div v-if="relatedProducts.length" class="mt-5">
        <h5 class="fw-bold mb-3">Sản phẩm liên quan</h5>
        <div class="row row-cols-2 row-cols-md-4 g-3">
          <div v-for="rp in relatedProducts" :key="rp.id" class="col">
            <div class="card h-100 shadow-sm">
              <img
                :src="rp.images?.[0] || '/placeholder.png'"
                class="card-img-top"
                style="height: 150px; object-fit: cover"
              />
              <div class="card-body p-2">
                <h6 class="card-title">{{ rp.name }}</h6>
                <p class="text-primary fw-bold mb-0">{{ formatMoney(rp.base_price) }}</p>
                <button
                  class="btn btn-sm btn-outline-primary w-100 mt-2"
                  @click="goToProduct(rp.id)"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-else class="text-center py-5">Sản phẩm không tồn tại</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Product } from "../../../services/product.service";
import { Category } from "../../../services/category.service";
import { Cart } from "../../../services/cart.service";

const route = useRoute();
const router = useRouter();
const userId = "u1";

const product = ref(null);
const categories = ref([]);
const selectedVariantId = ref(null);
const quantity = ref(1);
const selectedImage = ref("");
const relatedProducts = ref([]);

const productService = new Product();
const categoryService = new Category();
const cartService = new Cart();

// Load product & categories
onMounted(async () => {
  try {
    const id = route.params.id;
    const resProduct = await productService.get(id);
    product.value = resProduct.data;
    selectedImage.value = product.value.images?.[0] || "";

    const resCategories = await categoryService.list();
    categories.value = resCategories.data.categories || resCategories.data;

    if (product.value.variants?.length) {
      selectedVariantId.value = product.value.variants[0].id;
      quantity.value = 1;
    }

    // Related products
    const allProducts = await productService.list();
    relatedProducts.value = allProducts.data.products.filter(
      (p) => p.category_id === product.value.category_id && p.id !== product.value.id
    );
  } catch (err) {
    console.error("Load product error:", err);
  }
});

// Helpers
const getCategoryName = (id) => {
  const cat = categories.value.find((c) => c.id === id);
  return cat ? cat.name : "";
};

const formatMoney = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

const selectedVariant = computed(() =>
  product.value?.variants?.find((v) => v.id === selectedVariantId.value)
);

const totalPrice = computed(() => {
  if (!product.value) return 0;
  const base = product.value.base_price || 0;
  const extra = selectedVariant.value?.extra_price || 0;
  return (base + extra) * quantity.value;
});

// Watch số lượng
watch(quantity, (newVal) => {
  if (selectedVariant.value && newVal > selectedVariant.value.stock) {
    quantity.value = selectedVariant.value.stock;
  } else if (newVal < 1) {
    quantity.value = 1;
  }
});

// Thêm vào giỏ hàng
const addToCart = async () => {
  if (!selectedVariant.value) return;
  try {
    const resCart = await cartService.list(userId);
    const cartItems = resCart.data.cart_items || resCart.data || [];

    const existItem = cartItems.find(
      (ci) => ci.product_id === product.value.id && ci.variant_id === selectedVariant.value.id
    );

    if (existItem) {
      await cartService.update(existItem.id, { quantity: existItem.quantity + quantity.value });
    } else {
      await cartService.add({
        user_id: userId,
        product_id: product.value.id,
        variant_id: selectedVariant.value.id,
        quantity: quantity.value,
      });
    }

    alert(`Đã thêm ${quantity.value} sản phẩm vào giỏ hàng`);
    router.push("/cart");
  } catch (err) {
    console.error("Add to cart error:", err.response || err);
    alert("Thêm giỏ hàng thất bại!");
  }
};

const goToProduct = (id) => router.push(`/product/${id}`);
</script>

<style scoped>
.variant-btn {
  padding: 6px 10px;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}
.variant-btn:hover {
  transform: translateY(-1px);
  border-color: #007bff;
}
.variant-btn.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}
.variant-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card {
  border-radius: 12px;
}
.card img {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
</style>
