const userServices = require('../services/user.service');

const register = async (req, res) => {
	const data = req.body;
	if (!data) {
		const error = new Error('No body provided');
		error.statusCode = 400;
		throw error;
	}

	const result = await userServices.register(data);

	const refreshToken = result.refreshToken;
	delete result.refreshToken;
	res.cookie('jwt', refreshToken.token, refreshToken.config);

	res.status(201).json(result);
}

const login = async (req, res) => {
	const data = req.body;
	if (!data) {
		const error = new Error('No body provided');
		error.statusCode = 400;
		throw error;
	}
	const { email, password } = data;

	const errors = [];

	const emailIsEmpty = !email || email.trim() === '';
	if (emailIsEmpty) errors.push('Email is required');

	const passwordIsEmpty = !password || password.trim() === '';
	if (passwordIsEmpty) errors.push('Password is required');

	if (errors.length > 0 ){
		const error = new Error('Missing fields');
		error.statusCode = 400;
		error.errorList = errors;
		throw error;
	}

	const result = await userServices.login(data.email, data.password);

	const refreshToken = result.refreshToken;
	delete result.refreshToken;
	res.cookie('jwt', refreshToken.token, refreshToken.config);

	res.status(200).json(result);
}

const getProfile = async (req, res) => {
	const userId = req.user.id;
	const result = await userServices.getProfile(userId);
	res.status(200).json(result);
}

const getPortfolio = async (req, res) => {
	const {id: chefId} = req.params;
	const result = await userServices.getPortfolio(chefId);
	res.status(200).json(result);
}

const updatePortfolio = async (req, res) => {
	const userId = req.user.id;
	const fileBuffer = req.file ? req.file.buffer : null;

	const data = req.body;
	if (!data) {
		const error = new Error('No body provided');
		error.statusCode = 400;
		throw error;
	}
	const result = await userServices.updatePortfolio(userId, data, fileBuffer);

	res.status(200).json(result);

}

const refreshToken = async (req, res) => {
	const refreshToken = req.cookies?.jwt;
	if (!refreshToken) {
		const error = new Error('Unauthorized access');
		error.statusCode = 401;
		throw error;
	}

	const result = await userServices.refreshToken(refreshToken);
	res.status(200).json(result);
}

const uploadAvatar = async (req, res) => {
	const file = req.file;
	const userId = req.user.id;
	if(!file) {
		const error = new Error('Profile pic is need');
		error.statusCode = 400;
		throw error;
	}

	const result = await userServices.uploadAvatar(file.buffer, userId);
	res.status(200).json(result);

}

const updateProfile = async (req, res) => {
	const userId = req.user.id;
	const data = req.body;
	if (!data) {
		const error = new Error('No body provided');
		error.statusCode = 400;
		throw error;
	}

	const result = await userServices.updateProfile(userId, data);
	res.status(200).json(result);
}

const logout = async (req, res) => {
	res.clearCookie('jwt', { httpOnly: true });
	res.status(200).json({
		success: true,
		message: "Logged out successfully"
	});
}

module.exports = {
	register,
	login,
	getProfile,
	refreshToken,
	uploadAvatar,
	logout,
	updateProfile,
	getPortfolio,
	updatePortfolio
}