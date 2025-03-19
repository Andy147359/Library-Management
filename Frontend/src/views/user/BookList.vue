<template>
  <div class="book-management">
    <h1>Danh sách Sách</h1>
    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm sách... (ID, Tên sách, Tên tác giả)"
          @input="filterBooks"
        />
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
          <tr v-for="(book, index) in filteredBooks" :key="book._id">
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
              <button class="btn-borrow" @click="borrowBook(book)">
                Đăng ký mượn
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
import { ref, onMounted } from "vue";
import SachService from "@/services/sach.service";
import MuonService from "@/services/muon.service";

const books = ref([]);
const searchQuery = ref("");
const filteredBooks = ref([]);

const fetchBooks = async () => {
  try {
    const data = await SachService.getAll();
    books.value = data.filter((book) => !book.deleted);
    filterBooks();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy sách:", error);
  }
};

const filterBooks = () => {
  filteredBooks.value = books.value.filter((book) => {
    const matchSearch =
      book.tensach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.tacgia.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book._id.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

const borrowBook = async (book) => {
  try {
    const userId = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage
    if (!userId) {
      alert("Vui lòng đăng nhập để mượn sách.");
      return;
    }

    if (book.soquyen === 0) {
      alert("Sách này đã hết!");
      return;
    }

    const borrowData = {
      maDocGia: userId,
      maSach: book._id,
      ngayTra: null,
      status: "Chờ lấy sách",
    };
    console.log("Đăng ký mượn sách:", borrowData);

    await MuonService.create(borrowData);
    alert(`Đăng ký mượn sách: ${book.tensach} thành công!`);
    fetchBooks();
  } catch (error) {
    console.error("Lỗi khi mượn sách:", error);
    alert("Đăng ký mượn sách thất bại!");
  }
};

onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
.book-management {
  width: 100%;
  padding: 0 10px;
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
}

.btn-borrow {
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
