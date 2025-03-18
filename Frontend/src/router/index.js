import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "", // Mặc định sẽ chuyển hướng đến trang user
        redirect: "/user"
    },
    {
        path: "/user",
        component: () => import("@/views/user/UserView.vue"),
        meta: { roles: ["user", "admin", ""] },
    },
    {
        path: "/admin",
        component: () => import("@/views/admin/AdminView.vue"),
        meta: { roles: ["admin"] },
        children: [
            {
                path: "",
                redirect: "/admin/books"
            },
            {
                path: "books",
                component: () => import("@/views/admin/BooksManagementView.vue"),
                meta: { roles: ["admin"] },
            },
            {
                path: "add-book",
                component: () => import("@/components/book/AddBook.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "edit-book/:id",
                component: () => import("@/components/book/EditBook.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "borrowing",
                component: () => import("@/views/admin/BorrowingManagementView.vue"),
                meta: { roles: ["admin"] },
            },
            {
                path: "add-borrowing",
                component: () => import("@/components/borrow/AddBorrow.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "readers",
                component: () => import("@/views/admin/ReadersManagementView.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "add-reader",
                component: () => import("@/components/reader/AddReader.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "edit-reader/:id",
                component: () => import("@/components/reader/EditReader.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "publishers",
                component: () => import("@/views/admin/PublisherManagementView.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "edit-publisher/:id",
                component: () => import("@/components/publisher/EditPublisher.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "add-publisher",
                component: () => import("@/components/publisher/AddPublisher.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "employees",
                component: () => import("@/views/admin/EmployeeManagementView.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "add-employee",
                component: () => import("@/components/employee/AddEmployee.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "edit-employee/:id",
                component: () => import("@/components/employee/EditEmployee.vue"),
                meta: { roles: ["admin"] }
            }
        ]
    },
    {
        path: "/user-login",
        component: () => import("@/views/auth/UserLogin.vue"),
        meta: { roles: [""] },
    },
    {
        path: "/admin-login",
        component: () => import("@/views/auth/AdminLogin.vue"),
        meta: { roles: [""] },
    },
    {
        path: "/not-authorized",
        component: () => import("@/views/NotAuthorized.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/views/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    // Lấy vai trò người dùng từ localstorage
    const userRole = localStorage.getItem("userRole");

    // Kiểm tra nếu route yêu cầu roles và người dùng không có vai trò phù hợp
    if (to.meta.roles?.includes(userRole) === false) {
        next("/not-authorized");
    } else {
        next();
    }
});

export default router;