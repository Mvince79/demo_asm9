<template>
  <div
    class="auth-page d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="card p-4 shadow-sm" style="width: 360px">
      <h3 class="text-center mb-3">Đăng nhập</h3>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label>Email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label>Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-2">
          Đăng nhập
        </button>
      </form>
      <div class="d-flex justify-content-between">
        <router-link to="/register">Tạo tài khoản mới</router-link>
        <router-link to="/forgot-password">Quên mật khẩu?</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../assets/data/fakeApi";

const router = useRouter();
const email = ref("");
const password = ref("");

const login = async () => {
  try {
    const res = await api.login(email.value, password.value);
    localStorage.setItem("currentUser", JSON.stringify(res.user));
    localStorage.setItem("auth_token", res.token);
    router.push(res.user.role === "admin" ? "/admin" : "/");
  } catch (err) {
    alert(err.message || "Email hoặc mật khẩu không đúng!");
  }
};
</script>

<style scoped>
.auth-page {
  background: #f8f9fa;
}
</style>
