const adminService = require('../services/admin.service');

const stats = async (req, res) => {
	const data = await adminService.stats();
	res.status(200).json(data);
};

const flagRecipe = async (req, res) => {
	const { id } = req.params;
	const { flagged } = req.body;
	if (flagged === undefined) {
		const error = new Error("Flagged status is required");
		error.statusCode = 400;
		throw error;
	}
	const data = await adminService.flagRecipe(id, flagged);
	res.status(200).json(data);
};

module.exports = {
	stats,
	flagRecipe
}