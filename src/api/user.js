import request from "./request";

const user = {
	findById(id) {
		return request.get(`/user/findById/${id}`);
	},
	login(data) {
		return request.post("/user/login", data);
	},
	checkNickName(nickName) {
		return request.post("/user/checkNickName", { nickName });
	},
	editUser(data) {
		return request.post(`/user/editUser`, data);
	},
	uploadUserPhoto(file) {
		let formData = new FormData();
		formData.append("user_photo", file);
		return request.post(`/user/uploadUserPhoto`, formData, { headers: { "Content-Type": "multipart/form-data" } });
	},
};
export default user;
