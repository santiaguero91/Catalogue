const mongoose = require("mongoose");

db = async (req, res) => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			dbName: "sensors_old",
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		const collection = mongoose.connection.db.collection("sensors_old");

		mongoose.disconnect();

		return collection;
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports = { db };
