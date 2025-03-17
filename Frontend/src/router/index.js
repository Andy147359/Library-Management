import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "", // Mặc định sẽ chuyển hướng đến trang user
        redirect: "/user"
    },
    {
        path: "/user",
        name: "User",
        component: () => import("@/views/user/UserView.vue"),
        meta: { roles: ["user", "admin", ""] },
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("@/views/admin/AdminView.vue"),
        meta: { roles: ["admin"] },
        children: [
            {
                path: "", // Mặc định sẽ chuyển hướng đến trang quản lý sách
                redirect: "/admin/books"
            },
            {
                path: "books",
                name: "AdminBooks",
                component: () => import("@/views/admin/BooksManagementView.vue"),
                meta: { roles: ["admin"] },
            },
            {
                path: "borrowing",
                name: "AdminBorrowing",
                component: () => import("@/views/admin/BorrowingManagementView.vue"),
                meta: { roles: ["admin"] },
            },
            {
                path: "readers",
                name: "AdminReaders",
                component: () => import("@/views/admin/ReadersManagementView.vue"),
                meta: { roles: ["admin"] },
            }
        ]
    },
    {
        path: "/not-authorized",
        name: "NotAuthorized",
        component: () => import("@/views/NotAuthorized.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "Notfound",
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