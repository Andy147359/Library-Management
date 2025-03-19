<template>
  <div class="user-layout">
    <!-- Thanh điều hướng bên trái -->
    <div class="sidebar">
      <div class="logo">
        <h2>Thư viện</h2>
      </div>
      <div class="user-info">
        Độc giả:
        <div>{{ user.hoLot + " " + user.ten }}</div>
      </div>
      <div class="nav-links">
        <router-link to="/user/books" custom v-slot="{ isActive, navigate }">
          <div class="nav-item" :class="{ active: isActive }" @click="navigate">
            <i class="fas fa-book"></i>
            <span>Danh sách Sách</span>
          </div>
        </router-link>

        <router-link
          to="/user/borrow-history"
          custom
          v-slot="{ isActive, navigate }"
        >
          <div class="nav-item" :class="{ active: isActive }" @click="navigate">
            <i class="fas fa-history"></i>
            <span>Lịch sử Mượn Sách</span>
          </div>
        </router-link>
      </div>
      <div class="sidebar-footer">
        <div class="nav-item" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>

    <!-- Nội dung chính -->
    <div class="main-content">
      <div class="content-area">
        <!-- Sử dụng router-view để hiển thị các trang con -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const user = ref({
  hoLot: localStorage.getItem("hoLot"),
  ten: localStorage.getItem("ten"),
});

// Xử lý đăng xuất
const handleLogout = () => {
  // Xóa thông tin đăng nhập khỏi localStorage
  localStorage.setItem("userRole", "");
  localStorage.setItem("hoLot", "");
  localStorage.setItem("ten", "");
  // Chuyển hướng đến trang đăng nhập hoặc trang chính
  router.push("/user-login");
};
</script>

<style scoped>
.user-layout {
  display: flex;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
}

.logo {
  padding: 20px;
  border-bottom: 1px solid #34495e;
  text-align: center;
  font-weight: bold;
}

.logo h2 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  flex-grow: 1;
  padding: 20px 0;
}

.nav-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #34495e;
}

.nav-item.active {
  background-color: #3498db;
}

.nav-item i {
  margin-right: 12px;
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  border-top: 1px solid #34495e;
  padding-bottom: 20px;
}

.main-content {
  flex-grow: 1;
  margin-left: 250px;
  background-color: #f5f5f5;
}

.header {
  background-color: #ffffff;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-info {
  text-align: center;
  border-top: 1px solid #5c738a;
  border-bottom: 1px solid #5c738a;
  padding: 10px;
}

.content-area {
  padding: 20px;
}
</style>
