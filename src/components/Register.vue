<template>
  <div
    class="auth-page d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="card p-4 shadow-sm" style="width: 360px">
      <h3 class="text-center mb-3">Đăng ký</h3>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label>Họ tên</label>
          <input v-model="name" type="text" class="form-control" required />
        </div>
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
        <button type="submit" class="btn btn-success w-100">
          Tạo tài khoản
        </button>
      </form>
      <div class="text-center mt-2">
        <router-link to="/login">Đã có tài khoản? Đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../assets/data/fakeApi";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");

const register = async () => {
  try {
    const user = await api.createUser({
      name: name.value,
      email: email.value,
      password: password.value,
      role: "customer",
    });
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Đăng ký thành công!");
    router.push("/");
  } catch (err) {
    if (err.status === 409) return alert(err.message);
    alert("Đăng ký thất bại!");
  }
};
</script>

<style scoped>
.auth-page {
  background: #f8f9fa;
}
</style>
