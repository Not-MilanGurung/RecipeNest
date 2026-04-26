const recipeService = require('../services/recipe.service');

const getRecipes = async (req, res) => {
    // Destructure specifically for filtering
    const { page = 1, limit = 10, sort = '-createdAt', search, category, chefId } = req.query;
    
    // Build the MongoDB filter object
    const mongoFilter = {};
    
    // Add fuzzy search for names
    if (search) {
        mongoFilter.name = { $regex: search, $options: 'i' };
    }
    
    // Exact match for category
    if (category) {
        mongoFilter.category = Array.isArray(category) ? { $in: category } : category;
    }

	if (chefId) {
		mongoFilter.chef = chefId;
	}

    const result = await recipeService.get(
        parseInt(page), 
        parseInt(limit), 
        sort, 
        mongoFilter
    );
    res.status(200).json(result);
}

const getRecipeById = async (req, res) => {
	const { id } = req.params;

	const result = await recipeService.getById(id);
	res.status(200).json(result);
}

const createRecipe = async (req, res) => {
	const data = req.body;
	if (!data) {
		const error = new Error('No body provided');
		error.statusCode = 400;
		throw error;
	}

	const recipeData = {
		...req.body,
		metrics: JSON.parse(req.body.metrics),
		ingredients: JSON.parse(req.body.ingredients),
		steps: JSON.parse(req.body.steps)
	}
	const imageBuffer = req.file?.buffer;
	const userId = req.user.id;
	
	const result = await recipeService.create(userId, recipeData, imageBuffer);
	res.status(201).json(result);
}

const updateRecipe = async (req, res) => {
	const { id } = req.params;
	const data = req.body;
	if (!data) {
		const error = new Error('No body provided');
		error.statusCode = 400;
		throw error;
	}

	const recipeData = {
		...req.body,
		metrics: JSON.parse(req.body.metrics),
		ingredients: JSON.parse(req.body.ingredients),
		steps: JSON.parse(req.body.steps)
	}

	const imageBuffer = req.file.buffer;
	const userId = req.user.id;

	const result = await recipeService.updateById(id, userId, recipeData, imageBuffer);
	res.status(200).json(result);
}

const deleteRecipe = async (req, res) => {
	const userId = req.user.id;
	const {id} = req.params;

	const result = await recipeService.deleteById(userId, id);
	res.status(200).json(result);
}

module.exports = {
	getRecipes,
	getRecipeById,
	createRecipe,
	updateRecipe,
	deleteRecipe
}