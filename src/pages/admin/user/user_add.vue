<template>
  <div class="container p-4">
    <h3 class="fw-bold mb-4">Thêm người dùng</h3>

    <div class="card shadow-sm p-4 rounded-4">
      <div class="mb-3">
        <label class="form-label fw-semibold">Họ tên</label>
        <input
          type="text"
          v-model="form.name"
          class="form-control form-control-lg"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input
          type="email"
          v-model="form.email"
          class="form-control form-control-lg"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">SĐT</label>
        <input
          type="text"
          v-model="form.phone"
          class="form-control form-control-lg"
        />
      </div>

      <button class="btn btn-success btn-lg" @click="submit">Lưu</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { User } from "../../../services/user.service";

const form = ref({ name: "", email: "", phone: "" });
const router = useRouter();
const service = new User();

const submit = async () => {
  await service.create(form.value);
  alert("Đã thêm!");
  router.push("/user_list");
};
</script>
