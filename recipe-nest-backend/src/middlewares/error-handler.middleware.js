const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const output = { 
		success: false,
		message: err.message || 'Internal server error' 
	};

	if (err.errorList) output.errors = err.errorList;

	console.error('Error stack: ',err.stack);

	res.status(statusCode).json(output);
}

module.exports = errorHandler;