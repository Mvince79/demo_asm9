<template>
  <section class="home-blog py-5">
    <div class="container">
      <h2 class="fw-bold mb-4 text-center">Tin tức & Bài viết mới nhất</h2>
      <div class="row g-4">
        <div class="col-md-4 d-flex" v-for="post in posts" :key="post.id">
          <div class="card shadow-sm flex-fill d-flex flex-column">
            <img
              :src="post.images?.[0] || '/placeholder.png'"
              class="card-img-top"
              alt="Blog image"
              style="object-fit: cover; height: 200px"
            />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ post.title }}</h5>
              <p
                class="card-text flex-fill"
                v-html="truncateHtml(post.content, 150)"
              ></p>
              <router-link
                :to="`/blog/${post.id}`"
                class="btn btn-primary btn-sm mt-auto"
              >
                Xem chi tiết
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Blog } from "../services/blog.service";

const blogService = new Blog();
const posts = ref([]);

onMounted(async () => {
  try {
    const res = await blogService.list();
    posts.value = res.data?.slice(0, 3) || [];
  } catch (e) {
    console.error(e);
  }
});

// Chuyển HTML sang text, cắt ký tự để giữ nút luôn đều
const truncateHtml = (html, len) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  let text = div.textContent || div.innerText || "";
  return text.length > len ? text.slice(0, len) + "..." : text;
};
</script>

<style scoped>
.card-text {
  overflow: hidden;
}
</style>
