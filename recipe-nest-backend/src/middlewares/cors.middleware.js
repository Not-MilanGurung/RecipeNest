const cors = require('cors');

const allowedOrigins = [
	'http://localhost:5173'
];

const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (mobile apps, etc.)
		// if (!origin) return callback(null, true);
		
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			const error = new Error('Not allowed by CORS');
			error.statusCode = 403;
			callback(error);
		}
	},
	credentials:true,
	methods: ['GET', 'POST', 'PUT', 'DELETE' ],
	allowedHeaders: ['Content-Type', 'Authorization']
}

const configuredCors = cors(corsOptions);

module.exports = configuredCors;