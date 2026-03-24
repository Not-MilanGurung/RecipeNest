const { User, userRoles } = require('../models/user.model');
const cloudinary = require('../configs/cloudinary');
const jwt = require('jsonwebtoken');
const { JWT_REFRESH_SECRET } = require('../configs/config');


const register = async (data) => {
	const existingUser = await User.findOne({ email: data.email });
	if (existingUser) {
		const error = new Error('User already exists with this email');
		error.statusCode = 400;
		throw error;
	}

	const newUser = new User({
		name: data.name,
		email: data.email,
		password: data.password,
		role: data.role
	});

	await newUser.save();
	const user = newUser.toJSON();
	delete user.password;
	const accessToken = newUser.generateAccessToken();
	const refreshToken = newUser.generateRefreshToken();

	return {
		refreshToken,
		success: true,
		message: 'User registerd successfully',
		data: { user: user, tokens: { accessToken }}
	};
}

const login = async (email, password) => {
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		const error = new Error('Invalid email or password');
		error.statusCode = 401;
		throw error;
	}

	if (!user.isActive) {
		const error = new Error('Your account has been deactivated');
		error.statusCode = 403;
		throw error;
	}
	const isPasswordValid = await user.comparePassword(password);
	if (!isPasswordValid) {
		const error = new Error('Invalid email or password');
		error.statusCode = 401;
		throw error;
	}

	const data = user.toJSON();
	delete data.password;
	const accessToken = user.generateAccessToken();
	const refreshToken = user.generateRefreshToken();

	return {
		refreshToken,
		success: true,
		message: 'Login succesfull',
		data: { data, tokens: { accessToken}}
	};
}

const refreshToken = async (refreshToken) => {
	const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
	const user = await User.findById(decoded.id);

	if (!user) {
		const error = new Error('User not found with this token');
		error.statusCode = 401;
		throw error;
    }

	const accessToken = user.generateAccessToken();

	return {
		success: true,
		message: 'Access token generated successfully',
		data: { accessToken }
	};
}

const getProfile = async (userId) => {
	const user = await User.findById(userId);
	if (!user) {
		const error = new Error('User not found');
		error.statusCode = 404;
		throw error;
	}

	return {
		success: true,
		message: 'Loaded profile successfully',
		data: { user }
	};
}

const uploadAvatar = async (fileBuffer, userId) => {
	const user = await User.findById(userId);
	if (!user) {
		const error = new Error('User not found');
		error.statusCode = 401;
		throw error;
	}
	const result = await new Promise( (resolve, reject) => {
		cloudinary.uploader.upload_stream(
			{
				folder: `${cloudinary.rootFolder}/avatars`,
				public_id: userId,
				overwrite: true,
				resource_type: 'image',
				transformation: [
					{ width: 300, height: 300, crop: 'auto' },
					{ fetch_format: 'auto', quality: 'auto'},
					{ gravity: 'face' }
				]
			},
			(error, uploadResult) => {
				if (error) return reject(error);
				return resolve(uploadResult);
			}
		).end(fileBuffer);
	});
	
	
	user.avatar = result.secure_url;
	await user.save();
	
	return {
		success: true,
		message: 'User avatar uploaded',
		data: {
			user
		}
	};
}

module.exports = {
	register,
	login,
	getProfile,
	refreshToken,
	uploadAvatar
}