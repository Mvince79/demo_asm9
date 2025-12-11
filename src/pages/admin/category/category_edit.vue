<template>
  <div class="container p-4">
    <h3 class="fw-bold mb-4">Sửa danh mục</h3>

    <div class="card shadow-sm p-4 rounded-4">
      <div class="mb-3">
        <label class="form-label fw-semibold">Tên danh mục</label>
        <input
          type="text"
          class="form-control form-control-lg"
          v-model="form.name"
        />
      </div>

      <button @click="submit" class="btn btn-primary btn-lg rounded-3">
        Cập nhật
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Category } from "../../../services/category.service";

const service = new Category();
const route = useRoute();
const router = useRouter();

const form = ref({ name: "" });

onMounted(async () => {
  const res = await service.get(route.params.id);
  form.value = res.data;
});

const submit = async () => {
  await service.update(route.params.id, form.value);
  alert("Đã cập nhật!");
  router.push("/category_list");
};
</script>
