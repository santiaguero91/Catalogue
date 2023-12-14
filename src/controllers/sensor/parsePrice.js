function parsePrice(price) {
	if (!price || price === "pending") {
		return 0;
	}
	const numericValue = parseFloat(price.replace("$", "").trim());
	return isNaN(numericValue) ? 0 : numericValue;
}
