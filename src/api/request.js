import axios from "axios";
import { closeToast, showFailToast } from "vant";
import store from "@/store";
const request = axios.create({
	baseURL: "http://127.0.0.1:3000/v1",
	timeout: 5000,
});

request.interceptors.request.use(config => {
	if (store.state.token) {
		config.headers["softeem_token"] = store.state.token;
	}
	return config;
});
request.interceptors.response.use(
	resp => {
		if (resp.data.status == "success") {
			return Promise.resolve(resp.data.data);
		} else {
			return Promise.resolve(resp.data);
		}
	},
	error => {
		closeToast();
		showFailToast("请求错误");
		return Promise.reject(error);
	}
);

export default request;
