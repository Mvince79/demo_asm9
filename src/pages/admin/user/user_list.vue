<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Người dùng</h3>

      <router-link
        to="/user_add"
        class="btn btn-success btn-lg rounded-3 px-4"
      >
        <i class="bi bi-plus-lg me-2"></i> Thêm người dùng
      </router-link>
    </div>

    <div class="table-responsive shadow-sm bg-white rounded-4 p-3">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in list" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.phone }}</td>

            <td class="text-center">
              <router-link
                :to="`/user_edit/${u.id}`"
                class="btn btn-primary btn-sm rounded-3 me-2"
              >
                <i class="bi bi-pencil-square"></i>
              </router-link>

              <button class="btn btn-danger btn-sm" @click="remove(u.id)">
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
import { User } from "../../../services/user.service";

const service = new User();
const list = ref([]);

onMounted(async () => {
  const res = await service.list();
  list.value = res.data;
});

const remove = async (id) => {
  if (!confirm("Xóa người dùng này?")) return;
  await service.delete(id);
  list.value = list.value.filter((x) => x.id !== id);
};
</script>
