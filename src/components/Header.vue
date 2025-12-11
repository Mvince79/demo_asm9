<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top"
  >
    <div class="container">
      <!-- Logo -->
      <router-link class="navbar-brand fw-bold" to="/">
        <img src="/asset/logo.svg" alt="Logo" height="40" />
      </router-link>

      <!-- Navbar toggler -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar menu -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Menu items -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="item in menuItems" :key="item.to" class="nav-item">
            <router-link class="nav-link" :to="item.to">{{
              item.label
            }}</router-link>
          </li>
        </ul>

        <!-- Search -->
        <div class="d-flex me-3 position-relative" style="max-width: 280px">
          <input
            v-model="searchQuery"
            @input="onSearch"
            class="form-control rounded-pill"
            type="search"
            placeholder="Tìm sản phẩm..."
          />
          <ul
            v-if="filteredProducts.length && searchQuery"
            class="list-group position-absolute top-100 start-0 w-100 mt-1 shadow-sm"
            style="max-height: 250px; overflow-y: auto; z-index: 1050"
          >
            <li
              v-for="prod in filteredProducts"
              :key="prod.id"
              class="list-group-item list-group-item-action"
              @click="goToProduct(prod.id)"
            >
              {{ prod.name }}
            </li>
          </ul>
        </div>

        <!-- Account -->
        <div class="dropdown me-3">
          <button
            class="btn btn-outline-primary rounded-pill dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            {{ currentUser ? currentUser.name : "Tài khoản" }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            <li v-if="!currentUser">
              <router-link class="dropdown-item" to="/login"
                >Đăng nhập</router-link
              >
            </li>
            <li v-if="!currentUser">
              <router-link class="dropdown-item" to="/register"
                >Đăng ký</router-link
              >
            </li>
            <li v-else>
              <button class="dropdown-item" @click="logout">Đăng xuất</button>
            </li>
          </ul>
        </div>

        <!-- Cart -->
        <router-link
          to="/cart"
          class="btn btn-outline-secondary position-relative rounded-circle p-2"
        >
          <i class="bi bi-cart3"></i>
          <span
            v-if="cartCount > 0"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ cartCount }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import sampleData from "../assets/data/data.json";

const router = useRouter();

// Menu items
const menuItems = [
  { label: "Sản phẩm", to: "/product" },
  { label: "Bài viết", to: "/blog" },
  { label: "Liên hệ", to: "/contact" },
  { label: "Về chúng tôi", to: "/about_us" },
];

// User state
const currentUser = ref(null);
const cartCount = ref(0);

// Load user và cart count từ localStorage + JSON
onMounted(() => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    currentUser.value = user;
    const userCart = sampleData.cart_items.filter((c) => c.user_id === user.id);
    cartCount.value = userCart.reduce((sum, item) => sum + item.quantity, 0);
  }
});

// Logout
const logout = () => {
  currentUser.value = null;
  cartCount.value = 0;
  localStorage.removeItem("currentUser");
  localStorage.removeItem("auth_token");
  router.push("/");
};

// Search
const searchQuery = ref("");
const filteredProducts = ref([]);
const products = ref(
  sampleData.products.map((p) => ({ id: p.id, name: p.name }))
);

const onSearch = () => {
  if (!searchQuery.value) return (filteredProducts.value = []);
  filteredProducts.value = products.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

const goToProduct = (id) => router.push(`/product/${id}`);
</script>

<style scoped>
body {
  padding-top: 70px; /* Tránh navbar fixed che nội dung */
}
</style>
