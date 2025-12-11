<template>
  <div class="container p-4">
    <h3 class="fw-bold mb-4">Thêm danh mục</h3>

    <div class="card shadow-sm p-4 rounded-4">
      <div class="mb-3">
        <label class="form-label fw-semibold">Tên danh mục</label>
        <input
          type="text"
          class="form-control form-control-lg"
          v-model="form.name"
        />
      </div>

      <button @click="submit" class="btn btn-success btn-lg rounded-3">
        Lưu
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Category } from "../../../services/category.service";

const form = ref({ name: "" });
const router = useRouter();
const service = new Category();

const submit = async () => {
  await service.create(form.value);
  alert("Đã thêm!");
  router.push("/category_list");
};
</script>
