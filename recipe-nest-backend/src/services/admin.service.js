const { User, userRoles } = require('../models/user.model');
const Recipe = require('../models/recipe.model');
const { get: getRecipes } = require('../services/recipe.service');

const stats = async () => {
	const chefCount = await User.countDocuments({ role: userRoles.values.CHEF });
	const foodieCount = await User.countDocuments({ role: userRoles.values.FOODIE });
	const recipeCount = await Recipe.countDocuments();
	const { page = 1, limit = 10, sort = '-createdAt', search, category, chefId } = {};
	const recipes = await getRecipes(page, limit, sort, search, category, chefId);
	const recentRecipes = recipes.data.recipes;
	return { 
		success: true,
		data: {
			chefCount,
			foodieCount,
			recipeCount,
			recentRecipes
		}
	};
};

const flagRecipe = async (id, flagged) => {
	const recipe = await Recipe.findByIdAndUpdate(id, { flagged }, { returnDocument: 'after' });
	if (!recipe) {
		const error = new Error("Recipe not found");
		error.statusCode = 404;
		throw error;
	}
	return {
		success: true,
		message: "Recipe flagged status updated",
		data: { recipe }
	};
};

module.exports = {
	stats,
	flagRecipe
}