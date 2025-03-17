<template>
    <div class="admin-layout">
        <!-- Thanh điều hướng bên trái -->
        <div class="sidebar">
            <div class="logo">
                <h2>Quản lý Thư viện</h2>
            </div>
            <div class="nav-links">
                <router-link to="/admin/books" custom v-slot="{ isActive, navigate }">
                    <div class="nav-item" :class="{ active: isActive }" @click="navigate">
                        <i class="fas fa-book"></i>
                        <span>Quản lý Sách</span>
                    </div>
                </router-link>

                <router-link to="/admin/borrowing" custom v-slot="{ isActive, navigate }">
                    <div class="nav-item" :class="{ active: isActive }" @click="navigate">
                        <i class="fas fa-exchange-alt"></i>
                        <span>Quản lý Mượn Sách</span>
                    </div>
                </router-link>

                <router-link to="/admin/readers" custom v-slot="{ isActive, navigate }">
                    <div class="nav-item" :class="{ active: isActive }" @click="navigate">
                        <i class="fas fa-users"></i>
                        <span>Quản lý Độc Giả</span>
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
import { useRouter } from 'vue-router';

const router = useRouter();

// Xử lý đăng xuất
const handleLogout = () => {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem('userRole');
    // Chuyển hướng đến trang đăng nhập hoặc trang chính
    router.push('/');
};
</script>

<style scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
    font-family: 'Roboto', sans-serif;
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
    display: flex;
    align-items: center;
}

.user-info span {
    margin-right: 10px;
}

.avatar {
    width: 35px;
    height: 35px;
    background-color: #3498db;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
}

.content-area {
    padding: 20px;
}
</style>