<template>
  <div
    class="auth-page d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="card p-4 shadow-sm" style="width: 360px">
      <h3 class="text-center mb-3">Quên mật khẩu</h3>
      <form @submit.prevent="resetPassword">
        <div class="mb-3">
          <label>Email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label>Mật khẩu mới</label>
          <input
            v-model="newPassword"
            type="password"
            class="form-control"
            required
          />
        </div>
        <button type="submit" class="btn btn-warning w-100 mb-2">
          Cập nhật mật khẩu
        </button>
      </form>
      <div class="text-center">
        <router-link to="/login">Quay lại đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "../assets/data/fakeApi";

const email = ref("");
const newPassword = ref("");

const resetPassword = async () => {
  try {
    const res = await api.resetPassword(email.value, newPassword.value);
    alert(res.message);
  } catch (err) {
    alert(err.message || "Email không tồn tại!");
  }
};
</script>

<style scoped>
.auth-page {
  background: #f8f9fa;
}
</style>
