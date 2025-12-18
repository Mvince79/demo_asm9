<template>
  <div class="container py-4">
    <h3 class="mb-4">Thanh toán</h3>

    <div class="row">
      <!-- 🧾 Form thanh toán -->
      <div class="col-lg-7">
        <form id="checkoutForm" class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Họ tên</label>
            <input type="text" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" required />
          </div>
          <div class="col-12">
            <label class="form-label">Địa chỉ giao hàng</label>
            <input type="text" class="form-control" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Phương thức thanh toán</label>
            <select class="form-select" required>
              <option value="">Chọn phương thức...</option>
              <option>Thanh toán khi nhận hàng (COD)</option>
              <option>Chuyển khoản ngân hàng</option>
            </select>
          </div>

          <div class="col-12 text-end mt-3">
            <button
              type="button"
              class="btn btn-success px-4"
              @click="submitOrder"
            >
              Xác nhận đơn hàng
            </button>
          </div>
        </form>
      </div>

      <!-- 📦 Tóm tắt đơn hàng -->
      <div class="col-lg-5">
        <div class="card shadow-sm">
          <div class="card-header bg-light fw-bold">🧾 Tóm tắt đơn hàng</div>
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <span>Tổng sản phẩm:</span>
              <span>{{ cartItems.length }}</span>
            </div>

            <div class="d-flex justify-content-between">
              <span>Tổng tiền hàng:</span>
              <span>{{ formatMoney(subtotal) }}</span>
            </div>

            <div class="d-flex justify-content-between">
              <span>Phí vận chuyển:</span>
              <span>{{ formatMoney(shipping) }}</span>
            </div>

            <div class="d-flex justify-content-between">
              <span>VAT (10%):</span>
              <span>{{ formatMoney(vat) }}</span>
            </div>

            <hr />

            <div
              class="d-flex justify-content-between fw-bold text-danger fs-5"
            >
              <span>Tổng thanh toán:</span>
              <span>{{ formatMoney(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Cart } from "../../../services/cart.service";
import { Product } from "../../../services/product.service";
import { Order } from "../../../services/order.service";
import { OrderItem } from "../../../services/order_item.service";
import { useRouter } from "vue-router";

const router = useRouter();

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userId = currentUser?.id;

const cartService = new Cart();
const productService = new Product();
const orderService = new Order();
const orderItemService = new OrderItem();

const cartItems = ref([]);
const products = ref([]);

const formatMoney = (v = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);

/* =========================
   LOAD CART
========================= */
onMounted(async () => {
  if (!userId) return;

  const pRes = await productService.list();
  products.value = pRes.data || [];

  const cRes = await cartService.list(userId);
  const rawCart = cRes.data || [];

  cartItems.value = rawCart
    .map((ci) => {
      const p = products.value.find((x) => x.id === ci.product_id);
      const v = p?.variants?.find((x) => x.id === ci.variant_id);
      if (!p || !v) return null;
      return { ...ci, product: p, variant: v };
    })
    .filter(Boolean);
});

/* =========================
   COMPUTED
========================= */
const subtotal = computed(() =>
  cartItems.value.reduce((s, i) => {
    const price = i.product.base_price + i.variant.extra_price;
    return s + price * i.quantity;
  }, 0)
);

const vat = computed(() => subtotal.value * 0.1);
const shipping = 0;
const total = computed(() => subtotal.value + vat.value + shipping);

/* =========================
   SUBMIT ORDER
========================= */

const decreaseVariantStock = async (productId, variantId, quantity) => {
  // 1. Lấy product hiện tại
  const res = await productService.get(productId);
  const product = res.data;

  // 2. Tìm variant
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return;

  // 3. Kiểm tra tồn kho
  if (variant.stock < quantity) {
    throw new Error(`Sản phẩm ${product.name} không đủ tồn kho`);
  }

  // 4. Trừ stock
  variant.stock -= quantity;

  // 5. Update lại product
  await productService.update(product.id, product);
};

const submitOrder = async () => {
  if (!cartItems.value.length) {
    alert("Giỏ hàng trống");
    return;
  }

  try {
    // 1️⃣ CREATE ORDER
    const orderRes = await orderService.create({
      user_id: userId,
      user_name: currentUser.name,
      total_price: total.value,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    const orderId = orderRes.data.id;

    // 2️⃣ CREATE ORDER ITEMS + TRỪ STOCK
    for (const item of cartItems.value) {
      await orderItemService.create({
        order_id: orderId,

        product_id: item.product.id,
        product_name: item.product.name,

        variant_id: item.variant.id,
        variant_name: item.variant.name,

        quantity: item.quantity,
        price: item.product.base_price + item.variant.extra_price,
      });

      // 🔥 TRỪ STOCK
      await decreaseVariantStock(
        item.product.id,
        item.variant.id,
        item.quantity
      );
    }

    // 3️⃣ CLEAR CART
    for (const item of cartItems.value) {
      await cartService.delete(item.id);
    }

    alert("Đặt hàng thành công!");
    router.push("/");
  } catch (e) {
    console.error(e);
    alert(e.message || "Thanh toán thất bại");
  }
};
</script>
