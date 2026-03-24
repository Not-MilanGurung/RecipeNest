require('dotenv').config();

const config = {
	PORT: process.env.PORT,

	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
	JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,

	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

	DB_URL: process.env.DB_URL,

	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}

module.exports = config;