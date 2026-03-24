const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = require('../configs/config');

const userRoles = Object.freeze({
	values: {
		FOODIE: 'foodie',
		CHEF: 'chef',
		ADMIN: 'admin',
	},

	isValid(value) {
		return Object.values(this.values).includes(value);
	},
});

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name"],
			trim: true,
			maxlength: [50, 'Name cannot be more than 50 characters'],
		},
		email: {
			type: String,
			required: [true, 'Please provide an email'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please provide a valid email",
			]
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: [8, "Password must be at least 8 characters"],
			select: false
		},
		role: {
			type: String,
			enum: Object.values(userRoles.values),
			default: userRoles.values.FOODIE,
		},
		avatar: {
			type: String,
			default: null,
		},
		phone: {
			type: String,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
	
);

userSchema.pre('save', async function() {
	if (!this.isModified('password')) return;

	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {

	return await bcrypt.compare(candidatePassword, this.password);
} 

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			id: this._id,
			email: this.email,
			role: this.role
		},
		JWT_ACCESS_SECRET,
		{
			expiresIn: JWT_ACCESS_EXPIRES_IN
		}
	);

}

userSchema.methods.generateRefreshToken = function () {
	return {
		token: jwt.sign(
			{
				id: this._id,
			},
			JWT_REFRESH_SECRET,
			{
				expiresIn: JWT_REFRESH_EXPIRES_IN
			}
		),
		config: {
			httpOnly: true,
			sameSite: 'None', secure: true,
            maxAge: 24 * 60 * 60 * 1000
		}
	};
}

const User = mongoose.model('User', userSchema);

module.exports ={
	userRoles,
	User
}
