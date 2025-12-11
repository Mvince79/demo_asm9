<template>
  <div class="container" style="margin-top: 80px">
    <div class="row">
      <!-- Danh sách bài viết -->
      <div class="col-lg-8">
        <h2 class="fw-bold mb-4">Tin tức & Bài viết mới nhất</h2>

        <!-- Card bài viết -->
        <div
          v-for="post in posts"
          :key="post.id"
          class="card mb-4 shadow-sm border-0 rounded-3"
        >
          <div class="row g-0 align-items-center">
            <div class="col-md-4">
              <img
                :src="post.images?.[0]"
                class="img-fluid rounded-start"
                alt="Banner bài viết"
              />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title fw-semibold">{{ post.title }}</h5>
                <p class="card-text text-muted fs-6 mb-2">
                  <i class="bi bi-calendar3"></i>
                  {{ formatDate(post.created_at) }}
                </p>
                <p class="card-text">
                  {{ post.summary || truncate(post.content, 100) }}
                </p>
                <router-link
                  :to="`/blog/${post.id}`"
                  class="btn btn-primary btn-sm"
                >
                  Xem chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination nếu cần -->
      </div>

      <!-- Sidebar -->
      <aside class="col-lg-4">
        <div class="mb-4">
          <h5 class="fw-semibold mb-3">Bài viết nổi bật</h5>
          <ul class="list-group list-group-flush">
            <li
              v-for="featured in featuredPosts"
              :key="featured.id"
              class="list-group-item"
            >
              <router-link
                :to="`/blog/${featured.id}`"
                class="text-decoration-none text-dark"
              >
                {{ featured.title }}
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Blog } from "../../../services/blog.service";

const blogService = new Blog();
const posts = ref([]);
const featuredPosts = ref([]);

onMounted(async () => {
  try {
    const res = await blogService.list(); // gọi API list bài viết
    posts.value = res.data || [];
    featuredPosts.value = posts.value.slice(0, 5); // ví dụ 5 bài nổi bật
  } catch (e) {
    console.error(e);
  }
});

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
const truncate = (text, len) =>
  text?.length > len ? text.slice(0, len) + "..." : text;
</script>
