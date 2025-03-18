<template>
  <div class="borrowing-management">
    <div class="header-actions">
      <h1>Quản lý Mượn Sách</h1>
      <!-- <router-link to="/admin/add-borrowing" class="btn-add">
        <i class="fas fa-plus"></i> Thêm mượn sách mới
      </router-link> -->
    </div>

    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm mượn sách... (ID, Tên độc giả, Tên sách)"
          @input="filterBorrowings"
        />
      </div>
    </div>

    <div class="borrowing-table-container">
      <table class="borrowing-table">
        <thead>
          <tr>
            <th>Mã mượn</th>
            <th>Tên độc giả</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(borrowing, index) in filteredBorrowings"
            :key="borrowing.id"
          >
            <td>{{ borrowing._id }}</td>
            <td>{{ borrowing.docGiaName }}</td>
            <td>{{ borrowing.sachName }}</td>
            <td>{{ borrowing.ngayMuon }}</td>
            <td>{{ borrowing.ngayTra }}</td>
            <td>
              <select
                v-model="borrowing.status"
                @change="updateStatus(borrowing)"
              >
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
                <option value="Chờ lấy">Chờ lấy</option>
              </select>
            </td>
          </tr>
          <tr v-if="filteredBorrowings.length === 0">
            <td colspan="6" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import MuonService from "@/services/muon.service";
import DocgiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";

const router = useRouter();
const allBorrowings = ref([]);
const readersMap = ref({});
const booksMap = ref({});

const fetchReadersAndBooks = async () => {
  try {
    const readers = await DocgiaService.getAll();
    readers.forEach((reader) => {
      readersMap.value[reader._id] = `${reader.hoLot} ${reader.ten}`;
    });

    const books = await SachService.getAll();
    books.forEach((book) => {
      booksMap.value[book._id] = book.tenSach;
    });
  } catch (error) {
    console.error("Lỗi khi gọi API lấy độc giả hoặc sách:", error);
    alert("Lỗi khi tải dữ liệu độc giả hoặc sách. Vui lòng thử lại sau.");
  }
};

const fetchBorrowings = async () => {
  try {
    const data = await MuonService.getAll();
    allBorrowings.value = data.map((borrowing) => ({
      ...borrowing,
      docGiaName: readersMap.value[borrowing.maDocGia] || "Không xác định",
      sachName: booksMap.value[borrowing.maSach] || "Không xác định",
    }));
    filterBorrowings();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy mượn sách:", error);
    alert("Lỗi khi tải dữ liệu mượn sách. Vui lòng thử lại sau.");
  }
};

// State cho tìm kiếm và lọc
const searchQuery = ref("");
const filteredBorrowings = ref([]);

// Lọc mượn sách theo tìm kiếm (tên độc giả, tên sách)
const filterBorrowings = () => {
  filteredBorrowings.value = allBorrowings.value.filter((borrowing) => {
    const matchSearch =
      borrowing.docGiaName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      borrowing.sachName
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      borrowing._id.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

// Cập nhật trạng thái mượn sách
const updateStatus = async (borrowing) => {
  try {
    await MuonService.update(borrowing._id, { status: borrowing.status });
    alert("Cập nhật trạng thái thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    alert("Lỗi khi cập nhật trạng thái. Vui lòng thử lại sau.");
  }
};

// Khởi tạo
onMounted(async () => {
  await fetchReadersAndBooks();
  fetchBorrowings();
});
</script>

<style scoped>
.borrowing-management {
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

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 5px;
  width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.close {
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-top: 1px solid #e0e0e0;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.btn-confirm {
  background-color: #e74c3c;
  color: white;
}
</style>
