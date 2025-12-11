<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-lg-8" v-if="post">
        <section class="mb-4 text-center">
          <h1 class="fw-bold mb-3">{{ post.title }}</h1>
          <p class="text-muted fs-6">
            Tác giả:
            <span class="fw-semibold">{{ post.author || "Admin" }}</span> •
            <i class="bi bi-calendar3"></i> {{ formatDate(post.created_at) }}
          </p>
          <img
            :src="post.images?.[0]"
            class="img-fluid rounded-3 shadow-sm mt-3"
            alt="Banner bài viết"
          />
        </section>

        <section class="mb-5">
          <div v-html="post.content"></div>
        </section>
      </div>

      <aside class="col-lg-4">
        <div class="mb-4" v-if="recentPosts.length">
          <h5 class="fw-semibold mb-3">Bài viết gần đây</h5>
          <ul class="list-group list-group-flush">
            <li v-for="p in recentPosts" :key="p.id" class="list-group-item">
              <router-link
                :to="`/post/${p.id}`"
                class="text-decoration-none text-dark"
              >
                {{ p.title }}
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
import { useRoute } from "vue-router";

const blogService = new Blog();
const route = useRoute(); 
const post = ref(null);
const recentPosts = ref([]);

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await blogService.get(id);
    post.value = res.data;

    const allPosts = await blogService.list();
    recentPosts.value = (allPosts.data || [])
      .filter((p) => p.id !== id)
      .slice(0, 5);
  } catch (e) {
    console.error(e);
  }
});

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
</script>
