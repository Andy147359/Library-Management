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
                redirect: "/admin/books" // test
            },
            {
                path: "books",
                component: () => import("@/views/admin/BooksManagementView.vue"),
                meta: { roles: ["admin"] },
            },
            {
                path: "add-book",
                component: () => import("@/components/AddBook.vue"),
                meta: { roles: ["admin"] }
            },
            {
                path: "borrowing",
                component: () => import("@/views/admin/BorrowingManagementView.vue"),
                meta: { roles: ["admin"] },
            },
            {
                path: "readers",
                component: () => import("@/views/admin/ReadersManagementView.vue"),
                meta: { roles: ["admin"] },
            }
        ]
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