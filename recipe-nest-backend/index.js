const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

require('./src/configs/database');

const { PORT } = require('./src/configs/config');

app.use(express.json());
app.use(cookieParser());

const userRoutes = require('./src/routes/user.routes');

app.use('/users', userRoutes);

const errorHandler = require('./src/middlewares/error-handler.middleware');
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`The server is running on port ${PORT}`);
})
