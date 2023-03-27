import request from "./request";

const bannerInfo = {
	get: () => {
		return request.get(`/banner/get`);
	},
};
export default bannerInfo;
