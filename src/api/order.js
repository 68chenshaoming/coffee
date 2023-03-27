import request from "./request";

const orderInfo = {
	add(data) {
		return request.post("/order/add", data);
	},
	findByUid(pageIndex) {
		return request.get("/order/findByUid", {
			params: { pageIndex },
		});
	},
	pay(id) {
		return request.get("/order/pay/" + id);
	},
	delete(id) {
		return request.get("/order/delete/" + id);
	},
};

export default orderInfo;
