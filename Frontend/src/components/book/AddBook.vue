<template>
  <div class="container mt-4">
    <h2>Thêm Sách Mới</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Tên sách</label>
        <input
          v-model="book.tensach"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Tác giả</label>
        <input
          v-model="book.tacgia"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Nhà xuất bản</label>
        <select v-model="book.manxb" class="form-control" required>
          <option value="" disabled>Chọn nhà xuất bản</option>
          <option v-for="nxb in danhSachNXB" :key="nxb._id" :value="nxb._id">
            {{ nxb.tennxb }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Số quyển</label>
        <input
          v-model.number="book.soquyen"
          type="number"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Năm xuất bản</label>
        <input
          v-model.number="book.namxuatban"
          type="number"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Đơn giá</label>
        <input
          v-model.number="book.dongia"
          type="number"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Hình ảnh</label>
        <input type="file" class="form-control" @change="handleFileChange" />
        <img v-if="previewUrl" :src="previewUrl" class="preview-img mt-2" />
      </div>

      <button type="submit" class="btn-add" v-if="!isUploading">
        Thêm sách
      </button>
      <button type="button" class="btn-add" disabled v-else>
        <i class="fas fa-spinner fa-spin"></i> Đang tải lên...
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import SachService from "@/services/sach.service";
import UploadService from "@/services/upload.service";
import NhaxuatbanService from "@/services/nhaxuatban.service"; // Dịch vụ lấy nhà xuất bản từ API

const router = useRouter();

const book = ref({
  tensach: "",
  tacgia: "",
  manxb: "",
  soquyen: 0,
  namxuatban: new Date().getFullYear(),
  dongia: 0,
  imageUrl: "",
});

const danhSachNXB = ref([]); // Danh sách nhà xuất bản
const isUploading = ref(false); // Trạng thái tải ảnh
const selectedFile = ref(null); // Lưu trữ file ảnh đã chọn
const previewUrl = ref(null); // URL để hiển thị ảnh preview

// Lấy danh sách nhà xuất bản từ back end khi component mounted
onMounted(async () => {
  try {
    danhSachNXB.value = await NhaxuatbanService.getAll();
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
  }
});

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
};

const submitForm = async () => {
  if (!selectedFile.value) {
    alert("Vui lòng chọn hình ảnh cho sách!");
    return;
  }

  isUploading.value = true;
  try {
    const response = await UploadService.uploadImage(selectedFile.value);
    console.log("Upload image response:", response);
    console.log("Image URL:", response.imageUrl);
    book.value.imageUrl = response.imageUrl;

    await SachService.create(book.value);
    alert("Thêm sách thành công!");
    router.push("/admin/books");
  } catch (error) {
    console.error("Lỗi khi tạo sách:", error);
  } finally {
    isUploading.value = false;
    URL.revokeObjectURL(previewUrl.value);
  }
};
</script>

<style scoped>
.preview-img {
  max-width: 200px;
  border-radius: 5px;
}

.btn-add {
  background-color: #3498db;
  color: white;
  padding: 5px 15px;
}
</style>
