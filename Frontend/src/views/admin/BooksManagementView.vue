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
                <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sách..." @input="filterBooks" />
            </div>
            <select v-model="filterAuthor" @change="filterBooks">
                <option value="">Tất cả tác giả</option>
                <option v-for="author in uniqueAuthors" :key="author" :value="author">
                    {{ author }}
                </option>
            </select>
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
                        <th>Số lượng sách</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(book, index) in filteredBooks" :key="book.id">
                        <td>
                            <img :src="book.imageUrl" class="bookImage" />
                        </td>
                        <td>{{ book._id }}</td>
                        <td>{{ book.tensach }}</td>
                        <td>{{ book.tacgia }}</td>
                        <td>{{ book.nhaxuatban.tennxb }}</td>
                        <td>{{ book.soquyen }}</td>
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SachService from "@/services/sach.service";

const router = useRouter();
const allBooks = ref([]);

const fetchBooks = async () => {
    try {
        const data = await SachService.getAll();
        allBooks.value = data;
        filterBooks();
    } catch (error) {
        console.error("Lỗi khi gọi API lấy sách:", error);
        alert("Lỗi khi tải dữ liệu sách. Vui lòng thử lại sau.");
    }
};

// State cho tìm kiếm và lọc
const searchQuery = ref('');
const filterAuthor = ref('');
const filteredBooks = ref([]);

// Danh sách tác giả duy nhất
const uniqueAuthors = computed(() => {
    return [...new Set(allBooks.value.map(book => book.tacgia))];
});

// Lọc sách theo tìm kiếm (tên sách, tác giả, mã sách) và tác giả
const filterBooks = () => {
    filteredBooks.value = allBooks.value.filter(book => {
        const matchSearch =
            book.tensach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            book.tacgia.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            book._id.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchAuthor = filterAuthor.value ? book.tacgia === filterAuthor.value : true;

        return matchSearch && matchAuthor;
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
}

.book-table th,
.book-table td {
    padding: 12px 15px;
    text-align: left;
    /* border-bottom: 1px solid #eee; */
    border: 1px solid black;
    box-sizing: border-box;
    /* Đảm bảo padding và border không làm thay đổi kích thước */

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
    margin-right: 5px
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

.bookImage {
    width: 60px;
    height: 100px;
    object-fit: cover;
}
</style>