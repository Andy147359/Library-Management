<template>
  <div class="borrowing-history">
    <h1>Lịch sử Mượn Sách</h1>
    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm lịch sử mượn sách..."
          @input="filterHistory"
        />
      </div>
    </div>
    <div class="history-table-container">
      <table class="history-table">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in filteredHistory" :key="record._id">
            <td>{{ record.maSach }}</td>
            <td>{{ record.tenSach }}</td>
            <td>{{ formatDate(record.ngayMuon) }}</td>
            <td>{{ formatDate(record.ngayTra) }}</td>
            <td>{{ record.status }}</td>
            <td class="actions">
              <button
                v-if="record.status === 'Chờ lấy sách'"
                class="btn-cancel"
                @click="cancelBorrowing(record._id, record.maSach)"
              >
                Hủy
              </button>
            </td>
          </tr>
          <tr v-if="filteredHistory.length === 0">
            <td colspan="6" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MuonService from "@/services/muon.service";
import SachService from "@/services/sach.service";

const borrowingHistory = ref([]);
const searchQuery = ref("");
const filteredHistory = ref([]);

const fetchBorrowingHistory = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Vui lòng đăng nhập để xem lịch sử mượn sách.");
      return;
    }

    const allBorrowings = await MuonService.getAll();
    console.log(allBorrowings);
    const userBorrowings = allBorrowings.filter(
      (record) => record.maDocGia === userId
    );

    // Fetch book details for each borrowing record
    for (const record of userBorrowings) {
      const book = await SachService.get(record.maSach);
      record.tenSach = book.tensach;
    }

    borrowingHistory.value = userBorrowings;
    filterHistory();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy lịch sử mượn sách:", error);
  }
};

const filterHistory = () => {
  filteredHistory.value = borrowingHistory.value.filter((record) => {
    const matchSearch =
      record.tenSach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      record.maSach.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

const cancelBorrowing = async (borrowId, bookId) => {
  try {
    await MuonService.delete(borrowId);
    const book = await SachService.get(bookId);
    await SachService.update(bookId, { soquyen: book.soquyen + 1 });

    alert("Hủy mượn sách thành công!");
    fetchBorrowingHistory();
  } catch (error) {
    console.error("Lỗi khi hủy mượn sách:", error);
    alert("Hủy mượn sách thất bại!");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa trả";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

onMounted(() => {
  fetchBorrowingHistory();
});
</script>

<style scoped>
.borrowing-history {
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

.history-table-container {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.history-table th,
.history-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid black;
  box-sizing: border-box;
}

.history-table th {
  background-color: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
}

.history-table tr:hover {
  background-color: #f8f8f8;
}

.actions {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.btn-cancel {
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  text-align: center;
  background-color: #e74c3c;
  color: white;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}
</style>
