// import { createRouter, createWebHistory } from "vue-router";

// import Home from "../pages/client/home/home.vue";
// import Product from "../pages/client/product/product.vue";
// import AboutUs from "../pages/client/about_us/about_us.vue";
// import Contact from "../pages/client/contact/contact.vue";

// import DefaultLayout from "../pages/client/default/defaultLayout.vue"; // cho home
// import BaseLayout from "../pages/client/default/baseLayout.vue"; // cho product, about, contact
// import Blog from "../pages/client/blog/blog.vue";
// import Cart from "../pages/client/cart/cart.vue";
// import Checkout from "../pages/client/checkout/checkout.vue";



// import adminLayout from "../pages/admin/adminLayout.vue";
// import product_list from "../pages/admin/product/product_list.vue";
// import product_add from "../pages/admin/product/product_add.vue";
// import category_list from "../pages/admin/category/category_list.vue";
// import category_add from "../pages/admin/category/category_add.vue";
// import user_list from "../pages/admin/user/user_list.vue";
// import user_add from "../pages/admin/user/user_add.vue";
// import order_list from "../pages/admin/order/order_list.vue";
// import category_edit from "../pages/admin/category/category_edit.vue";
// import user_edit from "../pages/admin/user/user_edit.vue";
// import order_edit from "../pages/admin/order/order_edit.vue";
// import product_edit from "../pages/admin/product/product_edit.vue";
// import Dashbroad from "../pages/admin/dashbroad/dashbroad.vue";
// import Product_detail from "../pages/client/product_detail/product_detail.vue";
// import Login from "../components/Login.vue";
// import Register from "../components/Register.vue";
// import ForgotPassword from "../components/ForgotPassword.vue";

// const routes = [
//   // Home
//   {
//     path: "/",
//     component: DefaultLayout,
//     children: [
//       { path: "", component: Home }, // khi vào / thì render Home trong layout
//     ],
//   },

//   // Các trang còn lại
//   {
//     path: "/", // vẫn root nhưng children có path cụ thể
//     component: BaseLayout,
//     children: [
//       { path: "product", component: Product },
//       { path: "product/:id", component: Product_detail, name: "product-detail" },
//       { path: "about_us", component: AboutUs },
//       { path: "contact", component: Contact },
//       { path: "blog", component: Blog },
//       { path: "cart", component: Cart },
//       { path: "checkout", component: Checkout },
//       { path: "login", component: Login },
//       { path: "register", component: Register },
//       { path: "forgot-password", component: ForgotPassword },
//     ],
//   },

//   {
//     path: "/admin",
//     component: adminLayout,
//     children: [
//       { path: "", component: Dashbroad },
//       { path: "/product_list", component: product_list },
//       { path: "/product_add", component: product_add },
//       { path: "/product_edit/:id", component: product_edit },
//       { path: "/category_list", component: category_list },
//       { path: "/category_add", component: category_add },
//       { path: "/category_edit/:id", component: category_edit },
//       { path: "/user_list", component: user_list },
//       { path: "/user_add", component: user_add },
//       { path: "/user_edit/:id", component: user_edit },
//       { path: "/order_list", component: order_list },
//       { path: "/order_edit/:id", component: order_edit },
//     ],
//   },

// ];

// export const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });


import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/client/home/home.vue";
import Product from "../pages/client/product/product.vue";
import AboutUs from "../pages/client/about_us/about_us.vue";
import Contact from "../pages/client/contact/contact.vue";

import DefaultLayout from "../pages/client/default/defaultLayout.vue";
import BaseLayout from "../pages/client/default/baseLayout.vue";
import Blog from "../pages/client/blog/blog.vue";
import Cart from "../pages/client/cart/cart.vue";
import Checkout from "../pages/client/checkout/checkout.vue";

import adminLayout from "../pages/admin/adminLayout.vue";
import product_list from "../pages/admin/product/product_list.vue";
import product_add from "../pages/admin/product/product_add.vue";
import category_list from "../pages/admin/category/category_list.vue";
import category_add from "../pages/admin/category/category_add.vue";
import user_list from "../pages/admin/user/user_list.vue";
import user_add from "../pages/admin/user/user_add.vue";
import order_list from "../pages/admin/order/order_list.vue";
import category_edit from "../pages/admin/category/category_edit.vue";
import user_edit from "../pages/admin/user/user_edit.vue";
import order_edit from "../pages/admin/order/order_edit.vue";
import product_edit from "../pages/admin/product/product_edit.vue";
import Dashbroad from "../pages/admin/dashbroad/dashbroad.vue";
import Product_detail from "../pages/client/product_detail/product_detail.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import ForgotPassword from "../components/ForgotPassword.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [{ path: "", component: Home }],
  },
  {
    path: "/",
    component: BaseLayout,
    children: [
      { path: "product", component: Product },
      { path: "product/:id", component: Product_detail, name: "product-detail" },
      { path: "about_us", component: AboutUs },
      { path: "contact", component: Contact },
      { path: "blog", component: Blog },
      { path: "cart", component: Cart },
      { path: "checkout", component: Checkout },
      { path: "login", component: Login },
      { path: "register", component: Register },
      { path: "forgot-password", component: ForgotPassword },
    ],
  },
  {
    path: "/admin",
    component: adminLayout,
    children: [
      { path: "", component: Dashbroad },
      { path: "/product_list", component: product_list },
      { path: "/product_add", component: product_add },
      { path: "/product_edit/:id", component: product_edit },
      { path: "/category_list", component: category_list },
      { path: "/category_add", component: category_add },
      { path: "/category_edit/:id", component: category_edit },
      { path: "/user_list", component: user_list },
      { path: "/user_add", component: user_add },
      { path: "/user_edit/:id", component: user_edit },
      { path: "/order_list", component: order_list },
      { path: "/order_edit/:id", component: order_edit },
    ],
    meta: { requiresAdmin: true }, // <-- đánh dấu route admin
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard: bảo vệ route admin
router.beforeEach((to, from, next) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (to.meta.requiresAdmin) {
    if (!currentUser) {
      alert("Bạn cần đăng nhập để truy cập trang admin!");
      return next("/login"); // chưa đăng nhập -> chuyển login
    }
    if (currentUser.role !== "admin") {
      alert("Bạn không có quyền truy cập trang admin!");
      return next("/"); // không phải admin -> về trang home
    }
  }
  next();
});
