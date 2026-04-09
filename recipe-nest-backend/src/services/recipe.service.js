const Recipe = require('../models/recipe.model');
const { User } = require('../models/user.model');

const getById = async (id) => {
	const recipe = await Recipe.findById(id);
	if (!recipe) {
		const error = new Error("Recipe not found");
		error.statusCode = 404;
		throw error;
	}

	return {
		success: true,
		message: "Recipe found",
		data: {
			recipe
		}
	}
}

const create = async (userId, data) => {
	const recipe = new Recipe({
		name: data.name,
		description: data.description,
		image: data.image,
		ingredients: data.ingredients,
		metrics: data.metrics,
		steps: data.steps,
		utensils: data.utensils,
		chef: userId
	});

	await recipe.save;

	return {
		success: true,
		message: 'Recipe created successfully',
		data: {recipe}
	}
}

const deleteById = async (userId, recipeId) => {
	const recipe = await Recipe.findById(recipeId);

	const userIsCreator = recipe.chef.equals(userId);
	if (!userIsCreator){
		const error = new Error("Unauthorized action");
		error.statusCode = 401;
		throw error;
	}

	await recipe.deleteOne();
	return {
		success: true,
		message: "Recipe deleted successfully"
	}
}