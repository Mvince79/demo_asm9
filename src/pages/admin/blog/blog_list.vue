<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Danh sách bài viết</h3>
      <router-link to="/blog_add" class="btn btn-success btn-lg rounded-3 px-4">
        <i class="bi bi-plus-lg me-2"></i> Thêm bài viết
      </router-link>
    </div>

    <div class="table-responsive shadow-sm rounded-4 bg-white p-3 border">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Hình</th>
            <th>Tiêu đề</th>
            <th>Ngày tạo</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>
              <img
                :src="item.images?.[0]"
                class="rounded"
                style="width: 60px; height: 60px; object-fit: cover"
              />
            </td>
            <td class="fw-semibold">{{ item.title }}</td>
            <td>{{ item.created_at }}</td>
            <td class="text-center">
              <router-link
                :to="`/blog_edit/${item.id}`"
                class="btn btn-primary btn-sm rounded-3 me-2"
              >
                <i class="bi bi-pencil-square"></i>
              </router-link>
              <button
                @click="deleteItem(item.id)"
                class="btn btn-danger btn-sm rounded-3"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Blog } from "../../../services/blog.service";

const blogService = new Blog();
const list = ref([]);

onMounted(async () => {
  try {
    const res = await blogService.list();
    list.value = res.data || [];
  } catch (e) {
    console.error("Load blog list error:", e);
  }
});

const deleteItem = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
  try {
    await blogService.delete(id);
    list.value = list.value.filter((b) => b.id !== id);
    alert("Đã xóa!");
  } catch (e) {
    console.error(e);
    alert("Xóa thất bại!");
  }
};
</script>

<style scoped>
.table img {
  transition: 0.25s;
}
.table img:hover {
  transform: scale(1.1);
}
</style>
