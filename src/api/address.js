import request from "./request";

const address = {
	findByDefault() {
		return request.get("/address/findByDefault");
	},
	findByUid() {
		return request.get("/address/findByUid");
	},
	setDefault(id) {
		return request.get("/address/setDefault/" + id);
	},
	add(data) {
		return request.post("/address/add", data);
	},
	edit(id, data) {
		return request.post("/address/edit/" + id, data);
	},
	delete(id) {
		return request.get("/address/delete/" + id);
	},
	findById(id) {
		return request.get("/address/findById/" + id);
	},
};

export default address;
