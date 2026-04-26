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
			validate: {
				validator: function(v) {
					return v.length >= 1 && v.length <= 100;
				},
				message: "Steps list must be between 1 to 100 "
			}
		},
		ingredients: {
			type: [ 
				{
					name: { type:String, maxlength: [50, 'An ingredient can not be more than 50 characters'] },
					unit: { type:String, maxlength: [20, 'Unit can not be more than 20 characters']},
					quantity: { type:Number, min:1}
				}
			],
			validate: {
				validator: function(v) {
					return v.length >= 1 && v.length <= 100;
				},
				message: "Ingredients list must be between 1 to 100 "
			}
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
		category: {
			type: String,
			required: [true, "Please provide a category"],
			enum: {
				values: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'],
				message: '{VALUE} is not a valid category'
			},
			default: 'Dinner'
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
				},
				servings: {
					type: Number,
					min: 1,
					default: 1
				}
			}
		},
		chef: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Chef id is required"]
		},
		flagged: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
)

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;