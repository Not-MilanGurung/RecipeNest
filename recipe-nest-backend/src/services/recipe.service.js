const Recipe = require('../models/recipe.model');
const cloudinary = require('../configs/cloudinary');
const { User, userRoles } = require('../models/user.model');

const getById = async (id) => {
	const recipe = await Recipe.findById(id)
		.populate('chef', '_id name role avatar');
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

const get = async (page, limit, sort, filter) => {
	const recipes = await Recipe.find(filter)
		.select('name chef image description metrics category flagged')
		.populate('chef', '_id name role avatar')
		.skip((page - 1) * limit)
		.limit(limit)
		.sort(sort);
	const total = await Recipe.countDocuments(filter);
	return {
		success: true,
		data: {
			recipes,
			pagination: { page, limit, total, pages: Math.ceil(total / limit) },
		}
	}
}

const handleImage = async (imageBuffer, recipeId) => {
	const result = await new Promise( (resolve, reject) => {
		cloudinary.uploader.upload_stream(
			{
				folder: `${cloudinary.rootFolder}/recipes`,
				public_id: recipeId,
				overwrite: true,
				resource_type: 'image',
				transformation: [
					{ width: 1200, height: 1200, crop: 'auto' },
					{ fetch_format: 'auto', quality: 'auto'},
				]
			},
			(error, uploadResult) => {
				if (error) return reject(error);
				return resolve(uploadResult);
			}
		).end(imageBuffer);
	});

	return result;
}

const create = async (userId, data, imageBuffer) => {
	const recipe = new Recipe(data);
	recipe.chef = userId;

	if (imageBuffer) {
		const image = await handleImage(imageBuffer, recipe._id);
		recipe.image = image.secure_url;
	}

	await recipe.save();

	return {
		success: true,
		message: 'Recipe created successfully',
		data: {recipe}
	}
}

const updateById = async (recipeId, userId, data, imageBuffer) => {
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		const error = new Error('Recipe not found');
		error.statusCode = 404;
		throw error;
	}

	if (!recipe.chef.equals(userId)){
		const error = new Error('Unauthorized action');
		error.statusCode = 403;
		throw error;
	}

	const allowedUpdates = ['name', 'steps', 'ingredients', 'description', 'utensils', 'metrics', 'category'];
	const filteredData = {};
	for (const key of allowedUpdates) {
		if (data[key] !== undefined) {
			filteredData[key] = data[key];
		}
	}
	
	if (imageBuffer) {
		const image = await handleImage(imageBuffer, recipe._id);
		filteredData.image = image.secure_url;
	}

	const updated = await Recipe.findByIdAndUpdate(recipe._id, filteredData, {
		returnDocument: 'after',
		runValidators: true
	})

	return {
		success: true,
		message: 'Recipe updated succesfully',
		data: { updated },
	} 
}

const deleteById = async (userId, recipeId) => {
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		const error = new Error("Recipe not found");
		error.statusCode = 404;
		throw error;
	}
	const user = await User.findById(userId);
	if (!user) {
		const error = new Error("User not found");
		error.statusCode = 404;
		throw error;
	}

	const userIsCreatorOrAdmin = recipe.chef.equals(user._id) || user.role === userRoles.values.ADMIN;
	if (!userIsCreatorOrAdmin){
		const error = new Error("Unauthorized action");
		error.statusCode = 403;
		throw error;
	}

	await recipe.deleteOne();
	return {
		success: true,
		message: "Recipe deleted successfully"
	}
}

module.exports = {
	getById,
	get,
	create,
	updateById,
	deleteById
}