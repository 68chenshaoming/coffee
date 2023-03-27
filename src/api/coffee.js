import request from "./request";

const coffee = {
	getRecommendGoods: () => {
		return request.get(`/food/getRecommendGoods`);
	},
	findByCateId: id => {
		return request.get(`/category/findByCateId/${id}`);
	},
	findById: id => {
		return request.get(`/food/find/${id}`);
	},
	getPopularity: () => {
		return request.get(`/food/popularity`);
	},
};
export default coffee;
