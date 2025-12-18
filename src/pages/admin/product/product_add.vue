<template>
  <div class="w-100 py-4">
    <form
      class="bg-white shadow-sm p-4 rounded-4 border mx-auto"
      style="max-width: 1400px"
      @submit.prevent="submitProduct"
    >
      <div class="border-bottom pb-3 mb-4">
        <h3 class="fw-bold text-dark">Thêm sản phẩm</h3>
      </div>

      <div class="row g-4">
        <!-- Thông tin cơ bản -->
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Tên sản phẩm</label>
            <input
              v-model="productObj.name"
              type="text"
              class="form-control form-control-lg rounded-3"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Giá</label>
            <input
              v-model.number="productObj.base_price"
              type="number"
              class="form-control form-control-lg rounded-3"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Danh mục</label>
            <select
              v-model="productObj.category_id"
              class="form-select form-select-lg rounded-3"
              required
            >
              <option disabled value="">Chọn danh mục</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Upload ảnh -->
        <div class="col-md-6">
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
            <p class="text-muted mt-2">
              Kéo thả hoặc bấm để chọn ảnh (tối đa 5)
            </p>
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
            <div class="col-4" v-for="(file, i) in files" :key="i">
              <div class="position-relative image-box rounded-3 shadow-sm">
                <img
                  :src="file.previewUrl"
                  class="w-100 rounded"
                  style="height: 90px; object-fit: cover"
                />
                <button
                  class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                  style="width: 24px; height: 24px"
                  @click="removeFile(i)"
                  type="button"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mô tả -->
      <div class="mt-4">
        <label class="form-label fw-semibold mb-2">Mô tả chi tiết</label>
        <div class="border rounded-4 shadow-sm p-2">
          <Editor v-model="productObj.description" />
        </div>
      </div>

      <!-- VARIANTS -->
      <div class="mt-5">
        <h5 class="fw-bold mb-3">Biến thể sản phẩm</h5>

        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th>Tên biến thể</th>
              <th>Giá cộng thêm</th>
              <th>Tồn kho</th>
              <th width="120">Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="v in variants" :key="v.id">
              <td>{{ v.name }}</td>
              <td>{{ formatMoney(v.extra_price) }}</td>
              <td>{{ v.stock }}</td>
              <td>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="removeVariant(v.id)"
                  type="button"
                >
                  Xóa
                </button>
              </td>
            </tr>

            <tr v-if="!variants.length">
              <td colspan="4" class="text-center text-muted">
                Chưa có biến thể
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ADD VARIANT -->
        <div class="card p-3 mt-3">
          <h6 class="fw-semibold mb-3">Thêm biến thể</h6>

          <div class="row g-2">
            <div class="col-md-4">
              <input
                v-model="variantForm.name"
                class="form-control"
                placeholder="Tên biến thể"
              />
            </div>

            <div class="col-md-4">
              <input
                v-model.number="variantForm.extra_price"
                type="number"
                class="form-control"
                placeholder="Giá cộng thêm"
              />
            </div>

            <div class="col-md-4">
              <input
                v-model.number="variantForm.stock"
                type="number"
                class="form-control"
                placeholder="Tồn kho"
              />
            </div>
          </div>

          <button
            class="btn btn-success btn-sm mt-3"
            @click="addVariant"
            type="button"
          >
            Thêm biến thể
          </button>
        </div>
      </div>

      <div class="text-center mt-4">
        <button
          type="submit"
          class="btn btn-success btn-lg px-5 py-2 rounded-3 shadow-sm"
        >
          Thêm sản phẩm
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Product } from "../../../services/product.service";
import Editor from "../../../components/admin/editor/Editor.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Category } from "../../../services/category.service";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/du1mhz6z4/image/upload`;
const UPLOAD_PRESET = "upload_preset";
const MAX_FILES = 5;

const router = useRouter();
const productService = new Product();
const categoryService = new Category();

const categories = ref([]);
const productObj = ref({
  name: "",
  base_price: 0,
  description: "",
  images: [],
  category_id: "",
});

const files = ref([]);
const isDragging = ref(false);
const fileInputRef = ref(null);

const variantForm = ref({
  name: "",
  extra_price: 0,
  stock: 0,
});

const variants = ref([]);

// Load danh mục từ JSON
onMounted(async () => {
  try {
    const resCats = await categoryService.list();
    categories.value = resCats.data.categories || resCats.data;
  } catch (e) {
    console.error("Không lấy được danh mục", e);
  }
});

// Xử lý upload ảnh
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
  if (files.value.length >= MAX_FILES) return alert(`Tối đa ${MAX_FILES} ảnh`);
  let valid = [...newFiles]
    .filter((f) => f.type.startsWith("image/"))
    .slice(0, MAX_FILES - files.value.length);
  valid.forEach((f) =>
    files.value.push({
      file: f,
      name: f.name,
      previewUrl: URL.createObjectURL(f),
    })
  );
};

const addVariant = () => {
  if (!variantForm.value.name) {
    alert("Nhập tên biến thể");
    return;
  }

  variants.value.push({
    id: crypto.randomUUID(),
    ...variantForm.value,
  });

  variantForm.value = { name: "", extra_price: 0, stock: 0 };
};

const removeVariant = (id) => {
  variants.value = variants.value.filter((v) => v.id !== id);
};

const removeFile = (i) => {
  URL.revokeObjectURL(files.value[i].previewUrl);
  files.value.splice(i, 1);
};

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "products");
  const res = await axios.post(CLOUDINARY_URL, formData);
  return res.data.secure_url;
};

const startUpload = async () => {
  if (!files.value.length) return [];
  return await Promise.all(files.value.map((f) => uploadToCloudinary(f.file)));
};

const formatMoney = (v) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);

// Submit thêm sản phẩm
const submitProduct = async () => {
  try {
    const uploadedUrls = await startUpload();
    productObj.value.images = uploadedUrls;
    productObj.value.variants = variants.value;

    const result = await productService.create(productObj.value);
    if (result.status === 201 || result.status === 200) {
      alert("Thêm sản phẩm thành công!");
      router.push("/product_list");
    }
  } catch (e) {
    console.error(e);
    alert("Thêm sản phẩm thất bại!");
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
