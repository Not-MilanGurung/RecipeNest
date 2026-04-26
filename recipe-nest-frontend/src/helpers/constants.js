// export const BACKEND_API_URL="http://localhost:3000";
// export const BACKEND_API_URL="https://recipenest-yp4b.onrender.com";
export const BACKEND_API_URL= import.meta.env.VITE_BACKEND_API_URL;

export const apiLoginRoute= `/users/login`
export const apiRegisterRoute= `/users/register`
export const apiRefreshTokenRoute= `/users/refresh`
export const apiLogoutRoute = '/users/logout'
	
export const apiGetProfileRoute= `/users/profile`
export const apiUploadProfilePicRoute= `/users/profile/pic`

export const apiPortfolioRoute = (id) => `/users/${id}/portfolio`;
export const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];


export const roles = {
	FOODIE: 'foodie',
	CHEF: 'chef',
}

export const apiRecipeCreateRoute = `/recipes/`;
export const apiGetRecipes = '/recipes';
export const apiGetRecipeById = (id) => `/recipes/${id}`;