<template>
  <div class="w-100 py-4">
    <form
      class="bg-white shadow-sm p-4 rounded-4 border mx-auto"
      style="max-width: 1400px"
      @submit.prevent="submitEdit"
    >
      <div class="border-bottom pb-3 mb-4">
        <h3 class="fw-bold text-dark">Chỉnh sửa bài viết</h3>
      </div>

      <!-- Tiêu đề -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Tiêu đề</label>
        <input
          v-model="blogObj.title"
          type="text"
          class="form-control form-control-lg rounded-3"
          required
        />
      </div>

      <!-- Nội dung -->
      <div class="mb-3">
        <label class="form-label fw-semibold mb-2">Nội dung</label>
        <div class="border rounded-4 shadow-sm p-2">
          <Editor v-model="blogObj.content" />
        </div>
      </div>

      <!-- Upload ảnh -->
      <div class="mb-3">
        <label class="form-label fw-semibold mb-2">Hình ảnh</label>

        <div
          class="upload-zone border border-2 border-dashed rounded-4 p-5 text-center bg-light"
          :class="{ 'border-success bg-success bg-opacity-10': isDragging }"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
          @click="openFileBrowser"
        >
          <i class="bi bi-cloud-upload display-5 text-secondary"></i>
          <p class="text-muted mt-2">Kéo thả hoặc bấm để chọn ảnh (tối đa 5)</p>
          <input
            type="file"
            multiple
            ref="fileInputRef"
            @change="handleFileChange"
            hidden
            accept="image/*"
          />
        </div>

        <div class="row g-2 mt-3">
          <div class="col-4" v-for="(img, index) in previewImages" :key="index">
            <div class="position-relative image-box rounded-3 shadow-sm">
              <img
                :src="img"
                class="w-100 rounded"
                style="height: 90px; object-fit: cover"
              />
              <button
                class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                style="width: 24px; height: 24px"
                @click="removeImage(index)"
                type="button"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Button -->
      <div class="text-center mt-4">
        <button
          type="submit"
          class="btn btn-primary btn-lg px-5 py-2 rounded-3 shadow-sm"
        >
          Cập nhật
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Blog } from "../../../services/blog.service";
import Editor from "../../../components/admin/editor/Editor.vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/du1mhz6z4/image/upload`;
const UPLOAD_PRESET = "upload_preset";
const MAX_FILES = 5;

const router = useRouter();
const route = useRoute();
const blogService = new Blog();

const blogObj = ref({
  title: "",
  content: "",
  images: [],
});

const previewImages = ref([]);
const files = ref([]);
const isDragging = ref(false);
const fileInputRef = ref(null);

// Load bài viết
onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await blogService.get(id);
    blogObj.value = res.data;
    previewImages.value = [...(res.data.images || [])];
  } catch (e) {
    console.error("Load blog error:", e);
  }
});

// Drag & drop
const openFileBrowser = () => fileInputRef.value.click();
const handleFileChange = (e) => {
  addFiles(e.target.files);
  e.target.value = "";
};
const handleDragOver = () => (isDragging.value = true);
const handleDragLeave = () => (isDragging.value = false);
const handleDrop = (e) => {
  isDragging.value = false;
  addFiles(e.dataTransfer.files);
};

const addFiles = (newFiles) => {
  if (previewImages.value.length + files.value.length >= MAX_FILES)
    return alert(`Tối đa ${MAX_FILES} ảnh`);
  const valid = [...newFiles]
    .filter((f) => f.type.startsWith("image/"))
    .slice(0, MAX_FILES - previewImages.value.length - files.value.length);

  valid.forEach((f) =>
    files.value.push({ file: f, previewUrl: URL.createObjectURL(f) })
  );
  previewImages.value.push(...valid.map((f) => URL.createObjectURL(f)));
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  if (index < blogObj.value.images.length) {
    blogObj.value.images.splice(index, 1);
  } else {
    files.value.splice(index - blogObj.value.images.length, 1);
  }
};

// Upload
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "blogs");
  const res = await axios.post(CLOUDINARY_URL, formData);
  return res.data.secure_url;
};

const startUpload = async () => {
  if (!files.value.length) return [];
  return await Promise.all(files.value.map((f) => uploadToCloudinary(f.file)));
};

// Submit
const submitEdit = async () => {
  try {
    const uploaded = await startUpload();
    blogObj.value.images.push(...uploaded);

    await blogService.update(blogObj.value.id, blogObj.value);
    alert("Cập nhật bài viết thành công!");
    router.push("/blog");
  } catch (e) {
    console.error(e);
    alert("Cập nhật thất bại!");
  }
};
</script>

<style scoped>
.upload-zone {
  cursor: pointer;
  transition: 0.25s;
  border-style: dashed !important;
}
.upload-zone:hover {
  background-color: #f0f2f5;
}
.image-box {
  overflow: hidden;
}
</style>
