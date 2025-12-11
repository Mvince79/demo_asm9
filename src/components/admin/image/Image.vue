<template>
    <div class="container my-5">

        <div class="drop-zone border border-dashed p-5 text-center mb-4"
            :class="{ 'border-primary bg-light-subtle': isDragging }" @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop" @click="openFileBrowser">
            <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
            <p class="lead mb-0">Kéo và thả hình ảnh vào đây, hoặc nhấn để chọn file</p>
            <p class="small text-muted">(Chọn tối đa 5 hình ảnh, định dạng JPG/PNG)</p>

            <input type="file" multiple ref="fileInputRef" @change="handleFileChange" hidden
                accept="image/png, image/jpeg">
        </div>

        <h5 v-if="files.length > 0" class="mb-3">Hình ảnh đã chọn ({{ files.length }}):</h5>

        <div class="row g-3">
            <div v-for="(file, index) in files" :key="index" class="col-4 col-md-3 col-lg-2">
                <div class="position-relative shadow-sm rounded overflow-hidden">

                    <img :src="file.previewUrl" class="img-fluid w-100 h-100 object-fit-cover img-thumbnail"
                        :alt="file.name">

                    <button @click="removeFile(index)"
                        class="btn btn-danger btn-sm p-0 position-absolute top-0 end-0 m-1 rounded-circle"
                        title="Xóa hình ảnh" style="width: 20px; height: 20px; font-size: 10px;">
                        <i class="bi bi-x"></i> </button>
                </div>
            </div>
        </div>
        <button v-if="files.length > 0" @click="startUpload" class="btn btn-success btn-lg mt-4">
            <i class="bi bi-cloud-upload"></i> Bắt đầu Upload ({{ files.length }} ảnh)
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/du1mhz6z4/image/upload`;
const UPLOAD_PRESET = 'upload_preset';

const files = ref([]);
const isDragging = ref(false);
const fileInputRef = ref(null);

const MAX_FILES = 5;

const openFileBrowser = () => {
    fileInputRef.value.click();
};

const handleFileChange = (event) => {
    addFiles(event.target.files);
    event.target.value = '';
};

const handleDragOver = () => {
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleDrop = (event) => {
    isDragging.value = false;
    addFiles(event.dataTransfer.files);
};

const addFiles = (newFiles) => {
    if (files.value.length >= MAX_FILES) {
        alert(`Bạn chỉ được chọn tối đa ${MAX_FILES} hình ảnh.`);
        return;
    }

    let validFiles = [...newFiles]
        .filter(file => file.type.startsWith('image/'))
        .slice(0, MAX_FILES - files.value.length);

    validFiles.forEach(file => {
        const previewUrl = URL.createObjectURL(file);

        files.value.push({
            file,
            name: file.name,
            previewUrl
        });
    });
};

const removeFile = (index) => {
    URL.revokeObjectURL(files.value[index].previewUrl);
    files.value.splice(index, 1);
};

const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'products'); 


    try {
        const response = await axios.post(CLOUDINARY_URL, formData, {
            onUploadProgress: progressEvent => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            }
        });

        const data = response.data;
        console.log(data);// duong dan hinh anh duoc tra ve sau khi upload lên Cloudinary
        
        return {
            url: data.secure_url,
            publicId: data.public_id,
        };

    } catch (error) {
        console.error(`Upload file ${file.name} thất bại:`, error.response || error);
        throw new Error(`Không thể upload ${file.name}.`);
    }
};

const startUpload = async () => {
    if (files.value.length === 0) {
        alert("Vui lòng chọn ít nhất một hình ảnh.");
        return;        
    }
    
    const uploadPromises = files.value.map(fileItem => uploadToCloudinary(fileItem.file));    
    
    try {
        const results = await Promise.all(uploadPromises);
        
        console.log("Upload thành công:", results);
        alert(`Đã upload thành công ${results.length} hình ảnh lên Cloudinary!`);
        
    } catch (error) {
        console.error("Lỗi trong quá trình upload:", error);
        alert("Có lỗi xảy ra trong quá trình upload. Vui lòng kiểm tra console.");
    }
};
</script>

<style scoped>
.border-dashed {
    border-style: dashed !important;
    cursor: pointer;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}
</style>