<script setup>
import { ref, computed, onMounted } from "vue";
import { Cart } from "../../../services/cart.service";
import { Product } from "../../../services/product.service";

/* ==============================
   USER
================================ */
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userId = currentUser?.id;

/* ==============================
   STATE
================================ */
const cartItems = ref([]);
const products = ref([]);

/* ==============================
   SERVICE
================================ */
const cartService = new Cart();
const productService = new Product();

/* ==============================
   LOAD DATA
================================ */
const loadData = async () => {
  if (!userId) return;

  // 1. LOAD PRODUCTS (API TRẢ VỀ ARRAY)
  const resProducts = await productService.list();
  products.value = resProducts.data || [];

  // 2. LOAD CART THEO USER
  const resCart = await cartService.list(userId);
  const rawCart = resCart.data || [];

  // 3. MAP CART → PRODUCT + VARIANT
  cartItems.value = rawCart
    .map((ci) => {
      const product = products.value.find((p) => p.id === ci.product_id);
      if (!product) return null;

      const variant = product.variants?.find((v) => v.id === ci.variant_id);
      if (!variant) return null;

      return {
        ...ci,
        product,
        variant,
      };
    })
    .filter(Boolean);
};

onMounted(loadData);

/* ==============================
   COMPUTED
================================ */
const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    const price =
      (item.product.base_price ?? 0) + (item.variant.extra_price ?? 0);
    return sum + price * item.quantity;
  }, 0)
);

/* ==============================
   ACTIONS
================================ */
const updateQuantity = async (item, delta) => {
  const newQty = item.quantity + delta;
  if (newQty < 1) return;

  if (newQty > item.variant.stock) {
    alert(`Tồn kho chỉ còn ${item.variant.stock}`);
    return;
  }

  item.quantity = newQty;
  await cartService.update(item.id, { quantity: newQty });
};

const removeItem = async (id) => {
  await cartService.delete(id);
  cartItems.value = cartItems.value.filter((i) => i.id !== id);
};

/* ==============================
   UTIL
================================ */
const formatMoney = (v = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
</script>

<template>
  <div class="container py-5">
    <h2 class="fw-bold mb-4">Giỏ hàng</h2>

    <div v-if="cartItems.length" class="card shadow-sm rounded-4">
      <table class="table align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Ảnh</th>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th class="text-center">Số lượng</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in cartItems" :key="item.id">
            <td>
              <img
                :src="item.product.images?.[0]"
                class="rounded"
                style="width: 70px; height: 70px; object-fit: cover"
              />
            </td>

            <td>
              <div class="fw-semibold">{{ item.product.name }}</div>
              <small class="text-muted">{{ item.variant.name }}</small>
            </td>

            <td>
              {{
                formatMoney(item.product.base_price + item.variant.extra_price)
              }}
            </td>

            <td class="text-center">
              <button class="qty-btn" @click="updateQuantity(item, -1)">
                −
              </button>
              <span class="mx-2">{{ item.quantity }}</span>
              <button
                class="qty-btn"
                @click="updateQuantity(item, 1)"
                :disabled="item.quantity >= item.variant.stock"
              >
                +
              </button>
            </td>

            <td class="fw-bold text-danger">
              {{
                formatMoney(
                  (item.product.base_price + item.variant.extra_price) *
                    item.quantity
                )
              }}
            </td>

            <td>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="removeItem(item.id)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between p-4 border-top">
        <h5>
          Tổng cộng:
          <span class="text-danger fw-bold">
            {{ formatMoney(cartTotal) }}
          </span>
        </h5>
        <router-link to="/checkout" class="btn btn-primary px-4">
          Thanh toán
        </router-link>
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      <h5>Giỏ hàng trống</h5>
    </div>
  </div>
</template>

<style scoped>
.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
}
.qty-btn:hover {
  background: #f1f1f1;
}
</style>
