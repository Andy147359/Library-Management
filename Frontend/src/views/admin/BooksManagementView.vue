<template>
    <div class="book-management">
        <div class="header-actions">
            <h1>Quản lý Sách</h1>
            <router-link to="/admin/books/add" class="btn-add">
                <i class="fas fa-plus"></i> Thêm sách mới
            </router-link>
        </div>

        <div class="search-filter">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sách..." @input="filterBooks" />
            </div>
            <select v-model="filterCategory" @change="filterBooks">
                <option value="">Tất cả thể loại</option>
                <option value="Tiểu thuyết">Tiểu thuyết</option>
                <option value="Kỹ năng">Kỹ năng</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Lịch sử">Lịch sử</option>
                <option value="Giáo dục">Giáo dục</option>
            </select>
        </div>

        <div class="book-table-container">
            <table class="book-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã sách</th>
                        <th>Tên sách</th>
                        <th>Tác giả</th>
                        <th>Thể loại</th>
                        <th>Số lượng có sẵn</th>
                        <th>Số lượng sách</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(book, index) in filteredBooks" :key="book.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ book.code }}</td>
                        <td>{{ book.title }}</td>
                        <td>{{ book.author }}</td>
                        <td>{{ book.category }}</td>
                        <td>{{ book.available }}</td>
                        <td>{{ book.total }}</td>
                        <td class="actions">
                            <button class="btn-edit" @click="editBook(book)">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" @click="confirmDelete(book)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredBooks.length === 0">
                        <td colspan="8" class="no-data">Không có dữ liệu</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal xác nhận xóa -->
        <div class="modal" v-if="showDeleteModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Xác nhận xóa</h2>
                    <span class="close" @click="showDeleteModal = false">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Bạn có chắc chắn muốn xóa sách "<strong>{{ bookToDelete.title }}</strong>"?</p>
                    <p>Thao tác này không thể hoàn tác.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" @click="showDeleteModal = false">Hủy</button>
                    <button class="btn-confirm" @click="deleteBook">Xóa sách</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Dữ liệu cứng - Danh sách sách
const allBooks = ref([
    { id: 1, code: 'BOOK001', title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', category: 'Kỹ năng', available: 5, total: 10 },
    { id: 2, code: 'BOOK002', title: 'Nhà Giả Kim', author: 'Paulo Coelho', category: 'Tiểu thuyết', available: 3, total: 8 },
    { id: 3, code: 'BOOK003', title: 'Tư duy phản biện', author: 'Richard Paul', category: 'Giáo dục', available: 7, total: 15 },
    { id: 4, code: 'BOOK004', title: 'Sapiens: Lược sử loài người', author: 'Yuval Noah Harari', category: 'Lịch sử', available: 2, total: 5 },
    { id: 5, code: 'BOOK005', title: 'Đọc Vị Bất Kỳ Ai', author: 'David J. Lieberman', category: 'Kỹ năng', available: 6, total: 12 },
    { id: 6, code: 'BOOK006', title: 'Tiếng Gọi Nơi Hoang Dã', author: 'Jack London', category: 'Tiểu thuyết', available: 4, total: 7 },
]);

// State cho tìm kiếm và lọc
const searchQuery = ref('');
const filterCategory = ref('');
const filteredBooks = ref([...allBooks.value]);

// State cho modal xóa
const showDeleteModal = ref(false);
const bookToDelete = ref(null);

// Lọc sách theo tìm kiếm (tên sách, tác giả, mã sách) và thể loại
const filterBooks = () => {
    filteredBooks.value = allBooks.value.filter(book => {
        const matchSearch =
            book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            book.code.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchCategory = filterCategory.value ? book.category === filterCategory.value : true;

        return matchSearch && matchCategory;
    });
};

// Chuyển đến trang chỉnh sửa sách
const editBook = (book) => {
    router.push(`/admin/books/edit/${book.id}`);
};

// Hiện modal xác nhận xóa
const confirmDelete = (book) => {
    bookToDelete.value = book;
    showDeleteModal.value = true;
};

// Xóa sách
const deleteBook = () => {
    allBooks.value = allBooks.value.filter(book => book.id !== bookToDelete.value.id);
    filteredBooks.value = filteredBooks.value.filter(book => book.id !== bookToDelete.value.id);
    showDeleteModal.value = false;
};

// Khởi tạo
onMounted(() => {
    filterBooks();
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

select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-width: 150px;
}

.book-table-container {
    overflow-x: auto;
}

.book-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.book-table th,
.book-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.book-table th {
    background-color: #f5f7fa;
    color: #2c3e50;
    font-weight: 600;
}

.book-table tr:hover {
    background-color: #f8f8f8;
}

.actions {
    display: flex;
    gap: 8px;
}

.btn-edit,
.btn-delete {
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
}

.btn-edit {
    background-color: #3498db;
    color: white;
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