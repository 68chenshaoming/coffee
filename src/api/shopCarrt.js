import request from "./request";

const shopCart = {
	findAllByUid() {
		return request.get("/shopCart/findAllByUid");
	},

	add(data) {
		return request.post("/shopCart/add", data);
	},
	findByUid(pageIndex) {
		return request.get(`/shopCart/findByUid/${pageIndex}`);
	},

	edit(id, count) {
		return request.post(`shopCart/edit/${id}`, { count });
	},
	delete(id) {
		return request.get(`shopCart/delete/${id}`);
	},
	setDefault(ids) {
		return request.post(`/shopCart/setDefault`, ids);
	},
};
export default shopCart;
