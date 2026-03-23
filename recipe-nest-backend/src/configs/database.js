const mongoose = require('mongoose');
const { DB_URL } = require('./config');

mongoose.connect(DB_URL);

const database = mongoose.connection;

database.on('error', console.error.bind(console, "connection error: "));
database.once('open', () => {
	console.log('Database connected');
});

module.exports = database;