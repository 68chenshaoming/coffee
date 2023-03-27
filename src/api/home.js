import request from "./request";

const homeInfo = {
	get: () => {
		return request.get(`/home/get`);
	},
};
export default homeInfo;
