<template>
  <div class="login-container">
    <h2>Đăng Nhập Quản Trị</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input
          v-model="phoneNumber"
          type="text"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn-login">Đăng Nhập</button>
    </form>
    <button class="btn-switch" @click="switchToUserLogin">
      Đăng nhập người dùng
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NhanVienService from "@/services/nhanvien.service";

const router = useRouter();
const phoneNumber = ref("");
const password = ref("");

const submitForm = async () => {
  try {
    const response = await NhanVienService.login(
      phoneNumber.value,
      password.value
    );
    console.log("Đăng nhập thành công:", response);
    alert("Đăng nhập thành công!");
    localStorage.setItem("chucvu", response?.chucvu);
    localStorage.setItem("hotennv", response?.hotennv);
    localStorage.setItem("userRole", "admin");
    router.push("/admin");
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    alert("Đăng nhập thất bại!");
  }
};

const switchToUserLogin = () => {
  router.push("/user-login");
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top: 10%;
}

.btn-login {
  background-color: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

.btn-switch {
  background-color: #2ecc71;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}
</style>
