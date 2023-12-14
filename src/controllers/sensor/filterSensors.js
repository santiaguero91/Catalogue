const mongoose = require("mongoose");
const { db } = require("./db");

filterSensors = async (req, res) => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			dbName: "sensors_old",
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		const collection = mongoose.connection.db.collection("sensors_old");

		let documents = await collection.find().toArray();

		let filteredDocuments = [...documents];

		mongoose.disconnect();

		const query = req.query;

		//*Dynamic filtering by query parameters
		if (query.Brand) {
			filteredDocuments = filteredDocuments.filter((item) => {
				return item.Brand === req.query.Brand;
			});
		}
		if (query.Model) {
			filteredDocuments = filteredDocuments.filter((item) => {
				return item.Model === req.query.Model;
			});
		}
		if (query.Category) {
			filteredDocuments = filteredDocuments.filter((item) => {
				return item["Category|Market"] === req.query.Category;
			});
		}
		if (query.OrderPrice) {
			const property = "PricePartner51-100sensors";
			switch (query.OrderPrice) {
				case "asc": //****ARREGLAR */
					filteredDocuments = filteredDocuments.sort((a, b) => {
						let numA = parsePrice(a[property]);
						let numB = parsePrice(b[property]);
						return numA - numB;
					});
					break;
				case "desc": //****ARREGLAR */
					filteredDocuments = filteredDocuments.sort((a, b) => {
						let numA = parsePrice(a[property]);
						let numB = parsePrice(b[property]);
						return numB - numA;
					});
					break;
				default:
					break;
			}
		}

		//*rangos: ver
		/*if (req.query.PriceMin && req.query.PriceMax) {
			filteredDocuments = filteredDocuments.filter((item) => {
				const realPrice = parseInt(item["ListPriceUSDExWorkMiami"]);
        const priceMax = req.query.PriceMin
				return realPrice <= priceMax && realPrice >= priceMin;
			});
		}*/

		res.status(200).json({ data: filteredDocuments });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

module.exports = { filterSensors };

function parsePrice(price) {
	if (!price || price === "pending") {
		return 0;
	}
	const numericValue = parseFloat(price.replace("$", "").trim());
	return isNaN(numericValue) ? 0 : numericValue;
}
