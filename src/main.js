import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/font/iconfont.css";
import "@/assets/css/reset.css";
import { Lazyload } from "vant";
import PageView from "@/components/PageView.vue";
import PageHeader from "@/components/PageHeader.vue";
const app = createApp(App);

// Toast
import "vant/es/toast/style";

// Dialog
import "vant/es/dialog/style";

// Notify
import "vant/es/notify/style";

// ImagePreview
import "vant/es/image-preview/style";

app.component("page-view", PageView);
app.component("page-header", PageHeader);
app.use(Lazyload, {
	lazyComponent: true,
	loading: require("./assets/image/loading.gif"),
});
app.use(store).use(router).mount("#app");
