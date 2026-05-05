import { createContext } from "react";
import type {SetStateAction, Dispatch} from 'react';
export type UserContextData = {
	user: {
		_id: string,
		name: string,
		email: string,
		role: string,
    avatar: string | undefined
	},
	accessToken: string
}

const setData: Dispatch<SetStateAction<UserContextData|null>> = () => {
	console.error("Used setUserContext data without initilising");
}

const setIsLoading: Dispatch<SetStateAction<boolean>> = () => {
	console.error("Used setIsLoadin without initalising");
}

export type UserContextType = {
	data: UserContextData | null,
	setData: Dispatch<SetStateAction<UserContextData|null>>,
	isLoading: boolean,
	setIsLoading: Dispatch<SetStateAction<boolean>>
}

export const UserContext = createContext<UserContextType>({
	data: null as UserContextData | null,
	setData: setData,
	isLoading: false,
	setIsLoading: setIsLoading
});