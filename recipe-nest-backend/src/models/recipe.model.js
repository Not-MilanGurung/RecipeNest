const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name"],
			trim: true,
			maxlength: [100, 'Name cannot be more than 100 characters'],
		},
		image: {
			type: String,
			default: null,
		},
		steps: {
			type: [String],
			required: [true, "Please provied the steps"]
		},
		ingredients: {
			type: [{ type:String, maxlength: [50, 'An ingredient can not be more than 50 characters'] }],
			required: [true, 'Please provide ingredients list']
		},
		utensils: {
			type: [{
				type: String,
				maxlength: [50, 'Utensil name can not be more than 50 characters']
			}],
			default: null
		},
		description: {
			type: String,
			required: [true, "Please provide a description"]
		},
		metrics: {
			type: {
				preptime: {
					type: String,
					maxlength: [15, 'Preptime can not be more than 15 characters']
				},
				cooktime: {
					type: String,
					maxlength: [15, 'Preptime can not be more than 15 characters']
				}
			}
		},
		chef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Chef id is required"]
		}
	},
	{
		timestamps: true
	}
)

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;