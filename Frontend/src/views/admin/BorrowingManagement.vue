<template>
  <div class="borrowing-management">
    <h1>Quản lý Mượn Sách</h1>
    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm lịch sử mượn sách..."
          @input="filterBorrowings"
        />
      </div>
    </div>
    <div class="borrowing-table-container">
      <table class="borrowing-table">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Mã độc giả</th>
            <th>Tên độc giả</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(borrowing, index) in filteredBorrowings"
            :key="borrowing._id"
          >
            <td>{{ borrowing.maSach }}</td>
            <td>{{ borrowing.tenSach }}</td>
            <td>{{ borrowing.maDocGia }}</td>
            <td>{{ borrowing.tenDocGia }}</td>
            <td>{{ formatDate(borrowing.ngayMuon) }}</td>
            <td>{{ formatDate(borrowing.ngayTra) }}</td>
            <td>
              <select
                v-model="borrowing.status"
                @change="updateStatus(borrowing)"
              >
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
                <option value="Chờ lấy sách">Chờ lấy sách</option>
              </select>
            </td>
          </tr>
          <tr v-if="filteredBorrowings.length === 0">
            <td colspan="8" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MuonService from "@/services/muon.service";
import DocgiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";

const borrowings = ref([]);
const searchQuery = ref("");
const filteredBorrowings = ref([]);

const fetchBorrowings = async () => {
  try {
    const allBorrowings = await MuonService.getAll();
    for (const borrowing of allBorrowings) {
      const book = await SachService.get(borrowing.maSach);
      const reader = await DocgiaService.get(borrowing.maDocGia);
      borrowing.tenSach = book.tensach;
      borrowing.tenDocGia = reader.hoLot + " " + reader.ten;
    }
    borrowings.value = allBorrowings;
    filterBorrowings();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy lịch sử mượn sách:", error);
  }
};

const filterBorrowings = () => {
  filteredBorrowings.value = borrowings.value.filter((borrowing) => {
    const matchSearch =
      borrowing.tenSach
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      borrowing.maSach
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      borrowing.tenDocGia
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      borrowing.maDocGia
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

// Cập nhật trạng thái mượn sách
const updateStatus = async (borrowing) => {
  try {
    const response = await MuonService.update(borrowing._id, {
      status: borrowing.status,
      maDocGia: borrowing.maDocGia,
      maSach: borrowing.maSach,
    });

    console.log("Cập nhật trạng thái thành công:", response);
    if (response.status === "Đã trả") {
      const book = await SachService.get(borrowing.maSach);
      await SachService.update(borrowing.maSach, { soquyen: book.soquyen + 1 });
    }
    alert("Cập nhật trạng thái thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    alert("Lỗi khi cập nhật trạng thái. Vui lòng thử lại sau.");
  }
};

// Khởi tạo
onMounted(async () => {
  await fetchBorrowings();
});

const formatDate = (dateString) => {
  if (!dateString) return "Chưa trả";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};
</script>

<style scoped>
.borrowing-management {
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

.borrowing-table-container {
  overflow-x: auto;
}

.borrowing-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.borrowing-table th,
.borrowing-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid black;
  box-sizing: border-box;
}

.borrowing-table th {
  background-color: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
}

.borrowing-table tr:hover {
  background-color: #f8f8f8;
}

.actions {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.btn-update {
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
