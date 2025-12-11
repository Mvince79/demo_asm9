<template>
  <div class="container p-4">
    <h3 class="fw-bold mb-4">Sửa người dùng</h3>

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

      <button class="btn btn-primary btn-lg" @click="submit">Cập nhật</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { User } from "../../../services/user.service";

const route = useRoute();
const router = useRouter();
const service = new User();
const form = ref({});

onMounted(async () => {
  const res = await service.get(route.params.id);
  form.value = res.data;
});

const submit = async () => {
  await service.update(route.params.id, form.value);
  alert("Đã cập nhật!");
  router.push("/user_list");
};
</script>
