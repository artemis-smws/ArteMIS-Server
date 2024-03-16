// input whole data response
function getBuildingName(data) {
	if (!data) return;
	if (Array.isArray(data)) {
		const dataKeys = Object.keys(data[0]);
		return dataKeys.filter(
			(key) =>
				key != "overall_weight" &&
				key != "id" &&
				key != "createdAt" &&
				key != "overall_residual" &&
				key != "overall_recyclable" &&
				key != "overall_biodegradable" &&
				key != "overall_infectious"
		);
	}
    return 
}

module.exports = getBuildingName;
