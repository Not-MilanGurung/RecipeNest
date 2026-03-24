export const BACKEND_API_URL="http://localhost:3000";

export const apiLoginRoute= {
		url: `${BACKEND_API_URL}/users/login`,
		method: 'post'
	};
export const apiRegisterRoute= { 
		url:`${BACKEND_API_URL}/users/register`,
		method: 'post'
	};
export const apiRefreshTokenRoute= {
		url: `${BACKEND_API_URL}/users/refresh`,
		method: 'post'
	};
export const apiGetProfileRoute= {
		url: `${BACKEND_API_URL}/users/profile`,
		method: 'get'
	};
export const apiIploadProfilePicRoute= {
		url: `${BACKEND_API_URL}/users/profile/pic`,
		method: 'put'
	};
