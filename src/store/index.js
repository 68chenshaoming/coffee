import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
export default createStore({
	state: {
		token: null,
		userInfo: null,
		birthday: null,
		addressInfo: null,
		currentAddress: null,
		type: 0,
	},
	getters: {},
	mutations: {
		setInfo(state, userInfo) {
			state.userInfo = userInfo;
		},
		setToken(state, token) {
			state.token = token;
		},
		setBirthday(state, birthday) {
			state.birthday = birthday;
		},
		setAddressInfo(state, addressInfo) {
			state.addressInfo = addressInfo;
		},
		setCurrentAddress(state, currentAddress) {
			state.currentAddress = currentAddress;
		},
		setType(state, type) {
			state.type = type;
		},
	},
	actions: {},
	modules: {},
	plugins: [
		createPersistedState({
			paths: ["token", "userInfo", "birthday", "type", "currentAddress"],
			storage: sessionStorage,
		}),
	],
});
