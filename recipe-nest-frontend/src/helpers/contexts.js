import { createContext } from "react";

export const UserContext = createContext({
	data: null,
	setData: () => {console.error("Used setUserContext data without initilising")},
	isLoading: false
});