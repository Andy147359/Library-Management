<template>
  <div class="book-management">
    <div class="header-actions">
      <h1>Quản lý Sách</h1>
      <router-link to="/admin/add-book" class="btn-add">
        <i class="fas fa-plus"></i> Thêm sách mới
      </router-link>
    </div>

    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm sách..."
          @input="filterBooks"
        />
      </div>
      <div class="filter-author">
        <select v-model="filterAuthor" @change="filterBooks">
          <option value="">Tất cả tác giả</option>
          <option v-for="author in uniqueAuthors" :key="author" :value="author">
            {{ author }}
          </option>
        </select>
      </div>
    </div>

    <div class="book-table-container">
      <table class="book-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Nhà xuất bản</th>
            <th>Số quyển</th>
            <th>Năm xuất bản</th>
            <th>Đơn giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in filteredBooks" :key="book.id">
            <td>
              <img :src="book.imageUrl" alt="Book Image" class="book-image" />
            </td>
            <td>{{ book._id }}</td>
            <td>{{ book.tensach }}</td>
            <td>{{ book.tacgia }}</td>
            <td>{{ book.manxb }}</td>
            <td>{{ book.soquyen }}</td>
            <td>{{ book.namxuatban }}</td>
            <td>{{ book.dongia }}</td>
            <td class="actions">
              <button class="btn-edit" @click="editBook(book)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-delete" @click="deleteBook(book)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredBooks.length === 0">
            <td colspan="9" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import SachService from "@/services/sach.service";

const router = useRouter();
const allBooks = ref([]);
const searchQuery = ref("");
const filterAuthor = ref("");
const filteredBooks = ref([]);

// Danh sách tác giả duy nhất
const uniqueAuthors = computed(() => {
  return [...new Set(allBooks.value.map((book) => book.tacgia))];
});

// Lọc sách theo tìm kiếm (tên sách, tác giả, mã sách) và tác giả
const filterBooks = () => {
  filteredBooks.value = allBooks.value.filter((book) => {
    const matchSearch =
      book.tensach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.tacgia.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book._id.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchAuthor = filterAuthor.value
      ? book.tacgia === filterAuthor.value
      : true;

    return matchSearch && matchAuthor;
  });
};

// Chuyển đến trang chỉnh sửa sách
const editBook = (book) => {
  router.push(`/admin/edit-book/${book._id}`);
};

// Xóa sách
const deleteBook = async (book) => {
  try {
    await SachService.delete(book._id);
    allBooks.value = allBooks.value.filter((b) => b._id !== book._id);
    filterBooks();
  } catch (error) {
    console.error("Lỗi khi xóa sách:", error);
  }
};

// Lấy danh sách sách từ back end khi component mounted
const fetchBooks = async () => {
  try {
    const data = await SachService.getAll();
    allBooks.value = data.filter((book) => !book.deleted);
    filterBooks();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy sách:", error);
  }
};

// Khởi tạo
onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
.book-management {
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

.filter-author select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.book-table-container {
  overflow-x: auto;
}

.book-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.book-table th,
.book-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid black;
  box-sizing: border-box;
}

.book-table th {
  background-color: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
}

.book-table tr:hover {
  background-color: #f8f8f8;
}

.book-image {
  max-width: 50px;
  height: auto;
  border-radius: 5px;
}

.actions {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  text-align: center !important;
}

.btn-edit,
.btn-delete {
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  text-align: center;
}

.btn-edit {
  background-color: #3498db;
  color: white;
  margin-right: 5px;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}
</style>
