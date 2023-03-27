import request from "./request";

const category = {
	findAll: () => {
		return request.get(`category/findAll`);
	},
};
export default category;
