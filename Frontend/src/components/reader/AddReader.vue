<template>
  <div class="container mt-4">
    <h2>Thêm Độc Giả</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Họ lót</label>
        <input
          v-model="reader.hoLot"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Tên</label>
        <input v-model="reader.ten" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Ngày sinh</label>
        <input
          v-model="reader.ngaySinh"
          type="date"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Phái</label>
        <select v-model="reader.phai" class="form-control" required>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <input
          v-model="reader.diaChi"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Điện thoại</label>
        <input
          v-model="reader.dienThoai"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input
          v-model="reader.password"
          type="password"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn-add">Thêm độc giả</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DocgiaService from "@/services/docgia.service";

const router = useRouter();

const reader = ref({
  hoLot: "",
  ten: "",
  ngaySinh: "",
  phai: "Nam",
  diaChi: "",
  dienThoai: "",
  password: "",
});

const submitForm = async () => {
  try {
    await DocgiaService.create(reader.value);
    alert("Thêm độc giả thành công!");
    router.push("/admin/readers");
  } catch (error) {
    console.error("Lỗi khi tạo độc giả:", error);
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.btn-add {
  background-color: #3498db;
  color: white;
  padding: 5px 15px;
}
</style>
