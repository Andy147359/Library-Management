<template>
  <div class="reader-management">
    <div class="header-actions">
      <h1>Quản lý Độc Giả</h1>
      <router-link to="/admin/add-reader" class="btn-add">
        <i class="fas fa-plus"></i> Thêm độc giả mới
      </router-link>
    </div>

    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm độc giả..."
          @input="filterReaders"
        />
      </div>
    </div>

    <div class="reader-table-container">
      <table class="reader-table">
        <thead>
          <tr>
            <th>Mã độc giả</th>
            <th>Họ và tên</th>
            <th>Ngày sinh</th>
            <th>Phái</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reader, index) in filteredReaders" :key="reader.id">
            <td>{{ reader._id }}</td>
            <td>{{ reader.hoLot }} {{ reader.ten }}</td>
            <td>{{ reader.ngaySinh }}</td>
            <td>{{ reader.phai }}</td>
            <td>{{ reader.diaChi }}</td>
            <td>{{ reader.dienThoai }}</td>
            <td class="actions">
              <button class="btn-edit" @click="editReader(reader)">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredReaders.length === 0">
            <td colspan="7" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import DocgiaService from "@/services/docgia.service";

const router = useRouter();
const allReaders = ref([]);
const searchQuery = ref("");
const filteredReaders = ref([]);

// Lọc độc giả theo tìm kiếm (họ lót, tên, mã độc giả)
const filterReaders = () => {
  filteredReaders.value = allReaders.value.filter((reader) => {
    const matchSearch =
      reader.hoLot.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      reader.ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      reader._id.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

// Chuyển đến trang chỉnh sửa độc giả
const editReader = (reader) => {
  router.push(`/admin/edit-reader/${reader._id}`);
};

// Lấy danh sách độc giả từ back end khi component mounted
const fetchReaders = async () => {
  try {
    const data = await DocgiaService.getAll();
    allReaders.value = data.filter((reader) => !reader.deleted);
    filterReaders();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy độc giả:", error);
  }
};

// Khởi tạo
onMounted(() => {
  fetchReaders();
});
</script>

<style scoped>
.reader-management {
  width: 100%;
  padding: 0 10px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-add {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.btn-add i {
  margin-right: 8px;
}

.search-filter {
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
}

.search-box {
  flex-grow: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.reader-table-container {
  overflow-x: auto;
}

.reader-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.reader-table th,
.reader-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid black;
  box-sizing: border-box;
}

.reader-table th {
  background-color: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
}

.reader-table tr:hover {
  background-color: #f8f8f8;
}

.actions {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  text-align: center !important;
}

.btn-edit {
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  text-align: center;
  background-color: #3498db;
  color: white;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}
</style>
