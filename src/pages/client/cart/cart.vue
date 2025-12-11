<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Product } from "../../../services/product.service";
import { Category } from "../../../services/category.service";
import { Cart } from "../../../services/cart.service";

const routerInstance = useRouter(); // đổi tên để tránh conflict với import router
const userId = "u1";

const cartItems = ref([]);
const products = ref([]);
const categories = ref([]);

const productService = new Product();
const categoryService = new Category();
const cartService = new Cart();

// Load dữ liệu
const loadData = async () => {
  try {
    // Lấy danh mục
    const resCat = await categoryService.list();
    categories.value = resCat?.data?.categories || resCat?.data || [];

    // Lấy sản phẩm
    const resProd = await productService.list();
    products.value = resProd?.data?.products || resProd?.data || [];

    // Lấy giỏ hàng
    const resCart = await cartService.list(userId);
    const rawCartItems = resCart?.data?.cart_items || resCart?.data || [];
    cartItems.value = rawCartItems
      .map((ci) => {
        const product = products.value.find((p) => p.id === ci.product_id);
        if (!product) return null;
        const variant =
          product?.variants?.find((v) => v.id === ci.variant_id) || {};
        return { ...ci, product, variant };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("Lỗi load dữ liệu:", err);
  }
};

onMounted(() => loadData());

// Tổng tiền
const cartTotal = computed(() =>
  cartItems.value.reduce((sum, item) => {
    const price = item.product?.base_price ?? 0;
    const extra = item.variant?.extra_price ?? 0;
    const qty = item.quantity ?? 0;
    return sum + (price + extra) * qty;
  }, 0)
);

// Thay đổi số lượng
const updateQuantity = async (item, delta) => {
  const newQty = (item.quantity ?? 0) + delta;
  if (newQty < 1) return;
  if (newQty > (item.variant?.stock ?? Infinity)) return;

  try {
    await cartService.update(item.id, { quantity: newQty });
    item.quantity = newQty;
  } catch (err) {
    console.error("Lỗi update quantity:", err);
  }
};

// Xóa sản phẩm
const removeItem = async (id) => {
  try {
    await cartService.delete(id);
    cartItems.value = cartItems.value.filter((item) => item.id !== id);
  } catch (err) {
    console.error("Lỗi xóa sản phẩm:", err);
  }
};

// Format tiền
const formatMoney = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v
  );
</script>

<template>
  <div class="container py-5">
    <h3 class="mb-4 fw-bold">Giỏ hàng của bạn</h3>

    <div v-if="cartItems.length">
      <div class="table-responsive shadow-sm rounded">
        <table class="table align-middle mb-0 bg-white">
          <thead class="table-light text-uppercase text-secondary">
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
                  :src="item.product?.images?.[0] || '/placeholder.png'"
                  style="width: 80px; height: 80px; object-fit: cover"
                  class="rounded"
                />
              </td>
              <td>
                <div class="fw-semibold">
                  {{ item.product?.name || "Sản phẩm không xác định" }}
                </div>
                <div class="text-muted small">
                  {{ item.variant?.name || "" }}
                </div>
              </td>
              <td>
                {{
                  formatMoney(
                    (item.product?.base_price ?? 0) +
                      (item.variant?.extra_price ?? 0)
                  )
                }}
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="updateQuantity(item, -1)"
                >
                  -
                </button>
                <span class="px-2">{{ item.quantity ?? 0 }}</span>
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="updateQuantity(item, 1)"
                >
                  +
                </button>
              </td>
              <td class="fw-bold text-danger">
                {{
                  formatMoney(
                    ((item.product?.base_price ?? 0) +
                      (item.variant?.extra_price ?? 0)) *
                      (item.quantity ?? 0)
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
      </div>

      <div
        class="d-flex justify-content-between align-items-center mt-4 p-3 bg-white shadow-sm rounded"
      >
        <h5>
          Tổng cộng:
          <span class="text-danger fw-bold">{{ formatMoney(cartTotal) }}</span>
        </h5>
        <router-link to="/checkout" class="btn btn-primary px-4 py-2"
          >Thanh toán</router-link
        >
      </div>
    </div>

    <div v-else class="text-center py-5 text-muted">
      <h5>Giỏ hàng trống</h5>
      <router-link to="/" class="btn btn-outline-primary mt-3"
        >Quay lại cửa hàng</router-link
      >
    </div>
  </div>
</template>
