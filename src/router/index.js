import { createRouter, createWebHistory } from "vue-router";
import { showToast } from "vant";
import store from "@/store";
const routes = [
	{
		path: "/",
		name: "/",
		redirect: "/main/home",
	},
	{
		path: "/main",
		name: "main",
		component: () => import("../views/Main.vue"),
		children: [
			{
				path: "home",
				name: "home",
				component: () => import("../views/Home.vue"),
			},
			{
				path: "menu",
				name: "menu",
				component: () => import("../views/Menu.vue"),
				meta: {
					hasLogin: true,
				},
			},
			{
				path: "order",
				name: "order",
				component: () => import("../views/Order.vue"),
				meta: {
					hasLogin: true,
				},
			},

			{
				path: "my",
				name: "my",
				component: () => import("../views/My.vue"),
			},
		],
	},
	{
		path: "/login",
		name: "login",
		component: () => import("../views/Login.vue"),
		meta: {
			index: 1,
		},
	},
	{
		path: "/register",
		name: "register",
		component: () => import("../views/Register.vue"),
		meta: {
			index: 2,
		},
	},
	{
		path: "/editUserInfo/:id",
		name: "editUserInfo",
		component: () => import("../views/EditUserInfo.vue"),
		meta: {
			index: 2,
		},
	},
	{
		path: "/checkOrder",
		name: "checkOrder",
		component: () => import("../views/CheckOrder.vue"),
		meta: {
			index: 2,
		},
		beforeEnter: (to, from, next) => {
			// ...1
			if (from.path == "/orderDetail") {
				router.push({ name: "menu" });
			}
			next();
		},
	},
	{
		path: "/address",
		name: "address",
		component: () => import("../views/Address.vue"),
		meta: {
			index: 2,
		},
	},
	{
		path: "/addAddress",
		name: "addAddress",
		component: () => import("../views/AddAddress.vue"),
		meta: {
			index: 3,
		},
	},
	{
		path: "/editAddress",
		name: "editAddress",
		component: () => import("../views/EditAddress.vue"),
		meta: {
			index: 3,
		},
	},
	{
		path: "/orderDetail",
		name: "orderDetail",
		component: () => import("../views/OrderDetail.vue"),
		meta: {
			index: 4,
		},
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from) => {
	if (to.meta.hasLogin === true) {
		if (!store.state.token) {
			showToast("请登录。。。");
			return (to.path = { name: "login", query: { redirect: to.fullPath } });
		}
	}
});

export default router;
